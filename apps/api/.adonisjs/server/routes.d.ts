import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'settings.info': { paramsTuple?: []; params?: {} }
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'products.index': { paramsTuple?: []; params?: {} }
    'products.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'orders.paginate_user': { paramsTuple?: []; params?: {} }
    'orders.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'orders.store': { paramsTuple?: []; params?: {} }
    'orders.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'products.store': { paramsTuple?: []; params?: {} }
    'products.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'orders.paginate_all': { paramsTuple?: []; params?: {} }
    'products.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'orders.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'settings.info': { paramsTuple?: []; params?: {} }
    'products.index': { paramsTuple?: []; params?: {} }
    'products.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'orders.paginate_user': { paramsTuple?: []; params?: {} }
    'orders.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'orders.paginate_all': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'settings.info': { paramsTuple?: []; params?: {} }
    'products.index': { paramsTuple?: []; params?: {} }
    'products.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'orders.paginate_user': { paramsTuple?: []; params?: {} }
    'orders.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'orders.paginate_all': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'orders.store': { paramsTuple?: []; params?: {} }
    'products.store': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'orders.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'products.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'products.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'orders.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}