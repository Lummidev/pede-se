import { OrderFactory } from '#database/factories/order_factory'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const users = await User.all()
    for (const user of users) {
      await OrderFactory.merge({ userId: user.id }).createMany(3)
    }
  }
}
