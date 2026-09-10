import { UserSchema } from '#database/schema'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { type AccessToken, DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { type HasMany } from '@adonisjs/lucid/types/relations'
import Order from '#models/order'
import { hasMany } from '@adonisjs/lucid/orm'
import { WithPrimaryUuid } from '#mixins/with_primary_uuid'

export default class User extends compose(UserSchema, WithPrimaryUuid, withAuthFinder(hash)) {
  static accessTokens = DbAccessTokensProvider.forModel(User)
  declare currentAccessToken?: AccessToken
  @hasMany(() => Order)
  declare orders: HasMany<typeof Order>
}
