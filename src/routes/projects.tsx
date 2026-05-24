import { createFileRoute, Link } from "@tanstack/react-router";
import { projectDetails } from "@/lib/mock-data";
import { FolderKanban, MapPin, User, Plus, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { QuickCreateDialog } from "@/components/quick-create-dialog";

export const Route = createFileRoute("/projects")({
  head: () => ({ meta: [{ title: "Projects — SubmitLog" }] }),
  component: ProjectsPage,
});

const statusClasses: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  planning: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  closeout: "bg-sky-500/15 text-sky-400 border-sky-500/30",
};

function ProjectsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  return (
    <div className="mx-auto max-w-[1500px] px-6 py-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
            <FolderKanban className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-[20px] font-semibold tracking-tight">Projects</h1>
            <p className="text-[12.5px] text-muted-foreground">{projectDetails.length} active projects across your portfolio</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-md border border-border bg-muted/40 p-0.5">
            {(["grid", "list"] as const).map((v) => {
              const Icon = v === "grid" ? LayoutGrid : List;
              return (
                <button key={v} onClick={() => setView(v)} className={cn("grid h-7 w-8 place-items-center rounded text-muted-foreground", view === v && "bg-background text-foreground shadow-sm")}>
                  <Icon className="h-3.5 w-3.5" />
                </button>
              );
            })}
          </div>
          <QuickCreateDialog
            title="New project"
            description="Add a new project to your portfolio. You can fine-tune details later."
            submitLabel="Create project"
            trigger={<Button size="sm" className="h-8 gap-1.5 text-[12.5px]"><Plus className="h-3.5 w-3.5" /> New project</Button>}
            fields={[
              { name: "name", label: "Project name", type: "text", placeholder: "Riverside Commercial Tower", required: true, col: 2 },
              { name: "code", label: "Project code", type: "text", placeholder: "RCT-21", required: true },
              { name: "status", label: "Status", type: "select", options: ["planning", "active", "closeout"] },
              { name: "location", label: "Location", type: "text", placeholder: "City, Country", col: 2 },
              { name: "pm", label: "Project manager", type: "text", placeholder: "Full name", col: 2 },
              { name: "description", label: "Description", type: "textarea", placeholder: "Brief project scope…", col: 2 },
            ]}
          />
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projectDetails.map((p) => (
            <Link key={p.id} to="/projects/$id" params={{ id: p.id }} className="group rounded-xl border border-border bg-card p-4 transition hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />
                  <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10.5px] text-muted-foreground">{p.code}</span>
                </div>
                <span className={cn("rounded-full border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider", statusClasses[p.status])}>{p.status}</span>
              </div>
              <h3 className="mt-2 text-[14px] font-semibold leading-tight group-hover:text-primary">{p.name}</h3>
              <p className="mt-1 text-[11.5px] text-muted-foreground">{p.client}</p>

              <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {p.location}</span>
                <span className="flex items-center gap-1"><User className="h-3 w-3" /> {p.pm}</span>
              </div>

              <div className="mt-4">
                <div className="mb-1 flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold tabular-nums">{p.progress}%</span>
                </div>
                <Progress value={p.progress} className="h-1.5" />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center">
                <Stat label="Submittals" value={p.openSubmittals} />
                <Stat label="RFIs" value={p.openRfis} />
                <Stat label="Overdue" value={p.overdue} accent={p.overdue > 0} />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-muted/50">
              <tr className="border-b border-border">
                {["Code", "Project", "Client", "PM", "Value", "Progress", "Status"].map((h) => (
                  <th key={h} className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projectDetails.map((p) => (
                <tr key={p.id} className="border-b border-border/60 hover:bg-accent/40">
                  <td className="px-3 py-2 font-mono text-[12px]">{p.code}</td>
                  <td className="px-3 py-2"><Link to="/projects/$id" params={{ id: p.id }} className="font-medium hover:text-primary">{p.name}</Link></td>
                  <td className="px-3 py-2 text-muted-foreground">{p.client}</td>
                  <td className="px-3 py-2">{p.pm}</td>
                  <td className="px-3 py-2 tabular-nums">{p.value}</td>
                  <td className="px-3 py-2"><div className="flex items-center gap-2"><Progress value={p.progress} className="h-1.5 w-24" /><span className="tabular-nums text-[11.5px]">{p.progress}%</span></div></td>
                  <td className="px-3 py-2"><span className={cn("rounded-full border px-1.5 py-0.5 text-[10px] font-semibold uppercase", statusClasses[p.status])}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div>
      <div className={cn("text-[14px] font-semibold tabular-nums", accent && "text-destructive")}>{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
