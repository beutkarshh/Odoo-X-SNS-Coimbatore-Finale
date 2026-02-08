# SubsManager (Subscription Management System)

A full‑stack hackathon project that manages **subscriptions → invoices → payments** with **role-based access** across three apps:

- **ADMIN**: user + catalog management (products/plans), billing operations
- **INTERNAL**: internal staff workflows
- **PORTAL**: customer dashboard (subscriptions, invoices), offers, notifications

## Tech stack

- **Backend**: Node.js + Express, JWT auth, RBAC middleware
- **DB**: PostgreSQL + Prisma (migrations + seed)
- **Frontend**: React + Vite + Tailwind

## Repo structure

- `backend/` – Express API + Prisma schema/migrations/seed
- `frontend/` – React UI + service layer (axios)

## Run locally

### 1) Backend

From `backend/`:

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Backend runs on:

- `http://localhost:4000`
- Health check: `http://localhost:4000/health`

### 2) Frontend

From `frontend/`:

```bash
npm install
npm run dev
```

Frontend runs on:

- `http://localhost:5173`

> Note: port `8080` may be occupied by EDB Postgres httpd on some machines.

## Environment variables

Backend (typical):

- `DATABASE_URL` (Postgres connection string)
- `JWT_SECRET`

Frontend:

- `VITE_API_URL` (defaults to `http://localhost:4000` if not set)

## Demo credentials (seeded)

- Admin: `admin@demo.com` / `Admin@1234`
- Customer/Portal (example): `john.doe@customer.com` / `Customer@123`

## Key integrations (how frontend talks to backend)

- Axios client + interceptors: `frontend/src/lib/api.js`
- Domain services: `frontend/src/lib/services/*`
- Auth + route protection: `frontend/src/contexts/AuthContext.jsx`, `frontend/src/routes/ProtectedRoute.jsx`
- Backend route mounting: `backend/src/app.js`
- JWT middleware + RBAC: `backend/src/middlewares/auth.middleware.js`

## Features highlight

- Subscriptions, invoices, payments flow
- Offers widget (available coupons) on portal dashboard
- Notifications (DB + API + UI bell dropdown)

## More docs

- Backend notes: `backend/README.md`
- Frontend notes: `frontend/README.md`
