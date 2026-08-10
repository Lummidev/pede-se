import { OrderProductFactory } from '#database/factories/order_product_factory'
import Product from '#models/product'
import Order from '#models/order'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

function shuffled<T>(array: Array<T>): Array<T> {
  let arr = [...array]
  let currentIndex = arr.length

  while (currentIndex !== 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    ;[arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]]
  }
  return arr
}

export default class extends BaseSeeder {
  async run() {
    const orders = await Order.all()
    const products = await Product.all()
    if (products.length < 3) return
    for (const order of orders) {
      const chosenProducts = shuffled(products).slice(0, 3)
      for (const product of chosenProducts) {
        await OrderProductFactory.merge({
          orderId: order.id,
          productId: product.id,
        }).create()
      }
    }
  }
}
