import Order from '#models/order'
import OrderPolicy from '#policies/order_policy'
import { OrderService } from '#services/order_service'
import OrderTransformer from '#transformers/order_transformer'
import { OrderPagingQueryStringValidator, OrderValidator } from '#validators/order'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class OrdersController {
  constructor(protected orderService: OrderService) {}
  async paginateUser({ serialize, request, auth }: HttpContext) {
    const qs = request.qs()
    const { page } = await OrderPagingQueryStringValidator.validate(qs)
    const user = auth.getUserOrFail()
    const orders = await this.orderService.paginate({ page: page ?? 1, userId: user.id })
    return serialize(OrderTransformer.paginate(orders.all(), orders.getMeta()))
  }
  async paginateAll({ serialize, request }: HttpContext) {
    const qs = request.qs()
    const { page } = await OrderPagingQueryStringValidator.validate(qs)
    const orders = await this.orderService.paginate({ page: page ?? 1 })
    return serialize(OrderTransformer.paginate(orders.all(), orders.getMeta()))
  }
  async store({ request, serialize, auth }: HttpContext) {
    const { products } = await request.validateUsing(OrderValidator)
    const { id: userId } = auth.getUserOrFail()
    const order = await Order.create({ userId })
    const orderProductMap = new Map(
      products.map((product) => {
        const { id: productId, ...rest } = product
        return [productId, { ...rest }]
      })
    )
    await order.related('products').sync(Object.fromEntries(orderProductMap))
    await order.load('products')
    return serialize(OrderTransformer.transform(order))
  }

  async show({ params, serialize, bouncer }: HttpContext) {
    const id = params.id
    const order = await Order.query()
      .preload('products')
      .preload('user')
      .where('id', id)
      .firstOrFail()
    await bouncer.with(OrderPolicy).authorize('view', order)
    return serialize(OrderTransformer.transform(order))
  }

  async update({ params, request, serialize, bouncer }: HttpContext) {
    const id = params.id
    const order = await Order.findOrFail(id)
    await bouncer.with(OrderPolicy).authorize('edit', order)

    const newProducts = await request.validateUsing(OrderValidator)
    const productRecord: Record<string, { amount: number }> = {}
    newProducts.products.forEach(({ id: productId, amount }) => {
      productRecord[productId] = { amount }
    })
    await order.related('products').sync(productRecord)
    await order.load('products')
    return serialize(OrderTransformer.transform(order))
  }

  async destroy({ params }: HttpContext) {
    const order = await Order.findOrFail(params.id)
    await order.delete()
  }
}
