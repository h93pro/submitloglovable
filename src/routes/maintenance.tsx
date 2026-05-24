import { createFileRoute } from "@tanstack/react-router";
import { MaintenanceState } from "@/components/states/app-states";

export const Route = createFileRoute("/maintenance")({
  head: () => ({
    meta: [
      { title: "Maintenance — SubmitLog" },
      { name: "description", content: "SubmitLog is undergoing scheduled maintenance." },
    ],
  }),
  component: () => <MaintenanceState />,
});
