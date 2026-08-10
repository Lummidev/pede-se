import factory from '@adonisjs/lucid/factories'
import Product from '#models/product'

export const ProductFactory = factory
  .define(Product, async ({ faker }) => {
    return {
      name: faker.food.dish(),
      description: faker.food.description(),
      priceCents: faker.number.int(50000),
    }
  })
  .build()
