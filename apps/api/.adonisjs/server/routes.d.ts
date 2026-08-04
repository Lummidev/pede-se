import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'items.index': { paramsTuple?: []; params?: {} }
    'items.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'items.store': { paramsTuple?: []; params?: {} }
    'items.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'items.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'orders.index': { paramsTuple?: []; params?: {} }
    'orders.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'orders.store': { paramsTuple?: []; params?: {} }
    'orders.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'orders.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'items.store': { paramsTuple?: []; params?: {} }
    'orders.store': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'items.index': { paramsTuple?: []; params?: {} }
    'items.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'orders.index': { paramsTuple?: []; params?: {} }
    'orders.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'items.index': { paramsTuple?: []; params?: {} }
    'items.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'orders.index': { paramsTuple?: []; params?: {} }
    'orders.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PUT: {
    'items.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'orders.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'items.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'orders.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}