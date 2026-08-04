import Item from '#models/item'
import User from '#models/user'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

const createTestUser = async () => {
  return await User.create({
    name: 'test User',
    email: 'test@example.com',
    password: 'test',
    phoneNumber: '11111111111',
  })
}

test.group('Sending new orders', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())
  test('New order with 2 items', async ({ client, db }) => {
    const user = await createTestUser()
    const [itemA, itemB] = [
      await Item.create({ name: 'Test item 1', priceCents: 1111 }),
      await Item.create({ name: 'Test item 2', priceCents: 2222 }),
    ]
    const itemAAmount = 1
    const itemBAmount = 2
    const response = await client
      .visit('orders.store')
      .json({
        items: [
          {
            id: itemA.id,
            amount: itemAAmount,
          },
          {
            id: itemB.id,
            amount: itemBAmount,
          },
        ],
      })
      .withGuard('api')
      .loginAs(user)
    response.assertOk()
    response.assertBodyContains({
      data: {
        items: [
          {
            id: itemA.id,
            name: itemA.name,
            priceCents: itemA.priceCents,
            pivot: { amount: itemAAmount },
          },
          {
            id: itemB.id,
            name: itemB.name,
            priceCents: itemB.priceCents,
            pivot: { amount: itemBAmount },
          },
        ],
      },
    })
    const {
      data: { id: savedOrderId },
    } = response.body()
    await db.assertHas('orders', { id: savedOrderId, user_id: user.id })
    await db.assertHas('order_items', { order_id: savedOrderId }, 2)
    await db.assertHas('order_items', { item_id: itemA.id }, 1)
    await db.assertHas('order_items', { item_id: itemB.id }, 1)
  })
  test('Fail if order has duplicate items', async ({ client, db }) => {
    const user = await createTestUser()
    const [itemA, itemB] = [
      await Item.create({ name: 'Test item 1 (for duplication test)', priceCents: 1111 }),
      await Item.create({ name: 'Test item 2', priceCents: 2222 }),
    ]
    const requestItems = [
      { id: itemA.id, amount: 1 },
      { id: itemB.id, amount: 2 },
      { id: itemA.id, amount: 3 },
    ]
    const response = await client
      .visit('orders.store')
      .json({ items: requestItems })
      .withGuard('api')
      .loginAs(user)
    response.assertUnprocessableEntity()
    await db.assertEmpty('orders')
    await db.assertEmpty('order_items')
  })
  test('Fail if order has no items', async ({ client, db }) => {
    const user = await createTestUser()
    const response = await client.visit('orders.store').withGuard('api').loginAs(user)
    response.assertUnprocessableEntity()
    await db.assertEmpty('orders')
    await db.assertEmpty('order_items')
  })
  test('Fail if order has empty items array', async ({ client, db }) => {
    const user = await createTestUser()
    const response = await client
      .visit('orders.store')
      .json({ items: [] })
      .withGuard('api')
      .loginAs(user)
    response.assertUnprocessableEntity()
    await db.assertEmpty('orders')
    await db.assertEmpty('order_items')
  })
  test('Fail with no authentication', async ({ client, db }) => {
    const response = await client.visit('orders.store')
    response.assertUnauthorized()
    await db.assertEmpty('orders')
    await db.assertEmpty('order_items')
  })
})
