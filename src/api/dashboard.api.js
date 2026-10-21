import http from './http'

export const dashboardApi = {
  summary:   (params) => http.get('/dashboard/summary', { params }),
  leads:     (params) => http.get('/dashboard/leads', { params }),
  schedules: (params) => http.get('/dashboard/schedules', { params }),
}
