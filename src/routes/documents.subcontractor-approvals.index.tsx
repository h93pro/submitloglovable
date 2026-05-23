import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { DocumentModulePage } from "@/components/documents/document-module-page";
import { subcontractorApprovals } from "@/lib/mock-data";

export const Route = createFileRoute("/documents/subcontractor-approvals/")({
  head: () => ({ meta: [{ title: "Subcontractor Approvals — SubmitLog" }] }),
  component: () => <DocumentModulePage title="Subcontractor Approvals" icon={Users} data={subcontractorApprovals} basePath="/documents/subcontractor-approvals" />,
});
