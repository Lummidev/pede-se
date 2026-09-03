import { registry } from '@pede-se/api/registry'
import { createTuyau } from '@tuyau/core/client'
import { getAuthToken } from './auth'
export const apiClient = createTuyau({
  baseUrl: process.env.PEDE_SE_API_URL || 'http://localhost:3333',
  registry,
  headers: { Accept: 'application/json' },
  hooks: {
    beforeRequest: [
      (request) => {
        const token = getAuthToken()
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      },
    ],
  },
})
