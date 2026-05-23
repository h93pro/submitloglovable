import { createFileRoute, Link } from "@tanstack/react-router";
import { tenders } from "@/lib/mock-data";
import { FileSpreadsheet, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";

export const Route = createFileRoute("/tenders")({
  head: () => ({ meta: [{ title: "Tenders — SubmitLog" }] }),
  component: TendersPage,
});

const statusStyles: Record<string, string> = {
  OPEN: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  EVALUATION: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  AWARDED: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  CANCELLED: "bg-muted text-muted-foreground border-border",
};

function TendersPage() {
  const [q, setQ] = useState("");
  const filtered = tenders.filter((t) => !q || t.title.toLowerCase().includes(q.toLowerCase()) || t.code.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="mx-auto max-w-[1500px] px-6 py-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary"><FileSpreadsheet className="h-5 w-5" /></div>
          <div>
            <h1 className="text-[20px] font-semibold tracking-tight">Tenders</h1>
            <p className="text-[12.5px] text-muted-foreground">{tenders.length} tenders · {tenders.filter((t) => t.status === "OPEN").length} accepting submissions</p>
          </div>
        </div>
        <Button size="sm" className="h-8 gap-1.5 text-[12.5px]"><Plus className="h-3.5 w-3.5" /> New tender</Button>
      </div>

      <div className="mb-3 flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search tenders…" value={q} onChange={(e) => setQ(e.target.value)} className="h-8 w-72 pl-7 text-[12.5px]" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((t) => (
          <Link key={t.id} to="/tenders/$id" params={{ id: t.id }} className="group rounded-xl border border-border bg-card p-4 transition hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
            <div className="flex items-start justify-between">
              <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10.5px] text-muted-foreground">{t.code}</span>
              <span className={cn("rounded-full border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider", statusStyles[t.status])}>{t.status}</span>
            </div>
            <h3 className="mt-2 text-[14px] font-semibold leading-tight group-hover:text-primary">{t.title}</h3>
            <p className="mt-1 text-[11.5px] text-muted-foreground">{t.client} · {t.discipline}</p>
            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center">
              <Mini label="Value" value={t.value} />
              <Mini label="Submissions" value={t.submissions.toString()} />
              <Mini label="Deadline" value={t.submitDeadline} />
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full grid min-h-[300px] place-items-center rounded-xl border border-dashed border-border text-[13px] text-muted-foreground">
            No tenders match your search.
          </div>
        )}
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[12px] font-semibold tabular-nums">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
