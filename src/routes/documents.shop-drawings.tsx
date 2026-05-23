import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/coming-soon";

export const Route = createFileRoute("/documents/shop-drawings")({
  head: () => ({ meta: [{ title: "Shop Drawings — SubmitLog" }] }),
  component: () => <ComingSoon title="Shop Drawings" blurb="Shop drawing submittals with revision tracking." />,
});
