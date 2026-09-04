import devSettings from '#config/dev_settings'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export default class DelayRequestsMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    if (!devSettings.delaySeconds || process.env.NODE_ENV !== 'development') return next()
    const ms = devSettings.delaySeconds * 1000
    await delay(ms)
    ctx.logger.info(`${ctx.request.url()}: Waited ${ms}ms`)
    await next()
  }
}
