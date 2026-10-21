import http from './http'

export const reportsApi = {
  leadsSummary: (params) => http.get('/reports/leads-summary', { params }),
  bySource:     (params) => http.get('/reports/by-source', { params }),
  byUser:       (params) => http.get('/reports/by-user', { params }),
  byStatus:     (params) => http.get('/reports/by-status', { params }),
  compliance:   (params) => http.get('/reports/compliance', { params }),
  conversion:   (params) => http.get('/reports/conversion', { params }),
  overdue:      (params) => http.get('/reports/overdue', { params }),
  export:       (params) => http.get('/reports/export', { params, responseType: 'blob' }),
}
