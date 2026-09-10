import { ProductSchema } from '#database/schema'
import { compose } from '@adonisjs/core/helpers'
import { WithPrimaryUuid } from '#mixins/with_primary_uuid'

export default class Product extends compose(ProductSchema, WithPrimaryUuid) {}
