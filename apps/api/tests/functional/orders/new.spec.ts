import Product from '#models/product'
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
  test('New order with 2 products', async ({ client, db }) => {
    const user = await createTestUser()
    const [productA, productB] = [
      await Product.create({ name: 'Test product 1', priceCents: 1111 }),
      await Product.create({ name: 'Test product 2', priceCents: 2222 }),
    ]
    const productAAmount = 1
    const productBAmount = 2
    const response = await client
      .visit('orders.store')
      .json({
        products: [
          {
            id: productA.id,
            amount: productAAmount,
          },
          {
            id: productB.id,
            amount: productBAmount,
          },
        ],
      })
      .withGuard('api')
      .loginAs(user)
    response.assertOk()
    response.assertBodyContains({
      data: {
        products: [
          {
            id: productA.id,
            name: productA.name,
            priceCents: productA.priceCents,
            pivot: { amount: productAAmount },
          },
          {
            id: productB.id,
            name: productB.name,
            priceCents: productB.priceCents,
            pivot: { amount: productBAmount },
          },
        ],
      },
    })
    const {
      data: { id: savedOrderId },
    } = response.body()
    await db.assertHas('orders', { id: savedOrderId, user_id: user.id })
    await db.assertHas('order_products', { order_id: savedOrderId }, 2)
    await db.assertHas('order_products', { product_id: productA.id }, 1)
    await db.assertHas('order_products', { product_id: productB.id }, 1)
  })
  test('Fail if order has duplicate products', async ({ client, db }) => {
    const user = await createTestUser()
    const [productA, productB] = [
      await Product.create({ name: 'Test product 1 (for duplication test)', priceCents: 1111 }),
      await Product.create({ name: 'Test product 2', priceCents: 2222 }),
    ]
    const requestProducts = [
      { id: productA.id, amount: 1 },
      { id: productB.id, amount: 2 },
      { id: productA.id, amount: 3 },
    ]
    const response = await client
      .visit('orders.store')
      .json({ products: requestProducts })
      .withGuard('api')
      .loginAs(user)
    response.assertUnprocessableEntity()
    await db.assertEmpty('orders')
    await db.assertEmpty('order_products')
  })
  test('Fail if order has no products', async ({ client, db }) => {
    const user = await createTestUser()
    const response = await client.visit('orders.store').withGuard('api').loginAs(user)
    response.assertUnprocessableEntity()
    await db.assertEmpty('orders')
    await db.assertEmpty('order_products')
  })
  test('Fail if order has empty products array', async ({ client, db }) => {
    const user = await createTestUser()
    const response = await client
      .visit('orders.store')
      .json({ products: [] })
      .withGuard('api')
      .loginAs(user)
    response.assertUnprocessableEntity()
    await db.assertEmpty('orders')
    await db.assertEmpty('order_products')
  })
  test('Fail with no authentication', async ({ client, db }) => {
    const response = await client.visit('orders.store')
    response.assertUnauthorized()
    await db.assertEmpty('orders')
    await db.assertEmpty('order_products')
  })
})
