import { BaseTransformer } from '@adonisjs/core/transformers'
import type Order from '#models/order'
import ItemTransformer from './item_transformer.ts'
import UserTransformer from './user_transformer.ts'

export default class OrderTransformer extends BaseTransformer<Order> {
  toObject() {
    return {
      ...this.pick(this.resource, ['id']),
      items: ItemTransformer.transform(this.resource.items).useVariant('forOrderView'),
      user: UserTransformer.transform(this.whenLoaded(this.resource.user))?.useVariant(
        'forOwnershipDisplay'
      ),
    }
  }
}
