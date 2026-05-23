import { createFileRoute } from "@tanstack/react-router";
import { allDocuments } from "@/lib/mock-data";
import { DocumentsTable } from "@/components/documents/documents-table";
import { Clock } from "lucide-react";

export const Route = createFileRoute("/overdue")({
  head: () => ({ meta: [{ title: "Overdue items — SubmitLog" }] }),
  component: () => {
    const overdue = allDocuments.filter((d) => d.overdue);
    return (
      <div className="mx-auto max-w-[1500px] px-6 py-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-destructive/15 text-destructive"><Clock className="h-5 w-5" /></div>
          <div>
            <h1 className="text-[20px] font-semibold tracking-tight">Overdue items</h1>
            <p className="text-[12.5px] text-muted-foreground">{overdue.length} documents past their target reply date across all modules</p>
          </div>
        </div>
        <DocumentsTable data={overdue} basePath="/documents/material-submittals" />
      </div>
    );
  },
});
