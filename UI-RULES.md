# SubmitLog — UI Engineering Contract

Strict, non-negotiable rules for any code that touches the UI. AI agents and humans both. Violations are bugs, not style preferences.

---

## Color & Tokens

1. **Never hardcode colors.** No `text-white`, `bg-black`, `text-gray-500`, `#hex`, `rgb()`, `oklch()` inline. Use semantic tokens only: `bg-background`, `text-foreground`, `bg-card`, `text-muted-foreground`, `bg-primary`, `border-border`, `bg-destructive`, `bg-success`, `bg-warning`, `bg-info`, `bg-accent`, `bg-sidebar*`.
2. **New colors must be added to `src/styles.css`** as `oklch()` tokens in both `:root` and `.dark`. No exceptions.
3. **Dark mode parity is mandatory.** Every screen must work identically in light and dark. If a component looks broken in one mode, it ships in neither.

## Components

4. **One canonical component per pattern.** Use `StatusBadge`, `DocumentsTable`, `QuickCreateDialog`, `AppStates`, `DataTableToolbar`. Do not fork or recreate them.
5. **Status pills only via `StatusBadge`.** No inline colored badges anywhere.
6. **All create/invite/add actions use `QuickCreateDialog`** (centered modal). No new side sheets, no new bespoke dialogs.
7. **Empty / loading / error / offline / unauthorized / 404 / 500 / maintenance / session-expired** screens come from `AppStates`.

## Tables

8. **Tables must implement all three states**: loading (skeleton rows), empty (centered empty state), error (inline error with retry).
9. **Sortable columns** use the shared `SortableColumn` type and table primitives. No per-page sort logic forks.
10. **Bulk selection** uses the canonical checkbox column. No alternative selection UIs.

## Dialogs & Sheets

11. **Dialogs trap focus** (shadcn default — do not disable).
12. **ESC closes**, **Enter submits** the primary form action, **Tab cycles** within the dialog. Do not override.
13. **Sheets** are reserved for global mobile navigation. Never for forms.
14. **Destructive actions** use `AlertDialog` with a verb-labeled destructive button.

## Forms

15. **Validation via Zod schemas.** Inline + on-blur per-field; on-submit for the form. Show errors under the field, not in a toast.
16. **Two-column grid on `sm+`, single-column on mobile.** Use `col: 2` on `QuickCreateDialog` fields that should span.
17. **Buttons have loading states.** Disable + show a spinner or label change during async submits.
18. **Required fields marked** in the field config, not via asterisks pasted into labels.

## Icons & Typography

19. **Lucide icons only.** Sizes `h-3.5 w-3.5`, `h-4 w-4`, `h-5 w-5`. No emoji as UI affordance.
20. **Typography scale** from `DESIGN.md`. No arbitrary font sizes.

## Layout

21. **Page wrapper:** `mx-auto max-w-[1500px] px-6 py-6` (or `max-w-[960px]` for settings/forms).
22. **Mobile-first.** Build at 375 px first, then enhance. Test at 375 / 768 / 1280 / 1920.
23. **Tap targets ≥ 40 px** on touch devices.

## Routing & State

24. **Filters, sort, pagination → URL search params.** Not local React state.
25. **Server state via TanStack Query** when backend lands. Never `useEffect + fetch` for initial render.
26. **No `src/pages/` directory.** Routes live in `src/routes/` (TanStack file-based).

## Code Hygiene

27. **No `console.log` in committed code.** Use the project error capture or remove before commit.
28. **No `any`.** Add a type; if truly unknown, use `unknown` and narrow.
29. **No duplicate utilities.** Search `lib/` and `hooks/` before adding a helper.
30. **`cn()` for all conditional classes.** Never string-concatenate class names.

## Accessibility

31. **Every interactive element is keyboard-reachable** and has a visible focus ring (`.focus-ring` or shadcn defaults).
32. **Icon-only buttons** require `aria-label` or `title`.
33. **Images and decorative icons** use `alt=""` or `aria-hidden="true"` appropriately.

## Motion

34. **120–200 ms ease-out** for all transitions. No bouncing springs, no decorative scroll animation.
35. **Respect `prefers-reduced-motion`** — never animate critical state changes.

## Toasts

36. **`sonner` top-right, async confirmation only.** Not for validation. Not for navigation feedback.

---

If a request seems to require breaking one of these rules, the rule wins — push back, propose a compliant alternative, or surface the conflict before writing code.
