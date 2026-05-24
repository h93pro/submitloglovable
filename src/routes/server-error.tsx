import { createFileRoute } from "@tanstack/react-router";
import { ServerErrorState } from "@/components/states/app-states";

export const Route = createFileRoute("/server-error")({
  head: () => ({
    meta: [
      { title: "Server error — SubmitLog" },
      { name: "description", content: "An unexpected server error occurred." },
    ],
  }),
  component: () => <ServerErrorState onRetry={() => window.location.reload()} />,
});
