import http from './http'

export const workspaceApi = {
  create: (data) => http.post('/workspace/create', data),
  getMe:  ()     => http.get('/workspace/me'),
  rename: (data) => http.patch('/workspace/rename', data),
  delete: ()     => http.delete('/workspace'),
}
