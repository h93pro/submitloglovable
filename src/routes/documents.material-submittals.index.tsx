import { createFileRoute } from "@tanstack/react-router";
import { DocumentsTable } from "@/components/documents/documents-table";
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
    <div className="mx-auto max-w-[1500px] px-6 py-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-[20px] font-semibold tracking-tight">Material Submittals</h1>
            <p className="text-[12.5px] text-muted-foreground">
              {materialSubmittals.length} documents · {materialSubmittals.filter((d) => d.overdue).length} overdue
            </p>
          </div>
        </div>
      </div>

      <DocumentsTable data={materialSubmittals} basePath="/documents/material-submittals" />
    </div>
  );
}
