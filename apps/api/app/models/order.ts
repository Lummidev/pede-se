import { OrderSchema } from '#database/schema'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Product from '#models/product'
import { belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import User from '#models/user'
import { compose } from '@adonisjs/core/helpers'
import { WithPrimaryUuid } from '#mixins/with_primary_uuid'

export default class Order extends compose(OrderSchema, WithPrimaryUuid) {
  @manyToMany(() => Product, {
    pivotTable: 'order_products',
    pivotColumns: ['amount'],
  })
  declare products: ManyToMany<typeof Product>
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
