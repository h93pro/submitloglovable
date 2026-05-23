import { createFileRoute } from "@tanstack/react-router";
import { AlertOctagon } from "lucide-react";
import { DocumentModulePage } from "@/components/documents/document-module-page";
import { ncrs } from "@/lib/mock-data";

export const Route = createFileRoute("/documents/ncrs/")({
  head: () => ({ meta: [{ title: "Non-Conformance Reports — SubmitLog" }] }),
  component: () => <DocumentModulePage title="Non-Conformance Reports" icon={AlertOctagon} data={ncrs} basePath="/documents/ncrs" />,
});
