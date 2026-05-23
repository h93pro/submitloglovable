import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/coming-soon";

export const Route = createFileRoute("/admin/projects")({
  head: () => ({ meta: [{ title: "Projects (Admin) — SubmitLog" }] }),
  component: () => <ComingSoon title="Projects (Admin)" blurb="Administer project configuration." />,
});
