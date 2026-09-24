import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'roles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('name').unique().notNullable()
    })
    this.schema.alterTable('users', (table) => {
      table
        .integer('role_id')
        .nullable()
        .references('id')
        .inTable(this.tableName)
        .onDelete('SET NULL')
    })
  }

  async down() {
    this.schema.alterTable('users', (table) => {
      table.dropColumn('role_id')
    })
    this.schema.dropTable(this.tableName)
  }
}
