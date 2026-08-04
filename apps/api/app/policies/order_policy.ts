import type User from '#models/user'
import type Order from '#models/order'
import { AuthorizationResponse, BasePolicy } from '@adonisjs/bouncer'

export default class OrderPolicy extends BasePolicy {
  view(user: User, order: Order) {
    return user.id === order.userId
      ? AuthorizationResponse.allow()
      : AuthorizationResponse.deny(undefined, 404)
  }
  edit(user: User, order: Order) {
    return user.id === order.userId
      ? AuthorizationResponse.allow()
      : AuthorizationResponse.deny(undefined, 404)
  }
  delete(user: User, order: Order) {
    return user.id === order.userId
      ? AuthorizationResponse.allow()
      : AuthorizationResponse.deny(undefined, 404)
  }
}
