import { createFileRoute } from "@tanstack/react-router";
import { ClipboardCheck } from "lucide-react";
import { DocumentModulePage } from "@/components/documents/document-module-page";
import { inspectionRequests } from "@/lib/mock-data";

export const Route = createFileRoute("/documents/inspection-requests/")({
  head: () => ({ meta: [{ title: "Inspection Requests — SubmitLog" }] }),
  component: () => <DocumentModulePage title="Inspection Requests" icon={ClipboardCheck} data={inspectionRequests} basePath="/documents/inspection-requests" />,
});
