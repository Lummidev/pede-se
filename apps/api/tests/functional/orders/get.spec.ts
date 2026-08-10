import Product from '#models/product'
import Order from '#models/order'
import User from '#models/user'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('Get order', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  test('Get an order after creating it', async ({ client }) => {
    await testUtils.db().seed()
    const user = await User.firstOrFail()
    const product = await Product.firstOrFail()
    const storeResponse = await client
      .visit('orders.store')
      .json({
        products: [
          {
            id: product.id,
            amount: 2,
          },
        ],
      })
      .withGuard('api')
      .loginAs(user)
    const storeBody = storeResponse.body()
    const response = await client
      .visit('orders.show', { id: storeBody.data.id })
      .withGuard('api')
      .loginAs(user)
    response.assertOk()
    response.assertBodyContains({
      data: {
        user: {
          id: user.id,
        },
        products: [
          {
            id: product.id,
            priceCents: product.priceCents,
            pivot: {
              amount: 2,
            },
          },
        ],
      },
    })
  })
  test("Fail when trying to get an order which isn't owned by the logged in user", async ({
    client,
  }) => {
    await testUtils.db().seed()
    const user = await User.create({
      name: 'test User',
      email: 'test@example.com',
      password: 'test',
      phoneNumber: '11111111111',
    })
    const order = await Order.firstOrFail()
    const response = await client
      .visit('orders.show', { id: order.id })
      .withGuard('api')
      .loginAs(user)
    response.assertNotFound()
  })
})
