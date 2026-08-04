/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    newAccount: {
      store: typeof routes['auth.new_account.store']
    }
    accessTokens: {
      store: typeof routes['auth.access_tokens.store']
    }
  }
  profile: {
    profile: {
      show: typeof routes['profile.profile.show']
    }
    accessTokens: {
      destroy: typeof routes['profile.access_tokens.destroy']
    }
  }
  items: {
    index: typeof routes['items.index']
    show: typeof routes['items.show']
    store: typeof routes['items.store']
    update: typeof routes['items.update']
    destroy: typeof routes['items.destroy']
  }
  orders: {
    index: typeof routes['orders.index']
    show: typeof routes['orders.show']
    store: typeof routes['orders.store']
    update: typeof routes['orders.update']
    destroy: typeof routes['orders.destroy']
  }
}
