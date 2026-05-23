import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/coming-soon";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Users — SubmitLog" }] }),
  component: () => <ComingSoon title="Users" blurb="Manage users, roles and access." />,
});
