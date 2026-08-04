import { OrderItemFactory } from '#database/factories/order_item_factory'
import Item from '#models/item'
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
    const items = await Item.all()
    if (items.length < 3) return
    for (const order of orders) {
      const chosenItems = shuffled(items).slice(0, 3)
      for (const item of chosenItems) {
        await OrderItemFactory.merge({
          orderId: order.id,
          itemId: item.id,
        }).create()
      }
    }
  }
}
