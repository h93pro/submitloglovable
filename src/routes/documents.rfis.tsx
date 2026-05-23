import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/coming-soon";

export const Route = createFileRoute("/documents/rfis")({
  head: () => ({ meta: [{ title: "Requests For Information — SubmitLog" }] }),
  component: () => <ComingSoon title="Requests For Information" blurb="RFI workflow with response tracking." />,
});
