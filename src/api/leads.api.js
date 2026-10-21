import http from './http'

export const leadsApi = {
  list:           (params) => http.get('/leads', { params }),
  board:          (params) => http.get('/leads/board', { params }),
  one:            (id)     => http.get(`/leads/${id}`),
  create:         (data)   => http.post('/leads', data),
  update:         (id, data) => http.patch(`/leads/${id}`, data),
  delete:         (id)     => http.delete(`/leads/${id}`),
  restore:        (id)     => http.post(`/leads/${id}/restore`),

  // Specific field patches
  status:         (id, data) => http.patch(`/leads/${id}/status`, data),
  assign:         (id, data) => http.patch(`/leads/${id}/assign`, data),
  labels:         (id, data) => http.patch(`/leads/${id}/labels`, data),
  rating:         (id, data) => http.patch(`/leads/${id}/rating`, data),

  // Followups & history
  followups:      (id, params) => http.get(`/leads/${id}/followups`, { params }),
  history:        (id, params) => http.get(`/leads/${id}/history`, { params }),

  // Utilities
  checkDuplicate: (mobile, countryCode) => http.get('/leads/check-duplicate', { params: { mobile, countryCode } }),
  export:         (params) => http.get('/leads/export', { params, responseType: 'blob' }),
  import:         (formData) => http.post('/leads/import', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),

  // Bulk
  bulkAssign:     (data) => http.post('/leads/bulk/assign', data),
  bulkStatus:     (data) => http.post('/leads/bulk/status', data),
}
