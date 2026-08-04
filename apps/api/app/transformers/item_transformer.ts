import { BaseTransformer } from '@adonisjs/core/transformers'
import type Item from '#models/item'

export default class ItemTransformer extends BaseTransformer<Item> {
  toObject() {
    return {
      ...this.pick(this.resource, ['id', 'name', 'priceCents']),
    }
  }
  forItemPage() {
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
