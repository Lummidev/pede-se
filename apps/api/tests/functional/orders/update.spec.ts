import Item from '#models/item'
import Order from '#models/order'
import OrderItem from '#models/order_item'
import User from '#models/user'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import { assertNoModelChange } from './util.ts'

const createTestUser = async () => {
  return await User.create({
    name: 'test User',
    email: 'test@example.com',
    password: 'test',
    phoneNumber: '11111111111',
  })
}

test.group('Updating orders', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())
  test('Updates an existing order and add one more item', async ({ client, db }) => {
    await testUtils.db().seed()
    const {
      id: orderId,
      user,
      items: originalOrderItems,
    } = await Order.query().preload('user').preload('items').firstOrFail()

    const newItem = await Item.create({
      name: 'New item',
      priceCents: 10000,
    })

    const response = await client
      .visit('orders.update', { id: orderId })
      .json({
        items: [
          ...originalOrderItems.map((item) => ({
            id: item.id,
            amount: 1,
          })),
          {
            id: newItem.id,
            amount: 3,
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
            id: newItem.id,
            priceCents: newItem.priceCents,
            pivot: {
              amount: 3,
            },
          },
        ],
      },
    })
    await db.assertHas('order_items', { order_id: orderId, amount: 1 }, originalOrderItems.length)
    await db.assertHas('order_items', { order_id: orderId, amount: 3 }, 1)
  })
  test('Fail to update order if not authenticated', async ({ client, assert }) => {
    await testUtils.db().seed()
    const order = await Order.query().firstOrFail()
    const orderItems = await OrderItem.findManyBy({ orderId: order.id })
    const newItem = await Item.create({
      name: 'New item',
      priceCents: 10000,
    })
    const response = await client.visit('orders.update', { id: order.id }).json({
      items: [
        {
          id: newItem.id,
          amount: 3,
        },
      ],
    })
    response.assertUnauthorized()
    await assertNoModelChange(assert, Order, order)

    for (const orderItem of orderItems) {
      await assertNoModelChange(assert, OrderItem, orderItem)
    }
  })
  test('Fail to update order if trying to place duplicate items', async ({ client, assert }) => {
    await testUtils.db().seed()
    const order = await Order.query().preload('user').preload('items').firstOrFail()
    const orderItemsPivot = await OrderItem.findManyBy({ orderId: order.id })
    const repeatItem = order.items[0]
    const response = await client
      .visit('orders.update', { id: order.id })
      .json({
        items: [
          ...order.items.map((item) => ({
            id: item.id,
            amount: 1,
          })),
          {
            id: repeatItem.id,
            amount: 3,
          },
        ],
      })
      .withGuard('api')
      .loginAs(order.user)
    response.assertUnprocessableEntity()
    await assertNoModelChange(assert, Order, order)

    for (const orderItem of orderItemsPivot) {
      await assertNoModelChange(assert, OrderItem, orderItem)
    }
  })
  test("Fail to update order if trying to update an order which isn't owned by the logged-in user", async ({
    client,
    assert,
  }) => {
    await testUtils.db().seed()
    const order = await Order.query().firstOrFail()
    const orderItemsPivot = await OrderItem.findManyBy({ orderId: order.id })

    const newItem = await Item.create({
      name: 'New item',
      priceCents: 10000,
    })
    const newUser = await createTestUser()
    const response = await client
      .visit('orders.update', { id: order.id })
      .json({
        items: [
          {
            id: newItem.id,
            amount: 3,
          },
        ],
      })
      .withGuard('api')
      .loginAs(newUser)
    response.assertNotFound()
    await assertNoModelChange(assert, Order, order)
    for (const orderItem of orderItemsPivot) {
      await assertNoModelChange(assert, OrderItem, orderItem)
    }
  })
})
