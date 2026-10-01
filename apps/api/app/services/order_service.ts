import Order from '#models/order'

export class OrderService {
  async paginate({
    userId,
    page,
    perPage = 20,
  }: {
    userId?: string
    page: number
    perPage?: number
  }) {
    let query = Order.query()
    if (userId) {
      query = query.where('userId', userId)
    }
    return await query
      .orderBy('created_at', 'desc')
      .preload('products')
      .preload('user')
      .paginate(page ?? 1, perPage)
  }
}
