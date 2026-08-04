/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'auth.new_account.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/signup',
    tokens: [{"old":"/api/v1/auth/signup","type":0,"val":"api","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['auth.new_account.store']['types'],
  },
  'auth.access_tokens.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/login',
    tokens: [{"old":"/api/v1/auth/login","type":0,"val":"api","end":""},{"old":"/api/v1/auth/login","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/login","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.access_tokens.store']['types'],
  },
  'profile.profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/profile',
    tokens: [{"old":"/api/v1/account/profile","type":0,"val":"api","end":""},{"old":"/api/v1/account/profile","type":0,"val":"v1","end":""},{"old":"/api/v1/account/profile","type":0,"val":"account","end":""},{"old":"/api/v1/account/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile.profile.show']['types'],
  },
  'profile.access_tokens.destroy': {
    methods: ["POST"],
    pattern: '/api/v1/account/logout',
    tokens: [{"old":"/api/v1/account/logout","type":0,"val":"api","end":""},{"old":"/api/v1/account/logout","type":0,"val":"v1","end":""},{"old":"/api/v1/account/logout","type":0,"val":"account","end":""},{"old":"/api/v1/account/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['profile.access_tokens.destroy']['types'],
  },
  'items.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/items',
    tokens: [{"old":"/api/v1/items","type":0,"val":"api","end":""},{"old":"/api/v1/items","type":0,"val":"v1","end":""},{"old":"/api/v1/items","type":0,"val":"items","end":""}],
    types: placeholder as Registry['items.index']['types'],
  },
  'items.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/items/:id',
    tokens: [{"old":"/api/v1/items/:id","type":0,"val":"api","end":""},{"old":"/api/v1/items/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/items/:id","type":0,"val":"items","end":""},{"old":"/api/v1/items/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['items.show']['types'],
  },
  'items.store': {
    methods: ["POST"],
    pattern: '/api/v1/items',
    tokens: [{"old":"/api/v1/items","type":0,"val":"api","end":""},{"old":"/api/v1/items","type":0,"val":"v1","end":""},{"old":"/api/v1/items","type":0,"val":"items","end":""}],
    types: placeholder as Registry['items.store']['types'],
  },
  'items.update': {
    methods: ["PUT"],
    pattern: '/api/v1/items/:id',
    tokens: [{"old":"/api/v1/items/:id","type":0,"val":"api","end":""},{"old":"/api/v1/items/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/items/:id","type":0,"val":"items","end":""},{"old":"/api/v1/items/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['items.update']['types'],
  },
  'items.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/items/:id',
    tokens: [{"old":"/api/v1/items/:id","type":0,"val":"api","end":""},{"old":"/api/v1/items/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/items/:id","type":0,"val":"items","end":""},{"old":"/api/v1/items/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['items.destroy']['types'],
  },
  'orders.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/orders',
    tokens: [{"old":"/api/v1/orders","type":0,"val":"api","end":""},{"old":"/api/v1/orders","type":0,"val":"v1","end":""},{"old":"/api/v1/orders","type":0,"val":"orders","end":""}],
    types: placeholder as Registry['orders.index']['types'],
  },
  'orders.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/orders/:id',
    tokens: [{"old":"/api/v1/orders/:id","type":0,"val":"api","end":""},{"old":"/api/v1/orders/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/orders/:id","type":0,"val":"orders","end":""},{"old":"/api/v1/orders/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['orders.show']['types'],
  },
  'orders.store': {
    methods: ["POST"],
    pattern: '/api/v1/orders',
    tokens: [{"old":"/api/v1/orders","type":0,"val":"api","end":""},{"old":"/api/v1/orders","type":0,"val":"v1","end":""},{"old":"/api/v1/orders","type":0,"val":"orders","end":""}],
    types: placeholder as Registry['orders.store']['types'],
  },
  'orders.update': {
    methods: ["PUT"],
    pattern: '/api/v1/orders/:id',
    tokens: [{"old":"/api/v1/orders/:id","type":0,"val":"api","end":""},{"old":"/api/v1/orders/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/orders/:id","type":0,"val":"orders","end":""},{"old":"/api/v1/orders/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['orders.update']['types'],
  },
  'orders.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/orders/:id',
    tokens: [{"old":"/api/v1/orders/:id","type":0,"val":"api","end":""},{"old":"/api/v1/orders/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/orders/:id","type":0,"val":"orders","end":""},{"old":"/api/v1/orders/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['orders.destroy']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
