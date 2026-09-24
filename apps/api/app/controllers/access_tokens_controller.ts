import User from '#models/user'
import { loginValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import UserTransformer from '#transformers/user_transformer'

export default class AccessTokensController {
  async store({ request, serialize }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    await user.load('role')
    let abilities: string[] | undefined
    const role = user.role?.name
    if (role) {
      abilities = [role]
    }
    const token = await User.accessTokens.create(user, abilities)
    return serialize({
      user: UserTransformer.transform(user),
      token: {
        value: token.value!.release(),
        isAdmin: role === 'admin',
        isOperator: role === 'operator',
      },
    })
  }

  async destroy({ auth }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.currentAccessToken) {
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    }

    return {
      message: 'Logged out successfully',
    }
  }
}
