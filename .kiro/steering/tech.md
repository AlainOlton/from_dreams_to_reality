# Tech Stack

## Backend (`/backend`)

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express 5 |
| Language | TypeScript 6 (strict mode) |
| ORM | Prisma 7 (`@prisma/client`) |
| Database | PostgreSQL |
| Auth | JWT (`jsonwebtoken`) + bcryptjs |
| Real-time | Socket.IO 4 |
| File storage | Cloudinary (via `multer-storage-cloudinary`) |
| Email | Nodemailer |
| SMS | Twilio |
| Reports | `pdf-lib` (PDF), `exceljs` (Excel) |
| Validation | `express-validator` |
| Security | `helmet`, `express-rate-limit`, `cors` |

## Frontend (`/frontend`)

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Language | TypeScript 6 |
| Build tool | Vite 8 |
| Styling | Tailwind CSS 4 (Vite plugin) |
| Routing | React Router v7 |
| Data fetching | TanStack Query v5 + Axios |
| State management | Zustand 5 |
| Forms | React Hook Form + Zod validation |
| UI components | Headless UI |
| Icons | Lucide React |
| Charts | Recharts |
| Maps | React Leaflet |
| Toasts | React Hot Toast |
| Real-time | Socket.IO client |
| Date utils | date-fns |

## Common Commands

### Backend
```bash
# Development (with nodemon hot-reload)
npm run dev

# Type-check without emitting
npm run type-check

# Compile to dist/
npm run build

# Start compiled server
npm run start

# Database migrations
npm run db:migrate      # run pending migrations
npm run db:generate     # regenerate Prisma client after schema changes
npm run db:studio       # open Prisma Studio GUI
npm run db:seed         # seed the database
```

### Frontend
```bash
# Development server (proxies /api → http://localhost:5000)
npm run dev

# Production build
npm run build

# Lint
npm run lint

# Preview production build
npm run preview
```

## Path Aliases

Backend uses `@/*` mapped to `src/*` (configured in `tsconfig.json` and `tsconfig-paths`).  
Always use `@/` imports in backend code — never use relative `../` paths.

## Environment

- Backend: `.env` at `backend/.env` (see `.env.example` for required keys)
- Frontend: `.env` at `frontend/.env`
- Backend runs on port **5000** by default; frontend dev server on **5173**
- Frontend Vite proxy forwards `/api/*` to `http://localhost:5000`
