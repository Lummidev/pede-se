import factory from '@adonisjs/lucid/factories'
import Item from '#models/item'

export const ItemFactory = factory
  .define(Item, async ({ faker }) => {
    return {
      name: faker.food.dish(),
      description: faker.food.description(),
      priceCents: faker.number.int(50000),
    }
  })
  .build()
