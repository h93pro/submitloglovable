import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/coming-soon";

export const Route = createFileRoute("/documents/ncrs")({
  head: () => ({ meta: [{ title: "Non-Conformance Reports — SubmitLog" }] }),
  component: () => <ComingSoon title="Non-Conformance Reports" blurb="NCR creation, routing and closure." />,
});
