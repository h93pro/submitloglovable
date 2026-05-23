import { createFileRoute } from "@tanstack/react-router";
import { scheduleCurve, scheduleMilestones, projectDetails } from "@/lib/mock-data";
import { BarChart3, TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from "recharts";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/schedule")({
  head: () => ({ meta: [{ title: "Schedule Analytics — SubmitLog" }] }),
  component: SchedulePage,
});

const statusStyles: Record<string, string> = {
  complete: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  "in-progress": "bg-amber-500/15 text-amber-400 border-amber-500/30",
  upcoming: "bg-muted text-muted-foreground border-border",
};

function SchedulePage() {
  return (
    <div className="mx-auto max-w-[1500px] px-6 py-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary"><BarChart3 className="h-5 w-5" /></div>
        <div>
          <h1 className="text-[20px] font-semibold tracking-tight">Schedule analytics</h1>
          <p className="text-[12.5px] text-muted-foreground">Earned-value, milestones and forecast across all projects</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi icon={Calendar} label="On-track projects" value="2" tone="ok" />
        <Kpi icon={TrendingDown} label="Slipping" value="1" tone="warn" />
        <Kpi icon={TrendingUp} label="Avg SPI" value="0.92" tone="warn" />
        <Kpi icon={Calendar} label="Milestones (90d)" value="14" />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card title="Earned-value S-curve" className="lg:col-span-2">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scheduleCurve}>
                <defs>
                  <linearGradient id="bp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} /><stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} /></linearGradient>
                  <linearGradient id="ap" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", fontSize: 12, borderRadius: 8 }} />
                <Area type="monotone" dataKey="baseline" stroke="hsl(var(--primary))" fill="url(#bp)" strokeWidth={2} name="Baseline" />
                <Area type="monotone" dataKey="actual" stroke="#10b981" fill="url(#ap)" strokeWidth={2} name="Actual" />
                <Line type="monotone" dataKey="forecast" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Project SPI">
          <ul className="divide-y divide-border">
            {projectDetails.map((p, i) => {
              const spi = [0.97, 0.88, 1.02, 0.91][i];
              return (
                <li key={p.id} className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
                    <span className="text-[12.5px]">{p.name}</span>
                  </div>
                  <span className={cn("tabular-nums text-[12.5px] font-semibold", spi < 0.95 ? "text-amber-400" : spi >= 1 ? "text-emerald-400" : "text-foreground")}>{spi.toFixed(2)}</span>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      <Card title="Upcoming milestones" className="mt-5">
        <div className="overflow-hidden rounded-lg">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-muted/50"><tr className="border-b border-border">
              {["Milestone", "Planned", "Actual", "Variance", "Status"].map((h) => <th key={h} className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>)}
            </tr></thead>
            <tbody>
              {scheduleMilestones.map((m) => (
                <tr key={m.id} className="border-b border-border/60 hover:bg-accent/40">
                  <td className="px-3 py-2 font-medium">{m.name}</td>
                  <td className="px-3 py-2 tabular-nums text-muted-foreground">{m.planned}</td>
                  <td className="px-3 py-2 tabular-nums text-muted-foreground">{m.actual ?? "—"}</td>
                  <td className={cn("px-3 py-2 tabular-nums", m.variance > 0 && "text-destructive")}>{m.variance > 0 ? `+${m.variance}d` : "—"}</td>
                  <td className="px-3 py-2"><span className={cn("rounded-full border px-1.5 py-0.5 text-[10px] font-semibold uppercase", statusStyles[m.status])}>{m.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, tone }: { icon: typeof Calendar; label: string; value: string; tone?: "ok" | "warn" }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="flex items-center gap-2">
        <div className={cn("grid h-7 w-7 place-items-center rounded-md bg-primary/10 text-primary", tone === "warn" && "bg-amber-500/15 text-amber-400", tone === "ok" && "bg-emerald-500/15 text-emerald-400")}><Icon className="h-3.5 w-3.5" /></div>
        <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">{label}</div>
      </div>
      <div className="mt-2 text-[18px] font-semibold tabular-nums">{value}</div>
    </div>
  );
}
function Card({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return <section className={`rounded-xl border border-border bg-card ${className ?? ""}`}><div className="border-b border-border px-4 py-2.5"><h3 className="text-[12.5px] font-semibold">{title}</h3></div><div className="p-4">{children}</div></section>;
}
