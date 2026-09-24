import { registry } from '@pede-se/api/registry'
import { createTuyau } from '@tuyau/core/client'
import { Auth } from './auth'
export const apiClient = createTuyau({
  baseUrl: process.env.PEDE_SE_API_URL || 'http://localhost:3333',
  registry,
  headers: { Accept: 'application/json' },
  hooks: {
    beforeRequest: [
      (request) => {
        const token = Auth.authToken
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      },
    ],
  },
})
