import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/coming-soon";

export const Route = createFileRoute("/tenders")({
  head: () => ({ meta: [{ title: "Tenders — SubmitLog" }] }),
  component: () => <ComingSoon title="Tenders" blurb="Tender management with documents, addendums and inquiries." />,
});
