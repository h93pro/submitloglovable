import { createFileRoute } from "@tanstack/react-router";
import { Boxes } from "lucide-react";
import { DocumentModulePage } from "@/components/documents/document-module-page";
import { materialInspections } from "@/lib/mock-data";

export const Route = createFileRoute("/documents/material-inspection-requests/")({
  head: () => ({ meta: [{ title: "Material Inspections — SubmitLog" }] }),
  component: () => <DocumentModulePage title="Material Inspections" icon={Boxes} data={materialInspections} basePath="/documents/material-inspection-requests" />,
});
