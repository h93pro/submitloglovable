# SubmitLog — Frontend Architecture

A reference for engineers and AI coding agents working on the SubmitLog codebase. Read this before adding new modules or refactoring shared systems.

---

## 1. Tech Stack

- **TanStack Start v1** (React 19, SSR-capable, edge runtime / Cloudflare Workers)
- **Vite 7** bundler
- **TanStack Router** (file-based, type-safe)
- **TanStack Query** (server-state cache; minimal usage today, expands with backend)
- **Tailwind CSS v4** via `src/styles.css` (`@theme inline`, native `@import`)
- **shadcn/ui** primitives (Radix under the hood)
- **lucide-react** icons
- **sonner** toasts
- **NestJS + PostgreSQL REST API** — consumed via `src/lib/api-client.ts` (fetch-based, JWT auth with refresh)

---

## 2. Project Structure

```
src/
├── routes/                  # File-based routes (TanStack)
│   ├── __root.tsx           # Root layout: providers, sidebar, topbar, outlet
│   ├── index.tsx            # Dashboard
│   ├── projects.tsx         # Projects list
│   ├── projects.$id.tsx     # Project detail
│   ├── documents.<type>.index.tsx
│   ├── documents.<type>.$id.tsx
│   ├── admin.*.tsx          # Admin pages (users, projects, settings, bot)
│   └── api/                 # (Future) server route handlers
├── components/
│   ├── app-shell/           # Sidebar, Topbar, CommandPalette, CreateDocumentSheet
│   ├── documents/           # DocumentModulePage, DocumentsTable, DocumentDetail, StatusBadge
│   ├── schedule/            # GanttChart, ActivityTable
│   ├── dashboard/           # StatCard, ActivityFeed, MiniTrend
│   ├── data-table/          # Shared table toolbar
│   ├── states/              # AppStates (empty, error, loading, offline, unauthorized)
│   ├── ui/                  # shadcn primitives (do not edit casually)
│   └── quick-create-dialog.tsx  # Canonical create/invite/add modal
├── lib/
│   ├── utils.ts             # cn()
│   ├── mock-data.ts         # In-memory seed data (replaced by backend later)
│   ├── theme.tsx            # Theme provider + toggle
│   └── error-capture.ts     # Global error hooks
├── hooks/
│   └── use-mobile.tsx
├── styles.css               # Tailwind v4 entry + design tokens
├── router.tsx               # Router factory (per-request)
├── start.ts                 # Start config + middleware
└── server.ts                # SSR entry
```

> No `app/`, no `pages/`, no `features/`, no `services/`, no `mock/` top-level dirs today. If a directory does not exist above, it does not exist in the repo — do not invent it.

---

## 3. Reusable Systems

### `DocumentModulePage` (`src/components/documents/document-module-page.tsx`)
Single engine for all eight submittal-style modules (RFIs, NCRs, Shop Drawings, etc.). Takes `title`, `icon`, `data`, `basePath` — renders the header, count summary, "New" trigger, and `DocumentsTable`. To add a new document type: create one route file, hand it the data array.

### `DocumentsTable` (`src/components/documents/documents-table.tsx`)
Sortable, selectable, link-rowed table. Accepts typed columns via `SortableColumn`. All document modules render through this.

### `GanttChart` + `ActivityTable` (`src/components/schedule/`)
Schedule module engine. Gantt owns the timeline view; ActivityTable owns the tabular WBS view. They share the same activity data shape.

### `AppStates` (`src/components/states/app-states.tsx`)
Single source for empty / error / loading / offline / unauthorized / maintenance / server-error / session-expired screens. Route-level state pages import variants from here.

### `QuickCreateDialog` (`src/components/quick-create-dialog.tsx`)
The canonical create/invite/add modal. Pass `fields: QuickField[]`, a `trigger`, and an `onSubmit`. Replaces ad-hoc dialogs. **All "New / Add / Invite / Create" actions must use this.**

### Responsive shell (`__root.tsx` + `AppSidebar` + `MobileSidebar`)
Single layout engine: collapsible desktop sidebar, mobile sheet sidebar, sticky topbar, single `<Outlet />`. New pages plug into this — never recreate chrome.

---

## 4. State Management

| Layer | Today | Future |
|---|---|---|
| **Server state** | Mock arrays in `lib/mock-data.ts` | TanStack Query against the NestJS REST API via `src/lib/api-client.ts` |
| **URL state** | TanStack Router params/search | Same — search params for filters/sort/pagination |
| **Local UI state** | `useState` co-located | Same |
| **Cross-cutting state** | Theme provider | Add auth/session context wrapping `apiClient` token storage |
| **Realtime** | None | Optional WebSocket/SSE channel exposed by the NestJS backend |

Rule: **never** store filter/sort/pagination state in React state if the user could reasonably bookmark or share it — put it in `search` params.

---

## 5. Styling Strategy

- **Tailwind v4** with `@theme inline` in `src/styles.css`. All tokens are CSS variables in `oklch()`.
- **shadcn/ui** for primitives. Customize via the `cva` variants pattern, not by forking the component.
- **Tokens only.** No `text-white`, `bg-black`, `#hex`, or inline RGB. Add a token to `styles.css` if you need a new color.
- **`cn()`** for conditional class composition. Never concatenate strings manually for class names.
- **No CSS modules, no styled-components, no emotion.** Tailwind utilities + tokens only.

---

## 6. Backend Integration (NestJS REST API)

Shape:

- **Base URL** — `VITE_API_BASE_URL` (e.g. `https://submitlog.h93.pro/api`).
- **Client** — `src/lib/api-client.ts` — fetch-based, typed errors (`ApiError`), `apiClient.{get,post,put,patch,delete}` helpers.
- **Auth** — JWT access token (`sl_access_token`) attached as `Authorization: Bearer <token>`. On 401, client calls `POST /auth/refresh` with `sl_refresh_token`, retries the original request once, and on failure clears tokens and redirects to `/login`.
- **Authorization** — Roles and permissions enforced server-side by NestJS guards.
- **Webhooks & integrations** — Handled by the NestJS backend; the frontend only consumes REST endpoints.
- **Storage** — Attachments uploaded via REST (multipart); downloads via signed URLs returned by the backend.
- **Realtime** — Optional WebSocket/SSE provided by the backend.
- **Notifications** — Polled or pushed via the realtime channel above.
- **AI** — Lovable AI Gateway for daily-report summarization, RFI triage, schedule narrative generation.
