/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'
router.where('id', router.matchers.uuid())
router.get('/', () => {
  return { hello: 'world' }
})

router
  .group(() => {
    router
      .group(() => {
        router.post('signup', [controllers.NewAccount, 'store'])
        router.post('login', [controllers.AccessTokens, 'store'])
      })
      .prefix('auth')
      .as('auth')

    router
      .group(() => {
        router.get('profile', [controllers.Profile, 'show'])
        router.post('logout', [controllers.AccessTokens, 'destroy'])
      })
      .prefix('account')
      .as('profile')
      .use(middleware.auth())
    router
      .group(() => {
        router.get('/', [controllers.Items, 'index'])
        router.get('/:id', [controllers.Items, 'show'])
        router.post('/', [controllers.Items, 'store'])
        router.put('/:id', [controllers.Items, 'update'])
        router.delete('/:id', [controllers.Items, 'destroy'])
      })
      .prefix('items')
  })
  .prefix('/api/v1')
