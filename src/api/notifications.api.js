import http from './http'

export const notificationsApi = {
  list:    (params) => http.get('/notifications', { params }),
  markRead: (id)   => http.patch(`/notifications/${id}/read`),
  markAllRead: ()  => http.patch('/notifications/read-all'),
}
