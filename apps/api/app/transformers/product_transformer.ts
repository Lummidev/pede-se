import { BaseTransformer } from '@adonisjs/core/transformers'
import type Product from '#models/product'

export default class ProductTransformer extends BaseTransformer<Product> {
  toObject() {
    return {
      ...this.pick(this.resource, ['id', 'name', 'priceCents']),
    }
  }
  forProductPage() {
    return {
      ...this.toObject(),
      ...this.pick(this.resource, ['description', 'createdAt', 'updatedAt']),
    }
  }
  forOrderView() {
    return {
      ...this.toObject(),
      pivot: { amount: this.resource.$extras.pivot_amount },
    }
  }
}
