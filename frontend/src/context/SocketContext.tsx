import { createContext, useContext, useEffect, useRef, ReactNode } from 'react'
import { io, Socket } from 'socket.io-client'
import { useQueryClient } from '@tanstack/react-query'
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

// All query keys that depend on internship listing data
const LISTING_QUERY_KEYS = [
  ['internships'],          // student browse page
  ['internship'],           // single listing detail
  ['company-internships'],  // company dashboard + analytics
  ['admin-internships'],    // admin listings page
  ['my-applications'],      // student applications (slot count affects eligibility)
  ['company-applications'], // company applications panel
]

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth()
  const socketRef = useRef<Socket | null>(null)
  const { addNotification, incrementUnread } = useNotificationStore()
  const qc = useQueryClient()

  useEffect(() => {
    if (!token) return

    const socket = io(import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:5000', {
      auth:       { token },
      transports: ['websocket'],
    })

    socketRef.current = socket

    socket.on('connect', () => {
      console.log('Socket connected')
      // Join the global listings room to receive live listing updates
      socket.emit('join_listings')
    })

    // ── Notifications ─────────────────────────────────────────
    socket.on('notification', (payload) => {
      addNotification(payload)
      incrementUnread()
    })

    // ── Internship listing real-time updates ──────────────────
    const invalidateListings = () => {
      LISTING_QUERY_KEYS.forEach((key) => {
        qc.invalidateQueries({ queryKey: key })
      })
    }

    socket.on('internship:created', invalidateListings)
    socket.on('internship:updated', invalidateListings)
    socket.on('internship:deleted', invalidateListings)

    socket.on('connect_error', (err) => {
      console.warn('Socket connection error:', err.message)
    })

    return () => {
      socket.emit('leave_listings')
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
