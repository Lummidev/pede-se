import Order from '#models/order'
import OrderPolicy from '#policies/order_policy'
import OrderTransformer from '#transformers/order_transformer'
import { OrderPagingQueryStringValidator, OrderValidator } from '#validators/order'
import type { HttpContext } from '@adonisjs/core/http'

export default class OrdersController {
  async index({ serialize, request, auth }: HttpContext) {
    const qs = request.qs()
    const { page } = await OrderPagingQueryStringValidator.validate(qs)
    const user = auth.getUserOrFail()
    const perPage = 20
    const orders = await Order.query()
      .where('userId', user.id)
      .orderBy('created_at', 'desc')
      .preload('items')
      .preload('user')
      .paginate(page ?? 1, perPage)
    return serialize(OrderTransformer.paginate(orders.all(), orders.getMeta()))
  }

  async store({ request, serialize, auth }: HttpContext) {
    const { items } = await request.validateUsing(OrderValidator)
    const { id: userId } = auth.getUserOrFail()
    const order = await Order.create({ userId })
    const orderItemMap = new Map(
      items.map((item) => {
        const { id: itemId, ...rest } = item
        return [itemId, { ...rest }]
      })
    )
    await order.related('items').sync(Object.fromEntries(orderItemMap))
    await order.load('items')
    return serialize(OrderTransformer.transform(order))
  }

  async show({ params, serialize, bouncer }: HttpContext) {
    const id = params.id
    const order = await Order.query().preload('items').preload('user').where('id', id).firstOrFail()
    await bouncer.with(OrderPolicy).authorize('view', order)
    return serialize(OrderTransformer.transform(order))
  }

  async update({ params, request, serialize, bouncer }: HttpContext) {
    const id = params.id
    const order = await Order.findOrFail(id)
    await bouncer.with(OrderPolicy).authorize('edit', order)

    const newItems = await request.validateUsing(OrderValidator)
    const itemRecord: Record<string, { amount: number }> = {}
    newItems.items.forEach(({ id: itemId, amount }) => {
      itemRecord[itemId] = { amount }
    })
    await order.related('items').sync(itemRecord)
    await order.load('items')
    return serialize(OrderTransformer.transform(order))
  }

  async destroy({ params, bouncer }: HttpContext) {
    const order = await Order.findOrFail(params.id)
    await bouncer.with(OrderPolicy).authorize('delete', order)

    await order.delete()
  }
}
