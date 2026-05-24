# Claude Code — Fast Context for SubmitLog

Read this first. It's the compressed map of the project. Deep-dive files: `DESIGN.md`, `ARCHITECTURE.md`, `COMPONENTS.md`, `DATABASE-DESIGN.md`, `WORKFLOW.md`, `UI-RULES.md`, `ROADMAP.md`.

---

## What this is

**SubmitLog** — enterprise document-control & project-delivery platform for construction. Users: PMs, planners, document controllers, engineers, site supervisors. Modules: Projects, Tenders, Inquiries, Daily Reports, Schedule (Gantt), and 8 submittal document types (Material Submittals, Shop Drawings, Technical Submittals, Subcontractor Approvals, Inspection Requests, Material Inspection Requests, NCRs, Request for Information).

## Stack

TanStack Start v1 (React 19, SSR, Cloudflare Workers) · Vite 7 · TanStack Router (file-based) · TanStack Query · Tailwind v4 (`@theme inline`, oklch tokens) · shadcn/ui · lucide-react · sonner.

Backend: **Lovable Cloud (Supabase)** — planned, not yet enabled. Today the app reads from `src/lib/mock-data.ts`.

## Architecture in 30 seconds

- Routes live in `src/routes/` (flat dot-separated). Root layout is `src/routes/__root.tsx`. Never create `src/pages/`.
- `__root.tsx` owns the providers, sidebar, topbar, command palette, global create dialog, and the single `<Outlet />`.
- Reusable engines: `DocumentModulePage`, `DocumentsTable`, `DocumentDetail`, `StatusBadge`, `QuickCreateDialog`, `GanttChart`, `ActivityTable`, `AppStates`, `DataTableToolbar`.
- Server state will go through `createServerFn` + TanStack Query when Cloud lands. No `useEffect + fetch`.

## Design philosophy (compressed)

Enterprise-first. Dense but readable. Linear/Notion/Procore vibes. Calm indigo accent. No shadows — borders + token contrast instead. 120–200 ms ease-out motion. Dark mode parity is mandatory.

## Critical reusable systems

| Need | Use |
|---|---|
| Add/Create/Invite/New | `QuickCreateDialog` (centered modal) |
| Document list page | `DocumentModulePage` |
| Document list table | `DocumentsTable` |
| Status pill | `StatusBadge` |
| Empty/loading/error/offline/404/500 | `AppStates` |
| List toolbar | `DataTableToolbar` |
| Schedule timeline | `GanttChart` + `ActivityTable` |

## Strict rules (the contract)

1. **Tokens only.** No `text-white`, `bg-gray-500`, `#hex`, inline color. Use `bg-card`, `text-muted-foreground`, `bg-primary`, etc. Add new tokens to `src/styles.css` in both `:root` and `.dark`.
2. **One canonical component per pattern.** Never fork `StatusBadge`, `DocumentsTable`, `QuickCreateDialog`, `AppStates`.
3. **All create/invite/add → `QuickCreateDialog`.** No new side sheets. No bespoke dialogs.
4. **Dark mode parity always.**
5. **Lucide icons only.** Sizes `3.5 / 4 / 5`.
6. **Filters/sort/pagination → URL search params**, not React state.
7. **Forms:** Zod validation, inline errors, 2-col on `sm+`, 1-col mobile, loading states on submit buttons.
8. **No `any`. No `console.log` in committed code. No `useEffect + fetch`.**
9. **Tables ship all three states** (loading skeleton, empty, error with retry).
10. **Roles in `user_roles` table** + `has_role()` security-definer function. Never on `profiles`.

## Anti-patterns (do not do)

- ❌ Building a new modal/sheet/drawer for a create flow → use `QuickCreateDialog`.
- ❌ Hardcoded color classes (`text-white`, `bg-black`, `text-gray-500`).
- ❌ `src/pages/`, `App.tsx` page-switchers, react-router-dom imports.
- ❌ Inline status pills (`<span className="bg-green-500">…</span>`).
- ❌ Spinners on full pages → use skeletons.
- ❌ Editing `src/routeTree.gen.ts` (auto-generated).
- ❌ Storing user roles on the `profiles` or `users` table.
- ❌ Direct Supabase calls from components for app data — use `createServerFn`.
- ❌ Toasts for validation or navigation feedback.
- ❌ Decorative animations, parallax, bouncing springs.

## Patterns to follow

- ✅ Add a new submittal type: create one `documents.<name>.index.tsx` + `documents.<name>.$id.tsx`, render `DocumentModulePage` with the type's data and a Lucide icon, add a sidebar entry in `src/components/app-shell/sidebar.tsx`.
- ✅ Add a create action: drop a `QuickCreateDialog` with a `fields` array and `onSubmit`. Done.
- ✅ Add a new state screen: extend `AppStates`, then create a thin route file that renders the variant.
- ✅ Add a new color: append the token to `:root` and `.dark` in `src/styles.css`, expose via `@theme inline`, then consume as a Tailwind class.

## Warnings

- Cloudflare Workers runtime — **no** `child_process`, `sharp`, `puppeteer`, native binaries. Use Web APIs / WASM / external HTTP.
- `process.env.*` is server-only. `import.meta.env.VITE_*` is browser-safe.
- Auth-protected server fns will 401 during SSR/prerender on public routes — call them from components via `useServerFn`, or put the route under `_authenticated/`.
- `src/routeTree.gen.ts` is generated. Never edit.

## When in doubt

1. Check `UI-RULES.md` — most "should I do X" questions are answered there.
2. Check `COMPONENTS.md` — there is probably already a component.
3. Check `DESIGN.md` — for spacing, type, color decisions.
4. Check `ARCHITECTURE.md` — for where a file should live.
5. Check `DATABASE-DESIGN.md` + `WORKFLOW.md` — for backend/domain logic.

If a rule conflicts with a request, surface the conflict before writing code.
