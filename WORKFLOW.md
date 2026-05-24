# SubmitLog — Business Workflows

Domain workflows the platform models. Use this as the source of truth when wiring backend logic, validations, and state transitions.

---

## 1. Material Submittal Lifecycle

```
Draft → Submitted → Under Review → (Approved | Approved w/ Comments | Rejected | Resubmit)
                                        │
                                        └── if Resubmit → new revision → Submitted
```

- Each submission creates a `document_revisions` row (`Rev 00`, `Rev 01`, …).
- Approvals are recorded per-revision in `document_approvals`.
- Final state = the latest revision's decision. The document's `status` mirrors the latest revision.

## 2. Approval Workflow (shared by all submittal types)

1. Submitter uploads attachments → revision created.
2. Watchers + assigned approver(s) notified.
3. Approver decides: `approved | approved_with_comments | rejected | resubmit`.
4. On `resubmit`, the document re-enters `Draft` with a new revision slot.
5. On `approved` / `approved_with_comments`, downstream consumers (procurement, site) are notified.
6. Every transition writes to `activity_log`.

## 3. Revision Workflow

- Revisions are immutable once submitted.
- New attachments require a new revision.
- Revision diff metadata (`summary`) is required on submit.
- UI: revision history is a vertical timeline on the document detail page.

## 4. Schedule Update Workflow

1. Planner opens Schedule → selects activities to update.
2. Enters `percent_complete`, `actual_start`, `actual_finish` per activity.
3. Submits as a `schedule_updates` row; activity rows updated atomically in a transaction.
4. Baseline (`baseline_start`, `baseline_end`) is never overwritten — variance is computed.
5. Audit entry per activity change.

## 5. Tender Workflow

```
Identified → Bidding → Submitted → (Won | Lost | Withdrawn)
```

- `tender_items` capture BoQ-style line items.
- Submission deadline drives reminders (T-7, T-3, T-1 days).
- Won tenders can spawn a `projects` row via "Convert to Project".

## 6. Inquiry Workflow

```
Open → In Progress → Answered → Closed
```

- Inquiries are lighter than RFIs — internal questions, no formal approval.
- Auto-close 14 days after `Answered` if no reopens.

## 7. Daily Report Workflow

1. Site engineer drafts report (weather, manpower, narrative, photos).
2. Submits before EOD; lock at 23:59 project-local time.
3. Late submissions allowed with a "Late" flag and reason.
4. PM reviews and `Acknowledges`. No formal approval.
5. AI summarization (planned) generates a weekly digest from 7 daily reports.

## 8. Notification Flow

Triggers:
- Document submitted, revised, approved, rejected, overdue.
- Approval assignment changed.
- Daily report submitted / missing.
- Schedule update posted.
- Tender deadline T-7 / T-3 / T-1.
- @mention in comments (future).

Delivery:
- In-app: `notifications` table + realtime subscription, badge in topbar.
- WhatsApp: opt-in per user; routed via WhatsApp Bot webhook.
- Email: digest mode (daily) for non-critical; immediate for overdue/rejected.

## 9. Audit Logging Philosophy

- **Every** mutation writes to `activity_log` — actor, entity, action, before/after metadata in `jsonb`.
- Append-only. No updates, no deletes.
- Surfaced on entity detail pages as "Activity" tab.
- Used for compliance exports (CSV/PDF) per project.
