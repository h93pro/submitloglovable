# SubmitLog — Database & Data Architecture

Planning document for the Lovable Cloud (Supabase / Postgres) backend. The frontend currently uses `src/lib/mock-data.ts`; this file is the blueprint for replacing it.

---

## 1. Core Entities

### Identity
- **`auth.users`** — managed by Supabase Auth.
- **`profiles`** — `id (uuid, fk auth.users)`, `full_name`, `avatar_url`, `phone`, `title`, `company_id`, `created_at`.
- **`user_roles`** — `id`, `user_id`, `role app_role`, `unique(user_id, role)`. **Roles never live on `profiles`.**
- **`app_role` enum** — `admin`, `project_manager`, `engineer`, `viewer`.

### Projects
- **`projects`** — `id`, `code`, `name`, `client`, `status`, `start_date`, `end_date`, `currency`, `owner_id`, `created_at`.
- **`project_members`** — `project_id`, `user_id`, `project_role`, `unique(project_id, user_id)`. Scopes a user into a project.

### Documents (the submittal family: Material Submittals, Shop Drawings, Technical Submittals, Subcontractor Approvals, Inspection Requests, Material Inspection Requests, NCRs, RFIs)
- **`document_types`** — `id`, `key` (enum-like string), `label`.
- **`documents`** — `id`, `project_id`, `type_id`, `number` (per-project sequence), `title`, `status`, `priority`, `due_date`, `assignee_id`, `submitter_id`, `discipline`, `created_at`, `updated_at`.
- **`document_revisions`** — `id`, `document_id`, `rev_index` (00, 01, …), `submitted_by`, `submitted_at`, `summary`, `status`.
- **`document_attachments`** — `id`, `document_id`, `revision_id`, `storage_path`, `mime_type`, `size`, `uploaded_by`, `uploaded_at`.
- **`document_approvals`** — `id`, `document_id`, `revision_id`, `approver_id`, `decision` (`approved | approved_with_comments | rejected | resubmit`), `comments`, `decided_at`.
- **`document_watchers`** — `document_id`, `user_id`.

### Tenders & Inquiries
- **`tenders`** — `id`, `project_id`, `code`, `title`, `status`, `submission_deadline`, `value_estimate`, `owner_id`.
- **`tender_items`** — line items linked to a tender.
- **`inquiries`** — `id`, `project_id`, `subject`, `body`, `status`, `assignee_id`, `due_date`, `created_by`.

### Daily Reports
- **`daily_reports`** — `id`, `project_id`, `report_date`, `weather`, `manpower`, `narrative`, `submitted_by`, `submitted_at`, `status`.
- **`daily_report_photos`** — `id`, `report_id`, `storage_path`, `caption`.

### Schedule / WBS
- **`wbs_nodes`** — `id`, `project_id`, `parent_id`, `code`, `name`, `order_index`.
- **`activities`** — `id`, `project_id`, `wbs_id`, `code`, `name`, `start_date`, `end_date`, `baseline_start`, `baseline_end`, `percent_complete`, `status`.
- **`activity_dependencies`** — `predecessor_id`, `successor_id`, `type` (`FS | SS | FF | SF`), `lag_days`.
- **`schedule_updates`** — `id`, `project_id`, `update_date`, `notes`, `submitted_by`.

### Cross-cutting
- **`activity_log`** — `id`, `actor_id`, `entity_table`, `entity_id`, `action`, `metadata jsonb`, `created_at`. Append-only audit.
- **`notifications`** — `id`, `user_id`, `kind`, `title`, `body`, `link`, `read_at`, `created_at`.

---

## 2. Relationships

```
projects 1—* documents
documents 1—* document_revisions
documents 1—* document_attachments
documents 1—* document_approvals
documents 1—* document_watchers

projects 1—* wbs_nodes 1—* activities
activities *—* activities (via activity_dependencies)

projects 1—* daily_reports 1—* daily_report_photos
projects 1—* tenders 1—* tender_items
projects 1—* inquiries

auth.users 1—1 profiles
auth.users 1—* user_roles
auth.users *—* projects (via project_members)
```

Lifecycle invariants:
- A `document` always has at least one `document_revisions` row (Rev 00).
- A `document_approval` references a specific `revision_id` — approvals are per-revision, not per-document.
- `activities.percent_complete` is updated via `schedule_updates`; raw edits are blocked by a trigger that writes to `activity_log`.

---

## 3. RLS Strategy

Every table has RLS enabled. Roles resolved via:

```sql
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role);
$$;
```

Membership helper:
```sql
create or replace function public.is_project_member(_user_id uuid, _project_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.project_members where user_id = _user_id and project_id = _project_id);
$$;
```

Policy patterns:

| Role | Read | Write |
|---|---|---|
| `admin` | all rows | all rows |
| `project_manager` | rows in projects they manage | full CRUD inside their projects |
| `engineer` | rows in projects they're a member of | create/edit documents they own; submit revisions; cannot approve |
| `viewer` | rows in projects they're a member of | none |

Example:
```sql
create policy "members read documents"
on public.documents for select to authenticated
using (public.is_project_member(auth.uid(), project_id));

create policy "admins manage all"
on public.documents for all to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));
```

---

## 4. API Design

Default to **`createServerFn`** for app reads/writes — typed, RLS-applied via `requireSupabaseAuth` middleware, called from React Query.

**Naming:**
- Verbs: `get*`, `list*`, `create*`, `update*`, `delete*`, `submit*`, `approve*`.
- File: `src/lib/<domain>.functions.ts`. Example: `documents.functions.ts` → `listDocuments`, `getDocument`, `createDocumentRevision`, `decideApproval`.

**Validation:** every server fn has a Zod `inputValidator`. Enforce string length, enum membership, UUID format. Never trust client input.

**Server routes** (`src/routes/api/public/*`) are reserved for webhooks (WhatsApp inbound, email-in, cron) and require HMAC signature verification before any DB access.
