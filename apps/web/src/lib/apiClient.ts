import { registry } from '@pede-se/api/registry'
import { createTuyau } from '@tuyau/core/client'
export const client = createTuyau({
  baseUrl: process.env.PEDE_SE_API_URL || 'http://localhost:3333',
  registry,
  headers: { Accept: 'application/json' },
  hooks: {
    beforeRequest: [
      (request) => {
        const token = localStorage.getItem('auth_token')
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      },
    ],
  },
})
