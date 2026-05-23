import { createFileRoute } from "@tanstack/react-router";
import { FileCheck2 } from "lucide-react";
import { DocumentModulePage } from "@/components/documents/document-module-page";
import { technicalSubmittals } from "@/lib/mock-data";

export const Route = createFileRoute("/documents/technical-submittals/")({
  head: () => ({ meta: [{ title: "Technical Submittals — SubmitLog" }] }),
  component: () => <DocumentModulePage title="Technical Submittals" icon={FileCheck2} data={technicalSubmittals} basePath="/documents/technical-submittals" />,
});
