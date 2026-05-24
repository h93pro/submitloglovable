# SubmitLog — Enterprise Construction Document Control

> A modern, data-dense workspace for construction document control, submittals, RFIs, inspections and project scheduling. Built to feel at home next to Procore, Autodesk Construction Cloud and Oracle Primavera Cloud — with the polish of Linear and Notion.

![status](https://img.shields.io/badge/status-active-success) ![stack](https://img.shields.io/badge/stack-TanStack%20Start%20%2B%20React%2019-blue) ![styling](https://img.shields.io/badge/styling-Tailwind%20v4-06b6d4) ![backend](https://img.shields.io/badge/backend-NestJS%20%2B%20PostgreSQL-e0234e)

---

## ✦ Overview

SubmitLog is the document control and planning hub for construction projects. It centralises the full lifecycle of submittals, drawings, inspections and RFIs, and pairs them with a Primavera-style schedule workspace, executive dashboards and an admin/settings surface for governance.

The application is **desktop-first**, fully **responsive**, **dark-mode native**, and follows a **single design token system** — no hard-coded colours, no mixed interaction patterns.

The frontend is a pure SPA-style TanStack Start app that talks to an external **NestJS + PostgreSQL REST API** through a single typed HTTP client (`src/lib/api-client.ts`). There is no embedded backend, no Supabase, and no serverless functions in this repository.

---

## ✦ Modules

| Area | Description |
|------|-------------|
| **Dashboard** | KPI overview, activity feed, project pulse |
| **Projects** | Portfolio with grid/list views and per-project detail pages |
| **Tenders** | Tender pipeline with status, bidders and deadlines |
| **Inquiries** | Inbox-style supplier clarifications |
| **Submittals**¹ | Material Submittals · Shop Drawings · Technical Submittals · Subcontractor Approvals · Inspection Requests · Material Inspections · Non-Conformance · Request for Information |
| **Schedule** | Enterprise Gantt with WBS tree, critical path, baseline overlay, S-curve, resource histogram, float distribution, delay analysis, import/export |
| **Daily Reports** | Site logs with weather, manpower and equipment |
| **Overdue** | Cross-module overdue triage |
| **Offline** | Service-worker-aware offline shell |
| **Admin** | Users, Projects, Settings, WhatsApp Bot |
| **Auth** | Login, Forgot Password (isolated from the app shell) |
| **System States** | `/unauthorized` · `/session-expired` · `/server-error` · `/maintenance` |

¹ The sidebar group is labelled **Submittals**, covering all document modules.

---

## ✦ Tech Stack

- **Framework** — [TanStack Start v1](https://tanstack.com/start) (file-based routing)
- **Runtime** — React 19, TypeScript (strict)
- **Build** — Vite 7
- **Styling** — Tailwind CSS v4 with semantic tokens defined in `src/styles.css` (oklch)
- **UI primitives** — shadcn/ui on top of Radix UI
- **Charts** — Recharts
- **Forms** — React Hook Form + Zod
- **Tables** — TanStack Table
- **Data layer** — `src/lib/api-client.ts` (fetch wrapper with auto JWT refresh); TanStack Query ready for per-screen wiring
- **Backend** — NestJS + PostgreSQL REST API (external service)

---

## ✦ Architecture

```
┌──────────────────────────────────────────────────────────┐
│  Root layout (__root.tsx)                                │
│  ├─ If route ∈ {/login, /forgot-password, /reset-…}      │
│  │     → render <Outlet /> only (no app shell)           │
│  └─ Else                                                 │
│        ├─ Sidebar ├─ Topbar ├─ Command Palette ├─ Toast  │
│        └─ <Outlet />                                     │
│              ├─ Page routes (flat dot-routing)           │
│              ├─ DocumentModulePage  ← shared engine      │
│              ├─ QuickCreateDialog   ← shared create flow │
│              └─ App states          ← empty/loading/err  │
└──────────────────────────────────────────────────────────┘

           Browser
              │
              ▼
   src/lib/api-client.ts  ──►  NestJS REST API  ──►  PostgreSQL
   (JWT access + refresh,
    auto-retry on 401)
```

- **Single source of truth for data**: the NestJS REST API, consumed via `apiClient`. `src/lib/mock-data.ts` is still used by screens that have not been wired to the backend yet.
- **Single source of truth for tokens**: `src/styles.css` (light + dark in oklch).
- **One create/edit pattern**: centered shadcn Dialog, no mixed sheets/drawers (mobile nav is the only Sheet, by design).

---

## ✦ Folder Structure

```
src/
├─ routes/                       # File-based routes (dot-separated, flat)
│  ├─ __root.tsx                 # Shell + providers + outlet (auth routes bypass the shell)
│  ├─ index.tsx                  # Dashboard
│  ├─ login.tsx                  # Sign in (isolated layout)
│  ├─ forgot-password.tsx        # Password reset request (isolated layout)
│  ├─ projects.tsx, projects.$id.tsx
│  ├─ tenders.tsx, tenders.$id.tsx
│  ├─ schedule.tsx               # Primavera-style workspace
│  ├─ documents.<module>.index.tsx, documents.<module>.$id.tsx
│  ├─ admin.*.tsx                # Admin surfaces
│  └─ unauthorized.tsx, session-expired.tsx, server-error.tsx, maintenance.tsx
├─ components/
│  ├─ app-shell/                 # Sidebar, Topbar, Command Palette, Create dialog
│  ├─ dashboard/                 # StatCard, MiniTrend, ActivityFeed
│  ├─ documents/                 # DocumentModulePage, DocumentsTable, DocumentDetail, StatusBadge
│  ├─ schedule/                  # GanttChart, ActivityTable
│  ├─ data-table/                # DataTableToolbar, BulkActionBar, density helpers
│  ├─ states/                    # Empty / Loading / Error / Full-page system states
│  ├─ quick-create-dialog.tsx    # Reusable create modal
│  └─ ui/                        # shadcn/ui primitives
├─ lib/
│  ├─ api-client.ts              # Fetch wrapper, JWT storage, auto-refresh
│  ├─ mock-data.ts               # Typed mock dataset (for screens not yet wired)
│  ├─ theme.tsx                  # Theme provider
│  └─ utils.ts                   # cn() + helpers
├─ hooks/
│  └─ use-mobile.tsx
├─ styles.css                    # Tokens, animations, micro-interactions
└─ router.tsx, start.ts, server.ts
```

---

## ✦ Backend API

The frontend expects a NestJS REST API mounted under `VITE_API_BASE_URL`.

### Auth contract

| Method | Endpoint                  | Body / Notes                                                                 |
|--------|---------------------------|------------------------------------------------------------------------------|
| POST   | `/auth/login`             | `{ email, password }` → `{ accessToken, refreshToken, user }`                |
| POST   | `/auth/refresh`           | `{ refreshToken }` → `{ accessToken, refreshToken }`                         |
| POST   | `/auth/forgot-password`   | `{ email }` → `204` (always, to prevent user enumeration)                    |
| POST   | `/auth/logout`            | Authenticated; invalidates the refresh token server-side                     |

User payload returned by `/auth/login`:

```ts
{
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: "ADMIN" | "EDITOR" | "VIEWER" | "CONSULTANT";
  mustChangePassword: boolean;
}
```

If `user.mustChangePassword === true`, the login flow redirects to `/change-password`. Otherwise it redirects to `/`.

### Token storage

- `accessToken` → `localStorage["sl_access_token"]`
- `refreshToken` → `localStorage["sl_refresh_token"]`
- Attached automatically by `apiClient` as `Authorization: Bearer <accessToken>`.
- On `401`, the client transparently calls `/auth/refresh` once and retries the original request. If refresh fails, tokens are cleared and the user is redirected to `/login`.

### Calling the API

```ts
import { apiClient } from "@/lib/api-client";

// GET
const projects = await apiClient.get<Project[]>("/projects");

// POST with body
const created = await apiClient.post<Project>("/projects", { name: "Tower A" });

// Skip auth (e.g. login, forgot-password)
await apiClient.post("/auth/forgot-password", { email }, { skipAuth: true });
```

---

## ✦ Setup

**Requirements**

- Node 20+ (or Bun 1.x — recommended)
- Access to a running NestJS REST API instance

**Install & run**

```bash
bun install
bun run dev          # http://localhost:5173
bun run build        # production build
bun run preview      # serve the built app
bun run lint
bun run format
```

**Environment**

Create a `.env` file from `.env.example`:

| Variable             | Scope  | Purpose                                                              |
|----------------------|--------|----------------------------------------------------------------------|
| `VITE_API_BASE_URL`  | client | NestJS REST API base URL (e.g. `https://submitlog.h93.pro/api`)      |

Example:

```bash
VITE_API_BASE_URL=https://submitlog.h93.pro/api
```

---

## ✦ Responsive & PWA

- **Desktop-first** (1366 → 1920) with comfortable density mode
- **Tablet** (768 → 1280) — sidebar collapses, tables become horizontally scrollable
- **Mobile** (375 → 640) — sidebar becomes a Sheet drawer, settings becomes Accordion, Gantt enables sticky timeline + horizontal scroll
- **Dark mode** — token parity verified across every surface
- **PWA-ready** — offline route + service-worker-friendly shell

---

## ✦ Roadmap — Backend Wiring

The frontend is fully decoupled from data. The remaining work is to swap `mock-data.ts` reads for live `apiClient` calls, screen by screen:

1. **Auth** — ✅ Login wired (`/auth/login`), ✅ Forgot password wired (`/auth/forgot-password`), refresh-token interceptor active
2. **Projects, Tenders, Inquiries** — replace mock reads with `apiClient.get(...)` + TanStack Query
3. **Submittals (8 modules)** — bind `DocumentModulePage` to backend list/detail endpoints
4. **Schedule** — fetch WBS, activities, baselines, resources from the API
5. **Attachments** — multipart upload via REST endpoint
6. **Realtime** — optional WebSocket/SSE channel exposed by the backend
7. **AI insights** — backend-owned endpoints for schedule analysis, RFI suggestions, narrative summaries

---

## ✦ Development Guidelines

- **Styling** — only semantic tokens from `src/styles.css` (`text-foreground`, `bg-card`, …). Never raw hex or `text-white`.
- **Create flows** — always use `QuickCreateDialog` or a custom `Dialog`; never `Sheet`/`Drawer` for create/edit.
- **Routes** — file-based, flat dot-notation (`documents.rfis.$id.tsx`). Do not edit `routeTree.gen.ts`.
- **Auth pages** — `/login`, `/forgot-password`, `/reset-password` render outside the app shell (handled in `__root.tsx`). Do not wrap them in the sidebar/topbar layout.
- **Data fetching** — go through `apiClient` only. No direct `fetch()` calls in components, no Supabase imports.
- **State** — local first; lift to TanStack Query when wiring a screen to the backend.
- **Accessibility** — icon-only buttons must have `aria-label`; all dialogs have title + description; respect focus trapping (handled by Radix).
- **Naming** — Pascal-case components, kebab-case files; route components must be named functions (not inline arrows) for HMR.

---

## ✦ Project Summary

- **36 routes** across dashboard, portfolio, submittals (8), schedule, admin (4), auth (2), system states (4) and content pages
- **40+ reusable components** including the app shell, dashboard widgets, document engine, Gantt chart, enterprise table toolbar, app-state library and quick-create dialog
- **One design token system, one create pattern, one document engine** — consistent across every surface
- **Responsive coverage** verified on 375 / 414 / 834 / 1366 / 1920
- **Dark mode parity** across all routes
- **Production-ready frontend**, decoupled from data, talking to a NestJS REST API via a single typed client

---

## ✦ Screenshots

> _Add screenshots of the dashboard, schedule Gantt, document module and settings here once the design is signed off._

```
docs/screenshots/
├─ dashboard.png
├─ schedule-gantt.png
├─ submittals-table.png
└─ settings.png
```

---

## ✦ License

Proprietary — © SubmitLog. All rights reserved.
