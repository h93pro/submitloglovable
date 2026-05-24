# SubmitLog — Roadmap

Phased plan from the current frontend-complete state to a production-ready multi-tenant SaaS.

---

## Phase 1 — Backend Foundation (Lovable Cloud)

- Enable Lovable Cloud (Supabase).
- Create core schema: `profiles`, `user_roles`, `projects`, `project_members`, `documents`, `document_revisions`, `document_attachments`, `document_approvals`.
- RLS policies for `admin`, `project_manager`, `engineer`, `viewer` (see `DATABASE-DESIGN.md`).
- `has_role()` and `is_project_member()` security-definer functions.
- Seed minimal data; replace `src/lib/mock-data.ts` reads with `createServerFn` calls.

## Phase 2 — Auth & RLS

- Supabase Auth (email + Google).
- `_authenticated/` route layout with redirect guard.
- Session listener in `__root.tsx`.
- `requireSupabaseAuth` middleware on all server fns.
- Admin user management wired to `user_roles`.

## Phase 3 — Storage

- Supabase Storage buckets: `documents`, `attachments`, `daily-report-photos`.
- Signed-URL downloads. Upload widget integrated into `QuickCreateDialog` for attachment-bearing forms.
- Virus-scan hook (deferred).

## Phase 4 — Realtime

- Postgres changes channels on `documents`, `document_approvals`, `activities`, `notifications`.
- Optimistic UI for status transitions.
- Presence indicators on document detail pages.

## Phase 5 — Notifications

- `notifications` table + realtime badge in topbar.
- Email digest (daily) via Lovable AI Gateway / Resend.
- Per-user delivery preferences in Settings.

## Phase 6 — WhatsApp Integration

- Webhook endpoint at `src/routes/api/public/whatsapp.ts` with HMAC verification.
- Inbound: convert WhatsApp messages into RFIs / inquiries / daily-report drafts.
- Outbound: push approvals and overdue alerts to opted-in users.
- Admin UI in `/admin/whatsapp-bot` for templates and routing rules.

## Phase 7 — AI Features (Lovable AI Gateway)

- Daily-report weekly digest summarization.
- RFI triage: auto-tag discipline, suggest assignee, draft a response.
- Schedule narrative: convert raw `schedule_updates` into PM-ready prose.
- Document Q&A: chat over project documents using embeddings.

## Phase 8 — Schedule Import Parsers

- Primavera P6 XER importer.
- MS Project XML importer.
- Excel WBS importer.
- Round-trip export with baseline preservation.

## Phase 9 — Testing & Quality

- Vitest unit tests for `lib/` and shared components.
- Playwright E2E for critical flows: login, create document, approve revision, submit daily report, update schedule.
- Visual regression on key pages (light + dark).
- Lighthouse budgets enforced in CI.

## Phase 10 — Multi-Tenant Readiness

- `organizations` table; every domain table scoped by `organization_id`.
- Per-org branding (logo, primary color override).
- Subscription/billing (Stripe) with seat-based pricing.
- Per-org usage analytics.

## Phase 11 — Performance

- Route-level code splitting audit.
- Image optimization pipeline.
- Virtualized rows for tables >500 records.
- React Query persistent cache for offline reads.

## Phase 12 — Offline & PWA

- Service worker with workbox strategies (stale-while-revalidate for lists, network-first for detail).
- Offline daily-report drafting with background sync on reconnect.
- Installable PWA manifest hardening (icons, splash, share-target).
- Conflict resolution UI for offline edits.
