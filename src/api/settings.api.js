import http from './http'

export const settingsApi = {
  get:    () => http.get('/settings'),
  update: (data) => http.patch('/settings', data),
}
