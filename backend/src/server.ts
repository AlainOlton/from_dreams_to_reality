import 'reflect-metadata'
import http from 'http'
import { Server } from 'socket.io'
import 'dotenv/config'
import app from './app'
import { prisma } from './config/db'
import { registerSocketHandlers } from './config/socket'

const PORT = parseInt(process.env.PORT ?? '5000', 10)

// ── Create HTTP server wrapping the Express app ───────────────
// This is the key difference from app.ts: app.ts configures
// Express but never opens a port. server.ts wraps app in
// http.createServer so Socket.io can share the same port,
// then calls server.listen() to actually start accepting traffic.
const server = http.createServer(app)

// ── Attach Socket.io to the HTTP server ──────────────────────
export const io = new Server(server, {
  cors: {
    origin:      process.env.CLIENT_URL ?? 'http://localhost:5173',
    methods:     ['GET', 'POST'],
    credentials: true,
  },
  // Reconnection settings
  pingTimeout:  60000,
  pingInterval: 25000,
})

registerSocketHandlers(io)

// ── Helper: emit a notification to a specific user's room ────
// Use this in any service: emitNotification(io, userId, {...})
export const emitNotification = (
  targetUserId: string,
  payload: {
    type:    string
    title:   string
    body:    string
    link?:   string
  }
): void => {
  io.to(`user:${targetUserId}`).emit('notification', payload)
}

// ── Boot sequence ────────────────────────────────────────────
async function start(): Promise<void> {
  try {
    // 1. Verify DB connection before opening port
    await prisma.$connect()
    console.log('✓ PostgreSQL connected via Prisma')

    // 2. Start listening
    server.listen(PORT, () => {
      console.log(`✓ Server running  → http://localhost:${PORT}`)
      console.log(`✓ API docs        → http://localhost:${PORT}/api/docs`)
      console.log(`✓ Socket.io ready`)
      console.log(`  Environment: ${process.env.NODE_ENV ?? 'development'}`)
    })
  } catch (err) {
    console.error('✗ Failed to start server:', err)
    await prisma.$disconnect()
    process.exit(1)
  }
}

// ── Graceful shutdown ────────────────────────────────────────
const shutdown = async (signal: string): Promise<void> => {
  console.log(`\n${signal} received — shutting down gracefully`)
  server.close(async () => {
    await prisma.$disconnect()
    console.log('✓ DB disconnected. Goodbye.')
    process.exit(0)
  })
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT',  () => shutdown('SIGINT'))

start()
