import { createContext, useContext, useEffect, useRef, ReactNode } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from './AuthContext'
import { useNotificationStore } from '@/store'

interface SocketContextType {
  socket: Socket | null
  joinConversation:  (id: string) => void
  leaveConversation: (id: string) => void
  sendTypingStart:   (id: string) => void
  sendTypingStop:    (id: string) => void
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  joinConversation:  () => {},
  leaveConversation: () => {},
  sendTypingStart:   () => {},
  sendTypingStop:    () => {},
})

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth()
  const socketRef = useRef<Socket | null>(null)
  const { addNotification, incrementUnread } = useNotificationStore()

  useEffect(() => {
    if (!token) return

    const socket = io(import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:5000', {
      auth: { token },
      transports: ['websocket'],
    })

    socketRef.current = socket

    socket.on('connect', () => console.log('Socket connected'))

    socket.on('notification', (payload) => {
      addNotification(payload)
      incrementUnread()
    })

    socket.on('connect_error', (err) => {
      console.warn('Socket connection error:', err.message)
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [token])

  const joinConversation  = (id: string) => socketRef.current?.emit('join_conversation', id)
  const leaveConversation = (id: string) => socketRef.current?.emit('leave_conversation', id)
  const sendTypingStart   = (id: string) => socketRef.current?.emit('typing_start', id)
  const sendTypingStop    = (id: string) => socketRef.current?.emit('typing_stop', id)

  return (
    <SocketContext.Provider value={{
      socket: socketRef.current,
      joinConversation, leaveConversation,
      sendTypingStart, sendTypingStop,
    }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)
