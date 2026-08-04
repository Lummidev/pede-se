import Order from '#models/order'
import OrderItem from '#models/order_item'
import User from '#models/user'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import { assertNoModelChange } from './util.ts'

test.group('Deletes orders', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())
  test('Deletes an order and its items', async ({ client, db }) => {
    await testUtils.db().seed()
    const { id, user } = await Order.query().preload('user').firstOrFail()
    await db.assertHas('order_items', { order_id: id })
    const response = await client.visit('orders.destroy', { id }).withGuard('api').loginAs(user)
    response.assertOk()
    await db.assertMissing('orders', { id })
    await db.assertMissing('order_items', { order_id: id })
  })
  test("Fail when trying to delete an order which the current user doesn't own", async ({
    client,
    assert,
  }) => {
    await testUtils.db().seed()
    const order = await Order.query().firstOrFail()
    const orderItems = await OrderItem.findManyBy({ orderId: order.id })

    const newUser = await User.create({
      name: 'test User',
      email: 'test@example.com',
      password: 'test',
      phoneNumber: '11111111111',
    })
    const response = await client
      .visit('orders.destroy', { id: order.id })
      .withGuard('api')
      .loginAs(newUser)
    response.assertNotFound()
    await assertNoModelChange(assert, Order, order)
    for (const orderItem of orderItems) {
      await assertNoModelChange(assert, OrderItem, orderItem)
    }
  })
  test('Fail when unauthenticated', async ({ assert, client }) => {
    await testUtils.db().seed()
    const order = await Order.query().firstOrFail()
    const orderItems = await OrderItem.findManyBy({ orderId: order.id })
    const response = await client.visit('orders.destroy', { id: order.id })
    response.assertUnauthorized()
    await assertNoModelChange(assert, Order, order)
    for (const orderItem of orderItems) {
      await assertNoModelChange(assert, OrderItem, orderItem)
    }
  })
})
