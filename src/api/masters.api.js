import http from './http'

export const mastersApi = {
  // Statuses
  statuses:       () => http.get('/statuses'),
  createStatus:   (d) => http.post('/statuses', d),
  updateStatus:   (id, d) => http.patch(`/statuses/${id}`, d),
  deleteStatus:   (id) => http.delete(`/statuses/${id}`),
  reorderStatuses: (d) => http.post('/statuses/reorder', d),

  // Sources
  sources:        () => http.get('/sources'),
  createSource:   (d) => http.post('/sources', d),
  updateSource:   (id, d) => http.patch(`/sources/${id}`, d),
  deleteSource:   (id) => http.delete(`/sources/${id}`),

  // Labels
  labels:         () => http.get('/labels'),
  createLabel:    (d) => http.post('/labels', d),
  updateLabel:    (id, d) => http.patch(`/labels/${id}`, d),
  deleteLabel:    (id) => http.delete(`/labels/${id}`),

  // Followup categories
  categories:     () => http.get('/followup-categories'),
  createCategory: (d) => http.post('/followup-categories', d),
  updateCategory: (id, d) => http.patch(`/followup-categories/${id}`, d),
  deleteCategory: (id) => http.delete(`/followup-categories/${id}`),
}
