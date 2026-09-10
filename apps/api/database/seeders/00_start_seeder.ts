import Setting from '#models/setting'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
export default class extends BaseSeeder {
  async run() {
    Setting.create({
      storeName: 'Pede-se Store',
      currency: 'BRL',
    })
  }
}
