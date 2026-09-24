import { TuyauError } from '@tuyau/core/client'
import { apiClient } from './apiClient'
export enum AuthResult {
  Success,
  Unauthorized,
  InvalidToken,
  InvalidCredentials,
  NetworkError,
  UnknownError,
}
const getAuthResultError = (error: TuyauError): AuthResult => {
  if (error.isStatus(401)) {
    return AuthResult.InvalidToken
  }
  if (error.isValidationError() || error.isStatus(400)) {
    return AuthResult.InvalidCredentials
  }
  if (error.kind === 'network') return AuthResult.NetworkError
  return AuthResult.UnknownError
}
export class Auth {
  private static authTokenKey = 'auth:token'
  private static tokenAdminKey = 'auth:isAdmin'
  private static tokenOperatorKey = 'auth:isOperator'
  static get authToken() {
    return localStorage.getItem(this.authTokenKey)
  }
  private static set authToken(token: string | null) {
    if (token) localStorage.setItem(this.authTokenKey, token)
    else localStorage.removeItem(this.authTokenKey)
  }
  static get isAdmin() {
    return localStorage.getItem(this.tokenAdminKey) === 'true'
  }
  private static set isAdmin(value: boolean) {
    localStorage.setItem(this.tokenAdminKey, String(value))
  }
  static get isOperator() {
    return localStorage.getItem(this.tokenOperatorKey) === 'true'
  }
  private static set isOperator(value: boolean) {
    localStorage.setItem(this.tokenOperatorKey, String(value))
  }
  static async login(loginData: { email: string; password: string }): Promise<AuthResult> {
    const [data, error] = await apiClient.api.auth.accessTokens.store({ body: loginData }).safe()
    if (error) {
      return getAuthResultError(error)
    }

    this.authToken = data.data.token.value
    if (data.data.token.isAdmin) {
      this.isAdmin = true
    } else if (data.data.token.isOperator) {
      this.isOperator = true
    }
    return AuthResult.Success
  }
  static async logout(): Promise<AuthResult> {
    const token = this.authToken
    if (!token) return AuthResult.Unauthorized
    const [, error] = await apiClient.api.profile.accessTokens.destroy({}).safe()
    if (error) {
      const result = getAuthResultError(error)
      if (result === AuthResult.NetworkError) {
        return result
      }
    }

    this.clear()
    return AuthResult.Success
  }
  static async check(): Promise<AuthResult> {
    const token = this.authToken
    if (!token) return AuthResult.Unauthorized
    const [, error] = await apiClient.api.profile.profile.show({}).safe()
    if (error) {
      const result = getAuthResultError(error)
      if (result === AuthResult.InvalidToken) {
        this.clear()
      }
      return result
    }

    return AuthResult.Success
  }
  private static clear() {
    localStorage.removeItem(this.authTokenKey)
    localStorage.removeItem(this.tokenAdminKey)
    localStorage.removeItem(this.tokenOperatorKey)
  }
}
