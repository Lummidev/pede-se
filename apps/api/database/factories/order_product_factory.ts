import factory from '@adonisjs/lucid/factories'
import OrderProduct from '#models/order_product'

export const OrderProductFactory = factory
  .define(OrderProduct, async ({ faker }) => {
    return {
      amount: faker.number.int(100),
    }
  })
  .build()
