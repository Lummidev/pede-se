import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected orderTableName = 'orders'
  protected pivotTableName = 'order_products'

  async up() {
    this.schema.createTable(this.orderTableName, (table) => {
      table.uuid('id').primary().notNullable().defaultTo(this.raw('uuidv4()'))
      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
    this.schema.createTable(this.pivotTableName, (table) => {
      table.uuid('id').primary().notNullable().defaultTo(this.raw('uuidv4()'))
      table
        .uuid('order_id')
        .notNullable()
        .references('id')
        .inTable(this.orderTableName)
        .onDelete('CASCADE')
      table
        .uuid('product_id')
        .notNullable()
        .references('id')
        .inTable('products')
        .onDelete('CASCADE')
      table.unique(['order_id', 'product_id'])
      table.integer('amount').unsigned().notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.pivotTableName)
    this.schema.dropTable(this.orderTableName)
  }
}
