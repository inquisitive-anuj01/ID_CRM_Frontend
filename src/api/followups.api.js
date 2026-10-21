import http from './http'

export const followupsApi = {
  mine:   (params) => http.get('/followups', { params }),
  create: (leadId, formData) =>
    http.post(`/leads/${leadId}/followups`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id, formData) =>
    http.patch(`/followups/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id) => http.delete(`/followups/${id}`),
}
