# SubmitLog — Enterprise Construction Document Control

> A modern, data-dense workspace for construction document control, submittals, RFIs, inspections and project scheduling. Built to feel at home next to Procore, Autodesk Construction Cloud and Oracle Primavera Cloud — with the polish of Linear and Notion.

![status](https://img.shields.io/badge/status-active-success) ![stack](https://img.shields.io/badge/stack-TanStack%20Start%20%2B%20React%2019-blue) ![styling](https://img.shields.io/badge/styling-Tailwind%20v4-06b6d4) ![db](https://img.shields.io/badge/backend-Lovable%20Cloud-7c3aed)

---

## ✦ Overview

SubmitLog is the document control and planning hub for construction projects. It centralises the full lifecycle of submittals, drawings, inspections and RFIs, and pairs them with a Primavera-style schedule workspace, executive dashboards and an admin/settings surface for governance.

The application is **desktop-first**, fully **responsive**, **dark-mode native**, and follows a **single design token system** — no hard-coded colours, no mixed interaction patterns.

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
| **Admin** | Users, Projects, Settings (11 sections, dirty-tracking, navigation guards), WhatsApp Bot |
| **System States** | `/unauthorized` · `/session-expired` · `/server-error` · `/maintenance` |

¹ The sidebar group is labelled **Submittals**, covering all document modules.

---

## ✦ Tech Stack

- **Framework** — [TanStack Start v1](https://tanstack.com/start) (file-based routing, SSR-ready)
- **Runtime** — React 19, TypeScript (strict)
- **Build** — Vite 7
- **Styling** — Tailwind CSS v4 with semantic tokens defined in `src/styles.css` (oklch)
- **UI primitives** — shadcn/ui on top of Radix UI
- **Charts** — Recharts
- **Forms** — React Hook Form + Zod
- **Tables** — TanStack Table
- **State / data** — TanStack Query (ready), `mock-data.ts` for the current prototype
- **Edge target** — Cloudflare Workers via `@cloudflare/vite-plugin`
- **Backend** — NestJS + PostgreSQL REST API (consumed via `src/lib/api-client.ts`)

---

## ✦ Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Root layout (__root.tsx)                               │
│  ├─ Sidebar  ├─ Topbar  ├─ Command Palette  ├─ Toaster  │
│  └─ <Outlet />                                          │
│      ├─ Page routes (flat dot-routing)                  │
│      ├─ DocumentModulePage  ← shared engine             │
│      ├─ QuickCreateDialog   ← shared create flow        │
│      └─ App states          ← empty / loading / error   │
└─────────────────────────────────────────────────────────┘
```

- **Single source of truth for data**: `src/lib/mock-data.ts` (typed, swappable for Cloud queries)
- **Single source of truth for tokens**: `src/styles.css` (light + dark in oklch)
- **One create/edit pattern**: centered shadcn Dialog, no mixed sheets/drawers (mobile nav is the only Sheet, by design)

---

## ✦ Folder Structure

```
src/
├─ routes/                       # File-based routes (dot-separated, flat)
│  ├─ __root.tsx                 # Shell + providers + outlet
│  ├─ index.tsx                  # Dashboard
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
│  ├─ mock-data.ts               # Typed mock dataset (single source of truth)
│  ├─ theme.tsx                  # Theme provider
│  └─ utils.ts                   # cn() + helpers
├─ hooks/
│  └─ use-mobile.tsx
├─ styles.css                    # Tokens, animations, micro-interactions
└─ router.tsx, start.ts, server.ts
```

---

## ✦ Setup

**Requirements**

- Node 20+ (or Bun 1.x — recommended)
- Access to the NestJS REST API backend

**Install & run**

```bash
bun install
bun run dev          # http://localhost:5173
bun run build        # production build (Cloudflare Worker target)
bun run preview      # serve the built app
bun run lint
bun run format
```

**Environment**

| Variable | Scope | Purpose |
|----------|-------|---------|
| `VITE_API_BASE_URL` | client | NestJS REST API base URL (e.g. `https://submitlog.h93.pro/api`) |

See `.env.example`. Auth tokens are stored in `localStorage` under `sl_access_token` / `sl_refresh_token` and attached automatically by `src/lib/api-client.ts`.

---

## ✦ Responsive & PWA

- **Desktop-first** (1366 → 1920) with comfortable density mode
- **Tablet** (768 → 1280) — sidebar collapses, tables become horizontally scrollable
- **Mobile** (375 → 640) — sidebar becomes a Sheet drawer, settings becomes Accordion, Gantt enables sticky timeline + horizontal scroll
- **Dark mode** — token parity verified across every surface
- **PWA-ready** — offline route + service-worker-friendly shell; manifest wiring is part of the backend phase

---

## ✦ Roadmap — Backend Integration

The frontend is fully decoupled from data. The next phase replaces `mock-data.ts` with live calls to the NestJS REST API via `src/lib/api-client.ts`:

1. **Auth** — JWT access + refresh tokens stored in `localStorage`; auto-refresh on 401 with redirect to `/login` on failure
2. **Schema** — Projects, Documents, Activities, Attachments, Comments, Audit log (owned by the NestJS + PostgreSQL backend)
3. **Data layer** — TanStack Query around `apiClient` for all reads/writes
4. **File storage** — Attachments uploaded via REST endpoints (multipart)
5. **Realtime** — WebSocket / SSE channel exposed by the backend (optional)
6. **Webhooks** — Handled server-side by NestJS; the frontend only consumes REST endpoints
7. **AI insights** — Backend-owned endpoints for schedule analysis, RFI suggestions, narrative summaries

---

## ✦ Development Guidelines

- **Styling** — only semantic tokens from `src/styles.css` (`text-foreground`, `bg-card`, …). Never raw hex or `text-white`.
- **Create flows** — always use `QuickCreateDialog` or a custom `Dialog`; never `Sheet`/`Drawer` for create/edit.
- **Routes** — file-based, flat dot-notation (`documents.rfis.$id.tsx`). Do not edit `routeTree.gen.ts`.
- **Components** — prefer composition with shadcn primitives; new components live next to their domain (`schedule/`, `documents/`, …).
- **State** — local first; lift to TanStack Query once backend is wired.
- **Accessibility** — icon-only buttons must have `aria-label`; all dialogs have title + description; respect focus trapping (handled by Radix).
- **Naming** — Pascal-case components, kebab-case files; route components must be named functions (not inline arrows) for HMR.

---

## ✦ Project Summary

- **34 routes** across dashboard, portfolio, submittals (8), schedule, admin (4), system states (4) and content pages
- **40+ reusable components** including the app shell, dashboard widgets, document engine, Gantt chart, enterprise table toolbar, app-state library and quick-create dialog
- **One design token system, one create pattern, one document engine** — consistent across every surface
- **Responsive coverage** verified on 375 / 414 / 834 / 1366 / 1920
- **Dark mode parity** across all routes
- **Production-ready frontend**, fully decoupled from data — ready for backend wiring

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
