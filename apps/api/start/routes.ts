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

router
  .group(() => {
    router
      .group(() => {
        router.get('/', [controllers.Settings, 'info'])
      })
      .prefix('info')
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
        router.get('/', [controllers.Products, 'index'])
        router.get('/:id', [controllers.Products, 'show'])
        router.post('/', [controllers.Products, 'store'])
        router.put('/:id', [controllers.Products, 'update'])
        router.delete('/:id', [controllers.Products, 'destroy'])
      })
      .prefix('products')
    router
      .group(() => {
        router.get('/', [controllers.Orders, 'index'])
        router.get('/:id', [controllers.Orders, 'show'])
        router.post('/', [controllers.Orders, 'store'])
        router.put('/:id', [controllers.Orders, 'update'])
        router.delete('/:id', [controllers.Orders, 'destroy'])
      })
      .prefix('orders')
      .use(middleware.auth())
  })
  .prefix('/api/v1')
