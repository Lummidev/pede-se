import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'settings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('id').unsigned().notNullable().primary().defaultTo(1)
      table.string('store_name').notNullable()
      table.string('welcome_message')
      table.string('contact_info')
      table.string('currency')
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.check('?? = ??', ['id', 1])
    })
    this.defer(async (db) => {
      await db.table(this.tableName).insert({
        store_name: 'Pede-se Store',
        currency: 'BRL',
      })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
