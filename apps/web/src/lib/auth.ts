import { TuyauError } from '@tuyau/core/client'
import { apiClient } from './apiClient'

const authTokenKey = 'token'

export const getAuthToken = () => localStorage.getItem(authTokenKey)
export const clearAuthToken = () => localStorage.removeItem(authTokenKey)

export enum AuthCheck {
  Authenticated,
  Unauthorized,
  InvalidToken,
  NetworkError,
  UnknownError,
}
export const checkAuth = async (): Promise<{ result: AuthCheck; errorData?: TuyauError }> => {
  const token = getAuthToken()

  if (!token) return { result: AuthCheck.Unauthorized }

  const [data, error] = await apiClient.api.profile.profile.show({}).safe()

  if (data) return { result: AuthCheck.Authenticated }
  if (error.isStatus(401)) {
    clearAuthToken()
    return { result: AuthCheck.InvalidToken }
  }
  if (error.kind === 'network') return { result: AuthCheck.NetworkError, errorData: error }

  return { result: AuthCheck.UnknownError, errorData: error }
}
