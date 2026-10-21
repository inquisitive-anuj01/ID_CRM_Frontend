import { io } from 'socket.io-client'
import { useAuthStore } from '@/store/auth.store'

let socket = null

export function getSocket() {
  if (socket) return socket

  socket = io('/', {
    withCredentials: true,
    autoConnect: false,
    transports: ['websocket', 'polling'],
  })

  socket.on('connect', () => {
    console.log('[Socket] Connected:', socket.id)
    // Join user room after connect
    const user = useAuthStore.getState().user
    if (user?._id) socket.emit('join', user._id)
  })

  socket.on('disconnect', () => {
    console.log('[Socket] Disconnected')
  })

  return socket
}

export function connectSocket() {
  const s = getSocket()
  if (!s.connected) s.connect()
}

export const initSocket = connectSocket

export function disconnectSocket() {
  if (socket?.connected) {
    socket.disconnect()
    socket = null
  }
}
