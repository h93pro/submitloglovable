import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/coming-soon";

export const Route = createFileRoute("/admin/whatsapp-bot")({
  head: () => ({ meta: [{ title: "WhatsApp Bot — SubmitLog" }] }),
  component: () => <ComingSoon title="WhatsApp Bot" blurb="Realtime gateway status, QR pairing, registered users." />,
});
