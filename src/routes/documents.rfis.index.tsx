import { createFileRoute } from "@tanstack/react-router";
import { HelpCircle } from "lucide-react";
import { DocumentModulePage } from "@/components/documents/document-module-page";
import { rfis } from "@/lib/mock-data";

export const Route = createFileRoute("/documents/rfis/")({
  head: () => ({ meta: [{ title: "RFIs — SubmitLog" }] }),
  component: () => <DocumentModulePage title="Requests for Information" icon={HelpCircle} data={rfis} basePath="/documents/rfis" />,
});
