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

router.group(() => {
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
      router.get('/', [controllers.Products, 'index'])
      router.get('/:id', [controllers.Products, 'show'])
    })
    .prefix('products')

  router
    .group(() => {
      router
        .group(() => {
          router.get('profile', [controllers.Profile, 'show'])
          router.post('logout', [controllers.AccessTokens, 'destroy'])
        })
        .prefix('account')
        .as('profile')
      router
        .group(() => {
          router.get('/', [controllers.Orders, 'paginateUser'])
          router.get('/:id', [controllers.Orders, 'show'])
          router.post('/', [controllers.Orders, 'store'])
          router.put('/:id', [controllers.Orders, 'update'])
        })
        .prefix('orders')
      router
        .group(() => {
          router
            .group(() => {
              router
                .group(() => {
                  router.post('/', [controllers.Products, 'store'])
                  router.put('/:id', [controllers.Products, 'update'])
                })
                .prefix('products')
              router
                .group(() => {
                  router.get('/', [controllers.Orders, 'paginateAll'])
                })
                .prefix('orders')
            })
            .use(middleware.operator())
          router
            .group(() => {
              router
                .group(() => {
                  router.delete('/:id', [controllers.Products, 'destroy'])
                })
                .prefix('products')
              router
                .group(() => {
                  router.delete('/:id', [controllers.Orders, 'destroy'])
                })
                .prefix('orders')
            })
            .use(middleware.admin())
        })
        .prefix('manage')
    })
    .use(middleware.auth())
})
