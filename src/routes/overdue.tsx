import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/coming-soon";

export const Route = createFileRoute("/overdue")({
  head: () => ({ meta: [{ title: "Overdue items — SubmitLog" }] }),
  component: () => <ComingSoon title="Overdue items" blurb="All overdue documents across modules." />,
});
