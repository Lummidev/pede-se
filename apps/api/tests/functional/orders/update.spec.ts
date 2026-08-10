import Product from '#models/product'
import Order from '#models/order'
import OrderProduct from '#models/order_product'
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
  test('Updates an existing order and add one more product', async ({ client, db }) => {
    await testUtils.db().seed()
    const {
      id: orderId,
      user,
      products: originalOrderProducts,
    } = await Order.query().preload('user').preload('products').firstOrFail()

    const newProduct = await Product.create({
      name: 'New product',
      priceCents: 10000,
    })

    const response = await client
      .visit('orders.update', { id: orderId })
      .json({
        products: [
          ...originalOrderProducts.map((product) => ({
            id: product.id,
            amount: 1,
          })),
          {
            id: newProduct.id,
            amount: 3,
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
            id: newProduct.id,
            priceCents: newProduct.priceCents,
            pivot: {
              amount: 3,
            },
          },
        ],
      },
    })
    await db.assertHas(
      'order_products',
      { order_id: orderId, amount: 1 },
      originalOrderProducts.length
    )
    await db.assertHas('order_products', { order_id: orderId, amount: 3 }, 1)
  })
  test('Fail to update order if not authenticated', async ({ client, assert }) => {
    await testUtils.db().seed()
    const order = await Order.query().firstOrFail()
    const orderProducts = await OrderProduct.findManyBy({ orderId: order.id })
    const newProduct = await Product.create({
      name: 'New product',
      priceCents: 10000,
    })
    const response = await client.visit('orders.update', { id: order.id }).json({
      products: [
        {
          id: newProduct.id,
          amount: 3,
        },
      ],
    })
    response.assertUnauthorized()
    await assertNoModelChange(assert, Order, order)

    for (const orderProduct of orderProducts) {
      await assertNoModelChange(assert, OrderProduct, orderProduct)
    }
  })
  test('Fail to update order if trying to place duplicate products', async ({ client, assert }) => {
    await testUtils.db().seed()
    const order = await Order.query().preload('user').preload('products').firstOrFail()
    const orderProductsPivot = await OrderProduct.findManyBy({ orderId: order.id })
    const repeatProduct = order.products[0]
    const response = await client
      .visit('orders.update', { id: order.id })
      .json({
        products: [
          ...order.products.map((product) => ({
            id: product.id,
            amount: 1,
          })),
          {
            id: repeatProduct.id,
            amount: 3,
          },
        ],
      })
      .withGuard('api')
      .loginAs(order.user)
    response.assertUnprocessableEntity()
    await assertNoModelChange(assert, Order, order)

    for (const orderProduct of orderProductsPivot) {
      await assertNoModelChange(assert, OrderProduct, orderProduct)
    }
  })
  test("Fail to update order if trying to update an order which isn't owned by the logged-in user", async ({
    client,
    assert,
  }) => {
    await testUtils.db().seed()
    const order = await Order.query().firstOrFail()
    const orderProductsPivot = await OrderProduct.findManyBy({ orderId: order.id })

    const newProduct = await Product.create({
      name: 'New product',
      priceCents: 10000,
    })
    const newUser = await createTestUser()
    const response = await client
      .visit('orders.update', { id: order.id })
      .json({
        products: [
          {
            id: newProduct.id,
            amount: 3,
          },
        ],
      })
      .withGuard('api')
      .loginAs(newUser)
    response.assertNotFound()
    await assertNoModelChange(assert, Order, order)
    for (const orderProduct of orderProductsPivot) {
      await assertNoModelChange(assert, OrderProduct, orderProduct)
    }
  })
})
