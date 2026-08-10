import { OrderSchema } from '#database/schema'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Product from '#models/product'
import { belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import User from '#models/user'

export default class Order extends OrderSchema {
  @manyToMany(() => Product, {
    pivotTable: 'order_products',
    pivotColumns: ['amount'],
  })
  declare products: ManyToMany<typeof Product>
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
