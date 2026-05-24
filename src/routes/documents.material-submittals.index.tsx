import { createFileRoute } from "@tanstack/react-router";
import { DocumentModulePage } from "@/components/documents/document-module-page";
import { materialSubmittals } from "@/lib/mock-data";
import { Package } from "lucide-react";

export const Route = createFileRoute("/documents/material-submittals/")({
  head: () => ({
    meta: [
      { title: "Material Submittals — SubmitLog" },
      { name: "description", content: "Review and manage material submittals across projects." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <DocumentModulePage
      title="Material Submittals"
      icon={Package}
      data={materialSubmittals}
      basePath="/documents/material-submittals"
    />
  );
}
