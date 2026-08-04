import Item from '#models/item'
import ItemTransformer from '#transformers/item_transformer'
import { ItemPagingQueryStringValidator, itemValidator } from '#validators/item'
import type { HttpContext } from '@adonisjs/core/http'

export default class ItemsController {
  async index({ request, serialize }: HttpContext) {
    const qs = request.qs()

    const { page } = await ItemPagingQueryStringValidator.validate(qs)
    const perPage = 20
    const items = await Item.query()
      .orderBy('created_at', 'desc')
      .paginate(page ?? 1, perPage)
    return serialize(
      ItemTransformer.paginate(items.all(), items.getMeta()).useVariant('forItemPage')
    )
  }

  async store({ request, serialize }: HttpContext) {
    const data = await request.validateUsing(itemValidator)
    const item = await Item.create(data)
    return serialize(ItemTransformer.transform(item).useVariant('forItemPage'))
  }

  async show({ params, serialize }: HttpContext) {
    const item = await Item.findOrFail(params.id)
    return serialize(ItemTransformer.transform(item).useVariant('forItemPage'))
  }

  async update({ params, request, serialize }: HttpContext) {
    const newItem = await request.validateUsing(itemValidator)
    const item = await Item.findOrFail(params.id)
    return serialize(
      ItemTransformer.transform(await item.merge(newItem).save()).useVariant('forItemPage')
    )
  }

  async destroy({ params }: HttpContext) {
    const item = await Item.findOrFail(params.id)
    await item.delete()
  }
}
