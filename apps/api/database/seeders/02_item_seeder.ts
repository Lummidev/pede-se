import { ItemFactory } from '#database/factories/item_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await ItemFactory.createMany(10)
  }
}
