import type { LucideIcon } from "lucide-react";
import type { SubmittalDoc } from "@/lib/mock-data";
import { DocumentsTable } from "./documents-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function DocumentModulePage({
  title, blurb, icon: Icon, data, basePath, onCreate,
}: {
  title: string;
  blurb?: string;
  icon: LucideIcon;
  data: SubmittalDoc[];
  basePath: string;
  onCreate?: () => void;
}) {
  const overdue = data.filter((d) => d.overdue).length;
  return (
    <div className="mx-auto max-w-[1500px] px-6 py-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-[20px] font-semibold tracking-tight">{title}</h1>
            <p className="text-[12.5px] text-muted-foreground">
              {data.length} documents · {overdue} overdue{blurb ? ` · ${blurb}` : ""}
            </p>
          </div>
        </div>
        <Button size="sm" className="h-8 gap-1.5 text-[12.5px]" onClick={onCreate}>
          <Plus className="h-3.5 w-3.5" /> New
        </Button>
      </div>
      <DocumentsTable data={data} basePath={basePath} />
    </div>
  );
}
