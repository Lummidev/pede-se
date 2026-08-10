import { BaseTransformer } from '@adonisjs/core/transformers'
import type Order from '#models/order'
import ProductTransformer from '#transformers/product_transformer'
import UserTransformer from '#transformers/user_transformer'

export default class OrderTransformer extends BaseTransformer<Order> {
  toObject() {
    return {
      ...this.pick(this.resource, ['id']),
      products: ProductTransformer.transform(this.resource.products).useVariant('forOrderView'),
      user: UserTransformer.transform(this.whenLoaded(this.resource.user))?.useVariant(
        'forOwnershipDisplay'
      ),
    }
  }
}
