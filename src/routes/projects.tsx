import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/coming-soon";

export const Route = createFileRoute("/projects")({
  head: () => ({ meta: [{ title: "Projects — SubmitLog" }] }),
  component: () => <ComingSoon title="Projects" blurb="Grid and list views of all active projects." />,
});
