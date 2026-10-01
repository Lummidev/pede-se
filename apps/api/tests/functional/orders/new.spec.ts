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
  test('Creates a new order with {$self} product(s)')
    .with([1, 2, 3])
    .run(async ({ client, db }, testAmount) => {
      await testUtils.db().seed()
      const user = await createTestUser()
      const queriedProducts = await Product.query().limit(testAmount)
      const orderProducts = queriedProducts.map((product, i) => ({
        product,
        amount: i + 1,
      }))
      const jsonBody = {
        products: orderProducts.map((orderProduct) => ({
          id: orderProduct.product.id,
          amount: orderProduct.amount,
        })),
      }
      const response = await client
        .visit('orders.store')
        .json(jsonBody)
        .withGuard('api')
        .loginAs(user, [])
      response.assertOk()
      const {
        data: { id: savedOrderId },
      } = response.body()
      await db.assertHas('orders', { id: savedOrderId, user_id: user.id })
      await db.assertHas('order_products', { order_id: savedOrderId }, testAmount)
      for (const orderProduct of orderProducts) {
        await db.assertHas(
          'order_products',
          { order_id: savedOrderId, product_id: orderProduct.product.id },
          1
        )
        response.assertBodyContains({
          data: {
            products: [
              {
                id: orderProduct.product.id,
                name: orderProduct.product.name,
                priceCents: orderProduct.product.priceCents,
                pivot: {
                  amount: orderProduct.amount,
                },
              },
            ],
          },
        })
      }
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
      .loginAs(user, [])
    response.assertUnprocessableEntity()
    await db.assertEmpty('orders')
    await db.assertEmpty('order_products')
  })
  test('Fail if order has no products (case: {description})')
    .with([
      { description: 'products = []', products: [] },
      { description: 'products = undefined', products: undefined },
    ])
    .run(async ({ client, db }, testCase) => {
      const user = await createTestUser()
      const response = await client
        .visit('orders.store')
        .json({ products: testCase.products as any })
        .withGuard('api')
        .loginAs(user, [])
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
