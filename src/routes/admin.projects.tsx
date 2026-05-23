import { createFileRoute } from "@tanstack/react-router";
import { projectDetails } from "@/lib/mock-data";
import { Building2, Plus, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/admin/projects")({
  head: () => ({ meta: [{ title: "Admin · Projects — SubmitLog" }] }),
  component: AdminProjects,
});

function AdminProjects() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 py-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary"><Building2 className="h-5 w-5" /></div>
          <div>
            <h1 className="text-[20px] font-semibold tracking-tight">Projects administration</h1>
            <p className="text-[12.5px] text-muted-foreground">Configure projects, codes, and access policies</p>
          </div>
        </div>
        <Button size="sm" className="h-8 gap-1.5 text-[12.5px]"><Plus className="h-3.5 w-3.5" /> Create project</Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <table className="w-full text-left text-[13px]">
          <thead className="bg-muted/50">
            <tr className="border-b border-border">
              {["Code", "Project", "Client", "PM", "Value", "Progress", "Status", ""].map((h) => (
                <th key={h} className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projectDetails.map((p) => (
              <tr key={p.id} className="border-b border-border/60 hover:bg-accent/40">
                <td className="px-3 py-2 font-mono text-[12px]">{p.code}</td>
                <td className="px-3 py-2 font-medium">{p.name}</td>
                <td className="px-3 py-2 text-muted-foreground">{p.client}</td>
                <td className="px-3 py-2">{p.pm}</td>
                <td className="px-3 py-2 tabular-nums">{p.value}</td>
                <td className="px-3 py-2"><div className="flex items-center gap-2"><Progress value={p.progress} className="h-1.5 w-24" /><span className="tabular-nums text-[11.5px]">{p.progress}%</span></div></td>
                <td className="px-3 py-2"><span className="rounded-full border border-border bg-muted px-1.5 py-0.5 text-[10px] uppercase">{p.status}</span></td>
                <td className="px-3 py-2 text-right"><Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-3.5 w-3.5" /></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
