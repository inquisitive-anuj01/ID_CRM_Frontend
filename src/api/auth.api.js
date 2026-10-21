import http from './http'

export const authApi = {
  login:          (data) => http.post('/auth/login', data),
  refresh:        ()     => http.post('/auth/refresh'),
  me:             ()     => http.get('/auth/me'),
  changePassword: (data) => http.post('/auth/change-password', data),
  logout:         ()     => http.post('/auth/logout'),
}
