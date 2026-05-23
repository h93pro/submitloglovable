import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/coming-soon";

export const Route = createFileRoute("/documents/technical-submittals")({
  head: () => ({ meta: [{ title: "Technical Submittals — SubmitLog" }] }),
  component: () => <ComingSoon title="Technical Submittals" blurb="Technical submittal review and approval workflow." />,
});
