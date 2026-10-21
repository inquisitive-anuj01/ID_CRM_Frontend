import axios from 'axios'
import { useAuthStore } from '@/store/auth.store'

const http = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
})

// Attach access token to every request
http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Normalize error shape
function normalizeError(err) {
  const res = err?.response
  const fieldErrors = res?.data?.errors ?? []
  let message = res?.data?.message ?? err?.message ?? 'Something went wrong'
  if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
    const detail = fieldErrors.map((e) => `${e.field || ''}: ${e.message}`).join(', ')
    message = `${message} (${detail})`
  }
  return {
    status: res?.status ?? 0,
    code: res?.data?.code ?? 'UNKNOWN',
    message,
    fieldErrors,
  }
}

// Refresh token singleton
let refreshing = null

http.interceptors.response.use(
  (res) => res.data,
  async (err) => {
    const { config, response } = err

    if (
      response?.status === 401 &&
      !config?._retry &&
      !config?.url?.includes('/auth/')
    ) {
      config._retry = true
      try {
        refreshing ??= axios
          .post('/api/v1/auth/refresh', {}, { withCredentials: true })
          .then((r) => {
            useAuthStore.getState().setToken(r.data?.data?.accessToken)
          })
          .finally(() => (refreshing = null))

        await refreshing
        return http(config)
      } catch {
        useAuthStore.getState().logout()
        window.location.href = '/login'
      }
    }

    return Promise.reject(normalizeError(err))
  }
)

export default http
