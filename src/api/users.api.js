import http from './http'

export const usersApi = {
  list:          (params) => http.get('/users', { params }),
  options:       ()       => http.get('/users/options'),
  create:        (data)   => http.post('/users', data),
  update:        (id, data) => http.patch(`/users/${id}`, data),
  deactivate:    (id)     => http.patch(`/users/${id}/deactivate`),
  activate:      (id)     => http.patch(`/users/${id}/activate`),
  delete:        (id)     => http.delete(`/users/${id}`),
  resetPassword: (id, data) => http.post(`/users/${id}/reset-password`, data),
  reassignLeads: (id, data) => http.post(`/users/${id}/reassign-leads`, data),
}
