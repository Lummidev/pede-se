import type User from '#models/user'
import { Bouncer } from '@adonisjs/bouncer'

export const isOperatorToken = Bouncer.ability((user: User) => {
  return !!user.currentAccessToken?.allows('operator') || !!user.currentAccessToken?.allows('admin')
})
