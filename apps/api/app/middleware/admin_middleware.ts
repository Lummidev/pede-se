import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AdminMiddleware {
  async handle({ auth, response }: HttpContext, next: NextFn) {
    const isAdminToken = auth.user?.currentAccessToken?.allows('admin')
    if (!isAdminToken) {
      return response.forbidden()
    }
    await next()
  }
}
