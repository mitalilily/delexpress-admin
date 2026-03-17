// notificationSocket.js
import { io } from 'socket.io-client'

const DEFAULT_SOCKET_URL = 'https://delexpress-backend.onrender.com'

const getSocketUrl = () => {
  try {
    const rawSocketUrl =
      process.env.REACT_APP_SOCKET_URL ||
      process.env.REACT_APP_API_BASE_URL?.replace(/\/api\/?$/, '')

    if (!rawSocketUrl) return DEFAULT_SOCKET_URL

    const candidate = new URL(rawSocketUrl, window.location.origin)
    const currentHost = window.location.hostname
    const isNetlifyHost = currentHost.endsWith('netlify.app')
    const pointsBackToFrontend = candidate.hostname === currentHost

    if (isNetlifyHost && pointsBackToFrontend) {
      return DEFAULT_SOCKET_URL
    }

    return candidate.origin
  } catch {
    return DEFAULT_SOCKET_URL
  }
}

export const socket = io(getSocketUrl())

export function registerUser(userId) {
  socket.emit('register', userId)
}
