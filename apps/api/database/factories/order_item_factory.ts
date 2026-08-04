import factory from '@adonisjs/lucid/factories'
import OrderItem from '#models/order_item'

export const OrderItemFactory = factory
  .define(OrderItem, async ({ faker }) => {
    return {
      amount: faker.number.int(100),
    }
  })
  .build()
