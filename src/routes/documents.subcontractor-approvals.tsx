import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/coming-soon";

export const Route = createFileRoute("/documents/subcontractor-approvals")({
  head: () => ({ meta: [{ title: "Subcontractor Approvals — SubmitLog" }] }),
  component: () => <ComingSoon title="Subcontractor Approvals" blurb="Subcontractor onboarding and approval workflow." />,
});
