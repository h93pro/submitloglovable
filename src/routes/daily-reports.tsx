import { createFileRoute } from "@tanstack/react-router";
import { dailyReports } from "@/lib/mock-data";
import { NotebookPen, Plus, CloudSun, Users, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { QuickCreateDialog } from "@/components/quick-create-dialog";

export const Route = createFileRoute("/daily-reports")({
  head: () => ({ meta: [{ title: "Daily Reports — SubmitLog" }] }),
  component: DailyReportsPage,
});

const statusStyles: Record<string, string> = {
  draft: "bg-muted text-muted-foreground border-border",
  submitted: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  approved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
};

function DailyReportsPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 py-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary"><NotebookPen className="h-5 w-5" /></div>
          <div>
            <h1 className="text-[20px] font-semibold tracking-tight">Daily Reports</h1>
            <p className="text-[12.5px] text-muted-foreground">Site reports across all active projects</p>
          </div>
        </div>
        <QuickCreateDialog
          title="New daily report"
          description="Log site progress, manpower, weather, and equipment for the day."
          submitLabel="Create report"
          trigger={<Button size="sm" className="h-8 gap-1.5 text-[12.5px]"><Plus className="h-3.5 w-3.5" /> New report</Button>}
          fields={[
            { name: "date", label: "Date", type: "date", required: true },
            { name: "project", label: "Project", type: "select", options: ["Riverside Commercial Tower", "Harbor Heights Expansion", "Airport District Concourse", "Metro Bridge Rehabilitation"] },
            { name: "weather", label: "Weather", type: "select", options: ["Sunny", "Cloudy", "Rainy", "Windy", "Hot", "Cold"] },
            { name: "manpower", label: "Manpower on site", type: "number", placeholder: "0" },
            { name: "activities", label: "Activities performed", type: "textarea", rows: 4, placeholder: "Summary of works performed today…", col: 2 },
            { name: "issues", label: "Issues / blockers", type: "textarea", rows: 3, col: 2 },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {dailyReports.map((r) => (
          <div key={r.id} className="rounded-xl border border-border bg-card p-4 transition hover:border-primary/50">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{r.date}</div>
                <div className="mt-0.5 text-[14px] font-semibold leading-tight">{r.project}</div>
                <div className="text-[11.5px] text-muted-foreground">by {r.author}</div>
              </div>
              <span className={cn("rounded-full border px-1.5 py-0.5 text-[10px] font-semibold uppercase", statusStyles[r.status])}>{r.status}</span>
            </div>
            <p className="mt-3 line-clamp-2 text-[12.5px] text-foreground/85">{r.summary}</p>
            <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border pt-3 text-[11px]">
              <div className="flex items-center gap-1.5 text-muted-foreground"><CloudSun className="h-3 w-3" /> {r.weather}</div>
              <div className="flex items-center gap-1.5 text-muted-foreground"><Users className="h-3 w-3" /> {r.manpower}</div>
              <div className="flex items-center gap-1.5 text-muted-foreground"><Wrench className="h-3 w-3" /> {r.equipment}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
