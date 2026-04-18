import 'reflect-metadata'
import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'
import 'dotenv/config'

import authRoutes         from '@/routers/auth.routes'
import userRoutes         from '@/routers/user.routes'
import internshipRoutes   from '@/routers/internship.routes'
import applicationRoutes  from '@/routers/application.routes'
import logbookRoutes      from '@/routers/logbook.routes'
import evaluationRoutes   from '@/routers/evaluation.routes'
import reportRoutes       from '@/routers/report.routes'
import messageRoutes      from '@/routers/message.routes'
import notificationRoutes from '@/routers/notification.routes'
import { errorHandler }   from '@/middleware/error.middleware'
import { RegisterRoutes } from '@/docs/routes'
import swaggerDocument    from '@/docs/swagger.json'

const app: Application = express()

// ── Security headers ─────────────────────────────────────────
app.use(helmet())

// ── CORS ─────────────────────────────────────────────────────
app.use(cors({
  origin:      process.env.CLIENT_URL ?? 'http://localhost:5173',
  credentials: true,
  methods:     ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}))

// ── Request logging ──────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'))
}

// ── Body parsing ─────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())

// ── Rate limiting ────────────────────────────────────────────
// Tighter limit on auth endpoints to prevent brute force
app.use('/api/auth', rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max:      20,
  message:  { success: false, message: 'Too many auth attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders:   false,
}))

// General API limit
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      300,
  message:  { success: false, message: 'Too many requests, please slow down' },
  standardHeaders: true,
  legacyHeaders:   false,
}))

// ── Health check ─────────────────────────────────────────────
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ── Swagger UI ───────────────────────────────────────────────
// Access at: http://localhost:5000/api/docs
app.use(
  '/api/docs',
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc:  ["'self'", "'unsafe-inline'"],
      styleSrc:   ["'self'", "'unsafe-inline'"],
      imgSrc:     ["'self'", 'data:', 'https:'],
    },
  }),
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customSiteTitle: 'Internship System API Docs',
    swaggerOptions: { persistAuthorization: true },
  })
)

// ── tsoa generated routes ────────────────────────────────────
RegisterRoutes(app)

// ── API routes ───────────────────────────────────────────────
app.use('/api/auth',          authRoutes)
app.use('/api/users',         userRoutes)
app.use('/api/internships',   internshipRoutes)
app.use('/api/applications',  applicationRoutes)
app.use('/api/logbook',       logbookRoutes)
app.use('/api/evaluations',   evaluationRoutes)
app.use('/api/reports',       reportRoutes)
app.use('/api/messages',      messageRoutes)
app.use('/api/notifications', notificationRoutes)

// ── 404 handler ──────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

// ── Global error handler (must be last) ──────────────────────
app.use(errorHandler)

export default app
