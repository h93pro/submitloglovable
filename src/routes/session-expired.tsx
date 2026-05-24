import { createFileRoute } from "@tanstack/react-router";
import { SessionExpiredState } from "@/components/states/app-states";

export const Route = createFileRoute("/session-expired")({
  head: () => ({
    meta: [
      { title: "Session expired — SubmitLog" },
      { name: "description", content: "Your session has expired. Sign in again to continue." },
    ],
  }),
  component: () => <SessionExpiredState onSignIn={() => window.location.assign("/")} />,
});
