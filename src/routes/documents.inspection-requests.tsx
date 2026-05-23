import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/coming-soon";

export const Route = createFileRoute("/documents/inspection-requests")({
  head: () => ({ meta: [{ title: "Inspection Requests — SubmitLog" }] }),
  component: () => <ComingSoon title="Inspection Requests" blurb="On-site inspection request workflow." />,
});
