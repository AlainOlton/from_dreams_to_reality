# Project Structure

## Repository Layout

```
/
├── backend/          # Express API server
└── frontend/         # React SPA
```

---

## Backend (`/backend/src`)

```
src/
├── app.ts                  # Express app setup (middleware, routes, error handler)
├── server.ts               # HTTP + Socket.IO server bootstrap
├── config/
│   ├── db.ts               # Prisma client singleton
│   ├── cloudinary.ts       # Cloudinary SDK config
│   └── socket.ts           # Socket.IO initialization
├── controllers/            # Route handlers — thin layer, delegates to services
├── services/               # Business logic — all DB access lives here
├── routers/                # Express Router definitions — wires controllers + middleware
├── middleware/
│   ├── auth.middleware.ts  # JWT `protect` guard
│   ├── rbac.middleware.ts  # `authorize(...roles)` role-based access
│   ├── error.middleware.ts # Global error handler (last middleware in app.ts)
│   ├── upload.middleware.ts# Multer + Cloudinary upload config
│   └── cloudinary.ts       # Cloudinary helper middleware
├── types/
│   ├── auth.types.ts       # JwtPayload, RegisterBody, LoginBody
│   ├── common.types.ts     # ApiResponse, PaginationQuery, PaginatedResult
│   ├── express.d.ts        # Augments Express Request with `req.user`
│   └── internship.types.ts # Internship-specific types
└── utils/
    ├── apiResponse.ts      # sendSuccess / sendCreated / sendError helpers
    ├── generateToken.ts    # JWT + short token generators
    ├── pagination.ts       # getPagination / buildPaginatedResult
    └── validators.ts       # express-validator rule sets
```

### Backend Conventions

- **Controller → Service** pattern: controllers only call service functions and use `apiResponse` helpers; no DB access in controllers.
- **Error handling**: throw `Object.assign(new Error('msg'), { statusCode: 4xx })` in services; the global `errorHandler` middleware catches everything.
- **Auth on routes**: always apply `protect` before `authorize`. Example:
  ```ts
  router.post('/', protect, authorize(Role.COMPANY), controller.create)
  ```
- **Pagination**: use `getPagination(query)` and `buildPaginatedResult(data, total, page, limit)` from `@/utils/pagination`.
- **Responses**: always use `sendSuccess`, `sendCreated`, or `sendError` from `@/utils/apiResponse` — never call `res.json()` directly.
- **Imports**: always use `@/` alias, never relative paths.
- **Prisma**: import the singleton from `@/config/db`, never instantiate `PrismaClient` elsewhere.

---

## Frontend (`/frontend/src`)

Currently bootstrapped with the Vite + React template. Feature directories should be added under `src/` as the app is built out. Recommended structure:

```
src/
├── assets/             # Static images/SVGs
├── components/         # Shared/reusable UI components
├── features/           # Feature-scoped modules (pages, hooks, components)
├── hooks/              # Shared custom React hooks
├── lib/                # Axios instance, query client, socket client
├── stores/             # Zustand stores
├── types/              # Shared TypeScript types/interfaces
├── utils/              # Pure utility functions
├── App.tsx             # Root component with router setup
└── main.tsx            # React DOM entry point
```

### Frontend Conventions

- **Data fetching**: use TanStack Query (`useQuery` / `useMutation`) with Axios — no raw `fetch`.
- **Forms**: React Hook Form + Zod schema validation via `@hookform/resolvers/zod`.
- **Global state**: Zustand stores for auth session and cross-feature state; keep server state in TanStack Query cache.
- **Styling**: Tailwind CSS utility classes only — no custom CSS files except `index.css` for base styles.
- **Notifications**: `react-hot-toast` for user-facing feedback.
- **Routing**: React Router v7 — define routes in `App.tsx` or a dedicated `routes/` file.
- **API base URL**: the Vite dev proxy handles `/api/*` → backend; use `/api/...` paths in Axios calls.

---

## Database (`/backend/prisma`)

- Schema: `prisma/schema.prisma` — PostgreSQL, all models use UUID primary keys.
- After any schema change: run `npm run db:migrate` then `npm run db:generate`.
- Migrations live in `prisma/migrations/` — commit them to version control.
