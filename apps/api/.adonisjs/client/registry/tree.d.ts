/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  settings: {
    info: typeof routes['settings.info']
  }
  auth: {
    newAccount: {
      store: typeof routes['auth.new_account.store']
    }
    accessTokens: {
      store: typeof routes['auth.access_tokens.store']
    }
  }
  products: {
    index: typeof routes['products.index']
    show: typeof routes['products.show']
    store: typeof routes['products.store']
    update: typeof routes['products.update']
    destroy: typeof routes['products.destroy']
  }
  profile: {
    profile: {
      show: typeof routes['profile.profile.show']
    }
    accessTokens: {
      destroy: typeof routes['profile.access_tokens.destroy']
    }
  }
  orders: {
    paginateUser: typeof routes['orders.paginate_user']
    show: typeof routes['orders.show']
    store: typeof routes['orders.store']
    update: typeof routes['orders.update']
    paginateAll: typeof routes['orders.paginate_all']
    destroy: typeof routes['orders.destroy']
  }
}
