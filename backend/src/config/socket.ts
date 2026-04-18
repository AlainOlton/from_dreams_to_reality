import { Server, Socket } from 'socket.io'
import jwt from 'jsonwebtoken'
import { JwtPayload } from '@/types/auth.types'

export const registerSocketHandlers = (io: Server): void => {

  // Auth middleware — every socket connection must carry a valid JWT
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined
    if (!token) return next(new Error('Authentication required'))
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
      socket.data.user = decoded
      next()
    } catch {
      next(new Error('Invalid token'))
    }
  })

  io.on('connection', (socket: Socket) => {
    const user = socket.data.user as JwtPayload
    console.log(`Socket connected: ${socket.id} | user: ${user.id}`)

    // Each user joins their own private notification room automatically
    socket.join(`user:${user.id}`)

    // Join a conversation room for real-time messaging
    socket.on('join_conversation', (conversationId: string) => {
      socket.join(`conversation:${conversationId}`)
    })

    socket.on('leave_conversation', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`)
    })

    // Typing indicators
    socket.on('typing_start', (conversationId: string) => {
      socket.to(`conversation:${conversationId}`).emit('user_typing', {
        userId: user.id,
        conversationId,
      })
    })

    socket.on('typing_stop', (conversationId: string) => {
      socket.to(`conversation:${conversationId}`).emit('user_stopped_typing', {
        userId: user.id,
        conversationId,
      })
    })

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`)
    })
  })
}
