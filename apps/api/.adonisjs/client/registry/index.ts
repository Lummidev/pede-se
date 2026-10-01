/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'settings.info': {
    methods: ["GET","HEAD"],
    pattern: '/info',
    tokens: [{"old":"/info","type":0,"val":"info","end":""}],
    types: placeholder as Registry['settings.info']['types'],
  },
  'auth.new_account.store': {
    methods: ["POST"],
    pattern: '/auth/signup',
    tokens: [{"old":"/auth/signup","type":0,"val":"auth","end":""},{"old":"/auth/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['auth.new_account.store']['types'],
  },
  'auth.access_tokens.store': {
    methods: ["POST"],
    pattern: '/auth/login',
    tokens: [{"old":"/auth/login","type":0,"val":"auth","end":""},{"old":"/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.access_tokens.store']['types'],
  },
  'products.index': {
    methods: ["GET","HEAD"],
    pattern: '/products',
    tokens: [{"old":"/products","type":0,"val":"products","end":""}],
    types: placeholder as Registry['products.index']['types'],
  },
  'products.show': {
    methods: ["GET","HEAD"],
    pattern: '/products/:id',
    tokens: [{"old":"/products/:id","type":0,"val":"products","end":""},{"old":"/products/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['products.show']['types'],
  },
  'profile.profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/account/profile',
    tokens: [{"old":"/account/profile","type":0,"val":"account","end":""},{"old":"/account/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile.profile.show']['types'],
  },
  'profile.access_tokens.destroy': {
    methods: ["POST"],
    pattern: '/account/logout',
    tokens: [{"old":"/account/logout","type":0,"val":"account","end":""},{"old":"/account/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['profile.access_tokens.destroy']['types'],
  },
  'orders.paginate_user': {
    methods: ["GET","HEAD"],
    pattern: '/orders',
    tokens: [{"old":"/orders","type":0,"val":"orders","end":""}],
    types: placeholder as Registry['orders.paginate_user']['types'],
  },
  'orders.show': {
    methods: ["GET","HEAD"],
    pattern: '/orders/:id',
    tokens: [{"old":"/orders/:id","type":0,"val":"orders","end":""},{"old":"/orders/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['orders.show']['types'],
  },
  'orders.store': {
    methods: ["POST"],
    pattern: '/orders',
    tokens: [{"old":"/orders","type":0,"val":"orders","end":""}],
    types: placeholder as Registry['orders.store']['types'],
  },
  'orders.update': {
    methods: ["PUT"],
    pattern: '/orders/:id',
    tokens: [{"old":"/orders/:id","type":0,"val":"orders","end":""},{"old":"/orders/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['orders.update']['types'],
  },
  'products.store': {
    methods: ["POST"],
    pattern: '/manage/products',
    tokens: [{"old":"/manage/products","type":0,"val":"manage","end":""},{"old":"/manage/products","type":0,"val":"products","end":""}],
    types: placeholder as Registry['products.store']['types'],
  },
  'products.update': {
    methods: ["PUT"],
    pattern: '/manage/products/:id',
    tokens: [{"old":"/manage/products/:id","type":0,"val":"manage","end":""},{"old":"/manage/products/:id","type":0,"val":"products","end":""},{"old":"/manage/products/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['products.update']['types'],
  },
  'orders.paginate_all': {
    methods: ["GET","HEAD"],
    pattern: '/manage/orders',
    tokens: [{"old":"/manage/orders","type":0,"val":"manage","end":""},{"old":"/manage/orders","type":0,"val":"orders","end":""}],
    types: placeholder as Registry['orders.paginate_all']['types'],
  },
  'products.destroy': {
    methods: ["DELETE"],
    pattern: '/manage/products/:id',
    tokens: [{"old":"/manage/products/:id","type":0,"val":"manage","end":""},{"old":"/manage/products/:id","type":0,"val":"products","end":""},{"old":"/manage/products/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['products.destroy']['types'],
  },
  'orders.destroy': {
    methods: ["DELETE"],
    pattern: '/manage/orders/:id',
    tokens: [{"old":"/manage/orders/:id","type":0,"val":"manage","end":""},{"old":"/manage/orders/:id","type":0,"val":"orders","end":""},{"old":"/manage/orders/:id","type":1,"val":"id","end":""}],
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
