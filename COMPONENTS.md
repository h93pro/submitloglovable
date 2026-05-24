# SubmitLog — Component Inventory

Reference for the major reusable components. For shadcn primitives under `src/components/ui/`, defer to the shadcn docs unless we have a project-specific rule.

---

## App Shell

### `AppSidebar` / `MobileSidebar` — `src/components/app-shell/sidebar.tsx`
**Purpose:** Primary navigation. Desktop = collapsible rail; mobile = `Sheet`.
**Props:** `{ collapsed, onToggle }` / `{ open, onOpenChange }`.
**Rules:**
- Add new top-level pages by extending the `main`, `documents`, or `admin` arrays.
- Each item is `{ to, label, icon }` where `icon` is a Lucide component.
- Do **not** create alternative sidebars or per-section navs.

### `Topbar` — `src/components/app-shell/topbar.tsx`
**Purpose:** Sticky header with mobile nav trigger, command palette, theme toggle, global "New" action, user menu.
**Props:** `{ onOpenPalette, onCreate, onOpenMobileNav }`.
**Rules:** Only one Topbar instance — owned by `__root.tsx`.

### `CommandPalette` — `src/components/app-shell/command-palette.tsx`
**Purpose:** ⌘K global search and quick actions.
**Do:** add new actions/routes here when shipping a new module.
**Don't:** build a per-page search; consolidate into the palette.

---

## Documents

### `DocumentModulePage` — `src/components/documents/document-module-page.tsx`
**Purpose:** Engine for all submittal-style index pages.
**Props:** `{ title, blurb?, icon, data: SubmittalDoc[], basePath }`.
**Usage:**
```tsx
<DocumentModulePage
  title="Request for Information"
  icon={HelpCircle}
  data={rfis}
  basePath="/documents/rfis"
/>
```
**Do:** add a new document type by creating one route file. **Don't:** duplicate the header/CTA/table layout per module.

### `DocumentsTable` — `src/components/documents/documents-table.tsx`
**Purpose:** Canonical data table for document modules.
**Features:** sortable columns (`SortableColumn`), row-link navigation, bulk-select checkbox, sticky header.
**Rules:** all document lists go through this — no per-module table forks.

### `DocumentDetail` — `src/components/documents/document-detail.tsx`
**Purpose:** Canonical detail view (metadata, revisions, attachments, approvals).
**Props:** `{ doc, backTo, backLabel }`.

### `StatusBadge` — `src/components/documents/status-badge.tsx`
**Purpose:** Single source for all status pills across the app.
**Rule:** **never** roll your own status badge. Extend the variant map here.

---

## Schedule

### `GanttChart` — `src/components/schedule/gantt-chart.tsx`
**Purpose:** Timeline visualization with WBS rows, bars, dependencies, today marker.
**Rules:** Use `.gantt-grid-line` utility for grid lines. Smooth-scroll via `.smooth-scroll-x`.

### `ActivityTable` — `src/components/schedule/activity-table.tsx`
**Purpose:** Tabular WBS view paired with the Gantt.
**Rule:** Activity shape stays in sync between Gantt and table — change one, change the other.

---

## Dashboard

### `StatCard` — `src/components/dashboard/stat-card.tsx`
**Purpose:** KPI tile with label, value, optional trend.
### `ActivityFeed` — `src/components/dashboard/activity-feed.tsx`
**Purpose:** Recent-activity stream.
### `MiniTrend` — `src/components/dashboard/mini-trend.tsx`
**Purpose:** Inline sparkline for KPIs.

---

## Data Table

### `DataTableToolbar` — `src/components/data-table/toolbar.tsx`
**Purpose:** Shared toolbar: search input, filter chips, view options, bulk actions.
**Rule:** every list page uses this toolbar — no bespoke toolbars.

---

## States

### `AppStates` — `src/components/states/app-states.tsx`
**Purpose:** Empty / Loading / Error / Offline / Unauthorized / Maintenance / 404 / 500 / SessionExpired.
**Rule:** all state screens come from here. Route files like `maintenance.tsx`, `offline.tsx`, `unauthorized.tsx`, `server-error.tsx`, `session-expired.tsx` import variants from this module.

---

## Create / Edit

### `QuickCreateDialog` — `src/components/quick-create-dialog.tsx`
**Purpose:** Canonical create/invite/add modal. Centered dialog, 2-column responsive form, inline validation, sonner success toast.
**Props:**
```ts
{
  trigger: ReactNode;
  title: string;
  description?: string;
  submitLabel?: string;
  fields: QuickField[];
  onSubmit?: (values: Record<string, string>) => void;
}
```
**Field types:** `text | date | number | textarea | select`. Use `col: 2` to span both grid columns.
**Usage:**
```tsx
<QuickCreateDialog
  trigger={<Button size="sm"><Plus className="h-3.5 w-3.5" /> New Project</Button>}
  title="New Project"
  fields={[
    { name: "name", label: "Project name", type: "text", required: true, col: 2 },
    { name: "client", label: "Client", type: "text" },
    { name: "status", label: "Status", type: "select", options: ["Planning", "Active", "On Hold"] },
    { name: "notes", label: "Notes", type: "textarea", col: 2 },
  ]}
  onSubmit={(values) => createProject(values)}
/>
```
**Do:** Replace any sheet-based create flow with this. **Don't:** introduce a third create pattern.

### `CreateDocumentSheet` — `src/components/app-shell/create-document-sheet.tsx`
**Purpose:** Legacy module-picker (chooses a document type, then opens the right form). Retained because it is type-selecting, not field-collecting. Once a type is chosen, hand off to `QuickCreateDialog`.

---

## Admin / Settings

Settings pages live in `src/routes/admin.settings.tsx` and use shadcn `Tabs`, `Card`, `Switch`, `Input`, and `Button` directly. There is no per-setting reusable component — the page is the composition.

---

## Component Do / Don't Summary

| Do | Don't |
|---|---|
| Use `QuickCreateDialog` for every create/add/invite. | Build a new dialog for each create flow. |
| Use `StatusBadge` for any status. | Hardcode colored pills inline. |
| Use `DocumentsTable` for any document list. | Fork the table per module. |
| Use `AppStates` for empty/error/loading. | Build one-off empty illustrations. |
| Use tokens (`text-muted-foreground`, `bg-card`). | Use `text-gray-500`, `#hex`, or inline styles for colors. |
| Use Lucide icons. | Mix icon libraries. |
