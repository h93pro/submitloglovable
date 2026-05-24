import { createFileRoute } from "@tanstack/react-router";
import { UnauthorizedState } from "@/components/states/app-states";

export const Route = createFileRoute("/unauthorized")({
  head: () => ({
    meta: [
      { title: "Unauthorized — SubmitLog" },
      { name: "description", content: "You don't have permission to access this area." },
    ],
  }),
  component: () => <UnauthorizedState />,
});
