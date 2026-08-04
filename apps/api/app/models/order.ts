import { OrderSchema } from '#database/schema'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Item from '#models/item'
import { belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import User from '#models/user'

export default class Order extends OrderSchema {
  @manyToMany(() => Item, {
    pivotTable: 'order_items',
    pivotColumns: ['amount'],
  })
  declare items: ManyToMany<typeof Item>
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
