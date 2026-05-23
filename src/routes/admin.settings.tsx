import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/coming-soon";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — SubmitLog" }] }),
  component: () => <ComingSoon title="Settings" blurb="Company info, AI provider, password rules." />,
});
