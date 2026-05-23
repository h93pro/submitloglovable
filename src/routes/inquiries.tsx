import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/coming-soon";

export const Route = createFileRoute("/inquiries")({
  head: () => ({ meta: [{ title: "Inquiries — SubmitLog" }] }),
  component: () => <ComingSoon title="Inquiries" blurb="Cross-project inquiry tracking." />,
});
