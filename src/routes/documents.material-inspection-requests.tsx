import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/coming-soon";

export const Route = createFileRoute("/documents/material-inspection-requests")({
  head: () => ({ meta: [{ title: "Material Inspection Requests — SubmitLog" }] }),
  component: () => <ComingSoon title="Material Inspection Requests" blurb="Material delivery inspection requests." />,
});
