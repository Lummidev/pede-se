import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class OperatorMiddleware {
  async handle({ auth, response }: HttpContext, next: NextFn) {
    const isOperatorToken = auth.user?.currentAccessToken?.allows('operator')
    const isAdminToken = auth.user?.currentAccessToken?.allows('admin')
    if (!isOperatorToken && !isAdminToken) {
      return response.forbidden()
    }

    await next()
  }
}
