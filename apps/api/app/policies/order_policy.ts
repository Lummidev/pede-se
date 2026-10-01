import type User from '#models/user'
import type Order from '#models/order'
import { AuthorizationResponse, BasePolicy } from '@adonisjs/bouncer'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { isOperatorToken } from '#abilities/main'
@inject()
export default class OrderPolicy extends BasePolicy {
  constructor(protected context: HttpContext) {
    super()
  }
  async view(user: User, order: Order) {
    return (await this.context.bouncer.allows(isOperatorToken)) || user.id === order.userId
      ? AuthorizationResponse.allow()
      : AuthorizationResponse.deny(undefined, 404)
  }
  async edit(user: User, order: Order) {
    return (await this.context.bouncer.allows(isOperatorToken)) || user.id === order.userId
      ? AuthorizationResponse.allow()
      : AuthorizationResponse.deny(undefined, 404)
  }
}
