# SubmitLog — Design System & UX Philosophy

This document defines the visual and interaction language of SubmitLog. It is the source of truth for every UI decision. When in doubt, defer to this file over personal taste.

---

## 1. Design Philosophy

SubmitLog is an **enterprise document-control and project-delivery platform for construction**. Its users are Project Managers, Planners, Document Controllers, Engineers, and Site Supervisors who work long sessions inside dense, data-heavy interfaces.

Core principles:

- **Enterprise-first UX** — clarity, predictability, and speed beat novelty.
- **Construction-tech workflows** — submittal lifecycles, RFI loops, NCRs, daily reports, and schedule updates drive the IA, not generic CRUD.
- **Dense but readable** — Linear-style information density with generous line-height and clear hierarchy.
- **PM/Planner ergonomics** — keyboard-driven, multi-pane, multi-selection, and bulk actions are first-class.
- **Minimal cognitive load** — one canonical pattern per task. No alternative flows for the same outcome.
- **Professional SaaS aesthetic** — calm chroma, restrained motion, consistent radii, zero "fun" filler.

---

## 2. UI Principles

1. **Consistency over novelty.** A new pattern must replace an old one, not coexist with it.
2. **Reusable patterns.** Every recurring layout (table, dialog, detail page) has a single canonical implementation.
3. **Token-based styling only.** No raw colors, no arbitrary hex, no inline values that bypass the token system.
4. **Accessible interactions.** Focus rings, ARIA roles, keyboard navigation, and screen-reader labels are mandatory, not optional.
5. **Responsive-first.** Layouts are designed at 375 px first, then progressively enhanced to 1920 px.
6. **Dark mode parity.** Every screen ships in both light and dark with identical information density and contrast quality.

---

## 3. Layout Rules

### Sidebar
- Fixed 244 px expanded, 60 px collapsed.
- Hidden on `<md`; replaced by a left-side `Sheet` triggered from the topbar.
- Sections: **Main**, **Submittals**, **Admin**. Section headers are 10 px uppercase.
- Active item: filled `sidebar-accent` background + 1.5 px primary dot on the right.

### Topbar
- Sticky, 56 px tall, `border-b` on `border-border`.
- Holds: mobile-nav trigger, breadcrumb/search, command-palette shortcut (⌘K), theme toggle, "New" CTA, avatar.

### Grid & spacing
- 4 px base unit. Common steps: 2, 3, 4, 5, 6, 8.
- Page padding: `px-6 py-6` desktop, `px-4 py-4` mobile.
- Section gap: `gap-4` inside cards, `gap-6` between sections.

### Container widths
- Page content: `max-w-[1500px] mx-auto`.
- Detail pages with a side panel: `max-w-[1400px]`.
- Settings/forms: `max-w-[960px]`.

### Breakpoints
- `sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280 · `2xl` 1536.
- Tables collapse non-essential columns at `<lg`. Modals become full-height bottom sheets at `<sm` only when a form has >6 fields.

### Mobile interaction philosophy
- One primary action per screen, anchored bottom-right or in the topbar.
- Tap targets ≥ 40 px.
- Long lists use sticky group headers and infinite scroll, never numbered pagination.

---

## 4. Component Philosophy

| Component | Rules |
|---|---|
| **Tables** | Sticky header, zebra off, row-hover via `.row-hover`, right-aligned numerics, single-click row navigation, checkbox column for bulk select. |
| **Dialogs** | Centered modal, `max-w-[600px]` default, header/body/footer regions divided by `border-b`/`border-t`. Used for all create/edit/invite actions. |
| **Forms** | 2-column grid on `sm+`, single-column on mobile. Labels 12 px, inputs 13 px. Inline validation under each field. |
| **Cards** | `bg-card border border-border rounded-lg`. No drop shadows; rely on borders + subtle background contrast. |
| **Tabs** | Underline style for in-page navigation, pill style for filter switching. Never both on the same screen. |
| **Status badges** | Single shared `StatusBadge` component. Colors map to semantic tokens (`success`, `warning`, `destructive`, `info`, `muted`). |
| **Empty states** | Icon + 1-line title + 1-line description + optional primary action. Centered, `py-12`. |
| **Loading states** | Skeleton rows with `.skeleton-shimmer`. Never a centered spinner on a full page. |
| **Gantt** | Horizontal scroll with smooth-scroll, dashed grid lines via `.gantt-grid-line`, today marker as a 1 px primary line. |

---

## 5. Visual Language

### Typography
- Font: **Inter** (`--font-sans`).
- Scale: `11 / 12 / 12.5 / 13 / 14 / 16 / 18 / 20 / 24`. Page titles are 20 px semibold; section titles 14 px semibold.
- Line-height: `1.4` for body, `1.2` for headings.

### Color tokens
All colors live in `src/styles.css` as `oklch()`. Components consume them via Tailwind classes (`bg-primary`, `text-muted-foreground`, etc.). The accent is a calm indigo (`oklch(0.55 0.19 275)` light, `oklch(0.66 0.18 275)` dark).

### Shadows
- Shadows are **discouraged**. Use `border` + token-driven background contrast.
- Allowed: focus ring (`.focus-ring`), popover/dropdown elevation (default shadcn).

### Radius
- Base: `0.625rem`. Tokens: `--radius-sm/md/lg/xl/2xl`. Buttons/inputs `md`, cards `lg`, dialogs `xl`.

### Icons
- **Lucide only.** Sizes: `h-3.5 w-3.5` (inline), `h-4 w-4` (buttons), `h-5 w-5` (page headers).

### Motion
- 120–200 ms ease-out for everything.
- Allowed: hover/press feedback, sidebar collapse, dialog enter/exit (shadcn defaults), skeleton shimmer.
- Forbidden: parallax, decorative scroll animation, bouncing springs.

---

## 6. UX Behavior Rules

- **Dialogs** for create / edit / invite / quick actions.
- **Pages** for browsing, dense data, and multi-step workflows.
- **Sheets** only for global navigation on mobile. Not for forms.
- **Destructive actions** require an `AlertDialog` confirm. Submit button is `variant="destructive"` with a verb label ("Delete project").
- **Form validation** is inline + on-blur for individual fields, on-submit for the whole form. Zod schemas are the source of truth.
- **Errors** show inline near the source. Network/system errors use `app-states.tsx` patterns.
- **Toasts** (`sonner`, top-right) for async confirmation only. Never for validation, never for navigation feedback.

---

## 7. Enterprise UX References

- **Linear** — density, keyboard ergonomics, command palette, status pills.
- **Notion** — calm typography, restrained iconography.
- **Procore** — submittal/RFI taxonomy, document lifecycle vocabulary.
- **Primavera Cloud** — Gantt interactions, baseline vs actual visualization.
- **Autodesk Construction Cloud** — multi-project navigation, role-aware IA.
