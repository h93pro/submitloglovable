import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  scheduleActivities, scheduleCurve, scheduleMilestones, scheduleRange,
  scheduleImports, floatDistribution, resourceHistogram, delayReasons,
} from "@/lib/mock-data";
import type { ScheduleActivity } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ActivityTable } from "@/components/schedule/activity-table";
import { GanttChart } from "@/components/schedule/gantt-chart";
import {
  BarChart3, Calendar, Upload, Download, Search, ZoomIn, ZoomOut, Maximize2, Filter,
  AlertTriangle, TrendingUp, TrendingDown, Layers, GitBranch, Activity, FileText,
  ChevronLeft, ChevronRight, Diamond, CheckCircle2, Clock, Flag, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { QuickCreateDialog } from "@/components/quick-create-dialog";
import { toast } from "sonner";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Line,
  BarChart, Bar, Cell, PieChart, Pie, ComposedChart,
} from "recharts";

export const Route = createFileRoute("/schedule")({
  head: () => ({ meta: [{ title: "Schedule — SubmitLog" }] }),
  component: SchedulePage,
});

type Zoom = "day" | "week" | "month" | "quarter";

function SchedulePage() {
  const [tab, setTab] = React.useState("baseline");
  const [zoom, setZoom] = React.useState<Zoom>("month");
  const [search, setSearch] = React.useState("");
  const [showBaseline, setShowBaseline] = React.useState(true);
  const [showCritical, setShowCritical] = React.useState(true);
  const [collapsed, setCollapsed] = React.useState<Set<string>>(new Set());
  const [selected, setSelected] = React.useState<string | null>("A2020");
  const [splitL, setSplitL] = React.useState(48); // percent
  const [tablePanel, setTablePanel] = React.useState(true);

  const visibleIds = React.useMemo(() => {
    const list: string[] = [];
    const q = search.trim().toLowerCase();
    const isHiddenByParent = (a: ScheduleActivity) => {
      let p = a.parent;
      while (p) {
        if (collapsed.has(p)) return true;
        const parent = scheduleActivities.find((x) => x.id === p);
        p = parent?.parent;
      }
      return false;
    };
    for (const a of scheduleActivities) {
      if (isHiddenByParent(a)) continue;
      if (q && !(a.name.toLowerCase().includes(q) || a.activityId.toLowerCase().includes(q) || a.wbs.includes(q))) continue;
      list.push(a.id);
    }
    return list;
  }, [search, collapsed]);

  const sel = selected ? scheduleActivities.find((a) => a.id === selected) : null;

  function toggleGroup(id: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const totalActs = scheduleActivities.filter(a => !a.isGroup).length;
  const critical = scheduleActivities.filter(a => a.isCritical && !a.isGroup).length;
  const delayed = scheduleActivities.filter(a => a.status === "delayed").length;
  const inProg = scheduleActivities.filter(a => a.status === "in-progress").length;
  const avgFloat = (scheduleActivities.filter(a => !a.isGroup).reduce((s, a) => s + a.float, 0) / totalActs).toFixed(1);
  const planned = 64.0;
  const actual = 58.2;
  const variance = (actual - planned).toFixed(1);

  return (
    <div className="flex h-[calc(100vh-3.25rem)] flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/60 backdrop-blur">
        <div className="flex flex-wrap items-center gap-3 px-4 py-3 lg:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
              <BarChart3 className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[17px] font-semibold tracking-tight">Project schedule</h1>
                <Badge variant="outline" className="h-5 gap-1 border-emerald-500/30 bg-emerald-500/10 text-[10px] font-semibold text-emerald-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  LIVE · v14
                </Badge>
              </div>
              <p className="text-[12px] text-muted-foreground">
                Riverside Commercial Tower · {scheduleRange.start} → {scheduleRange.end} · {totalActs} activities
              </p>
            </div>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" className="h-8 gap-1.5"><Upload className="h-3.5 w-3.5" /> Import XER</Button>
            <Button size="sm" variant="outline" className="h-8 gap-1.5"><Download className="h-3.5 w-3.5" /> Export</Button>
            <Button size="sm" className="h-8 gap-1.5"><Sparkles className="h-3.5 w-3.5" /> AI insights</Button>
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 gap-px overflow-hidden border-t border-border bg-border md:grid-cols-4 xl:grid-cols-8">
          <Kpi label="Planned %" value={`${planned.toFixed(1)}%`} />
          <Kpi label="Actual %" value={`${actual.toFixed(1)}%`} tone="info" />
          <Kpi label="Variance" value={`${variance}%`} tone="warn" delta={{ down: true, v: "-5.8%" }} />
          <Kpi label="SPI" value="0.91" tone="warn" />
          <Kpi label="CPI" value="0.97" />
          <Kpi label="Critical activities" value={critical.toString()} tone="danger" />
          <Kpi label="Delayed" value={delayed.toString()} tone="warn" />
          <Kpi label="Avg float" value={`${avgFloat}d`} />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab} className="flex flex-1 flex-col overflow-hidden">
        <div className="border-b border-border bg-card/40 px-2 lg:px-4">
          <ScrollArea className="w-full">
            <TabsList className="h-10 gap-1 bg-transparent p-0">
              {[
                ["baseline", "Baseline", Layers],
                ["updates", "Updates", Activity],
                ["comparison", "Comparison", GitBranch],
                ["analytics", "Analytics", BarChart3],
                ["resources", "Resources", Calendar],
                ["constraints", "Constraints", Flag],
                ["delays", "Delays", AlertTriangle],
                ["reports", "Reports", FileText],
              ].map(([v, label, Icon]: any) => (
                <TabsTrigger key={v} value={v}
                  className="h-9 gap-1.5 rounded-md px-3 text-[12.5px] data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none">
                  <Icon className="h-3.5 w-3.5" /> {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>
        </div>

        {/* BASELINE / UPDATES — Gantt workspace */}
        <TabsContent value="baseline" className="m-0 flex flex-1 overflow-hidden">
          <GanttWorkspace
            {...{ visibleIds, collapsed, toggleGroup, selected, setSelected, zoom, setZoom,
                  showBaseline, setShowBaseline, showCritical, setShowCritical,
                  search, setSearch, splitL, setSplitL, sel, tablePanel, setTablePanel }}
          />
        </TabsContent>
        <TabsContent value="updates" className="m-0 flex flex-1 overflow-hidden">
          <GanttWorkspace
            {...{ visibleIds, collapsed, toggleGroup, selected, setSelected, zoom, setZoom,
                  showBaseline, setShowBaseline, showCritical, setShowCritical,
                  search, setSearch, splitL, setSplitL, sel, tablePanel, setTablePanel }}
          />
        </TabsContent>

        <TabsContent value="comparison" className="m-0 flex-1 overflow-auto">
          <ComparisonView />
        </TabsContent>
        <TabsContent value="analytics" className="m-0 flex-1 overflow-auto">
          <AnalyticsView />
        </TabsContent>
        <TabsContent value="resources" className="m-0 flex-1 overflow-auto">
          <ResourcesView />
        </TabsContent>
        <TabsContent value="constraints" className="m-0 flex-1 overflow-auto">
          <ConstraintsView />
        </TabsContent>
        <TabsContent value="delays" className="m-0 flex-1 overflow-auto">
          <DelaysView />
        </TabsContent>
        <TabsContent value="reports" className="m-0 flex-1 overflow-auto">
          <ReportsView />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ============================================================
   Gantt Workspace
   ============================================================ */

function GanttWorkspace(props: any) {
  const { visibleIds, collapsed, toggleGroup, selected, setSelected, zoom, setZoom,
    showBaseline, setShowBaseline, showCritical, setShowCritical, search, setSearch,
    splitL, setSplitL, sel, tablePanel, setTablePanel } = props;

  const zooms: Zoom[] = ["day", "week", "month", "quarter"];

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-card/50 px-3 py-2">
        <div className="relative w-[260px] max-w-full">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search activity, ID or WBS…"
            className="h-8 pl-8 text-[12.5px]" />
        </div>
        <Button size="sm" variant="outline" className="h-8 gap-1.5"><Filter className="h-3.5 w-3.5" /> Filters</Button>

        <div className="mx-2 h-5 w-px bg-border" />

        <ToggleChip active={showCritical} onClick={() => setShowCritical(!showCritical)} color="red">Critical path</ToggleChip>
        <ToggleChip active={showBaseline} onClick={() => setShowBaseline(!showBaseline)} color="amber">Baseline</ToggleChip>

        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-0.5 rounded-md border border-border bg-card p-0.5">
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0"
              onClick={() => setZoom(zooms[Math.max(0, zooms.indexOf(zoom) - 1)])}>
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
            {zooms.map((z) => (
              <button key={z} onClick={() => setZoom(z)}
                className={cn("rounded px-2 py-1 text-[10.5px] font-semibold uppercase tracking-wider transition",
                  zoom === z ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
                {z[0]}
              </button>
            ))}
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0"
              onClick={() => setZoom(zooms[Math.min(zooms.length - 1, zooms.indexOf(zoom) + 1)])}>
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
          </div>
          <Button size="sm" variant="outline" className="h-8 w-8 p-0"
            onClick={() => setTablePanel(!tablePanel)} title="Toggle activity panel">
            {tablePanel ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          </Button>
          <Button size="sm" variant="outline" className="h-8 w-8 p-0"><Maximize2 className="h-3.5 w-3.5" /></Button>
        </div>
      </div>

      {/* Split workspace */}
      <div className="flex flex-1 overflow-hidden">
        {tablePanel && (
          <div style={{ width: `${splitL}%` }} className="hidden border-r border-border bg-card md:block">
            <ActivityTable
              activities={scheduleActivities}
              visibleIds={visibleIds}
              collapsedGroups={collapsed}
              onToggleGroup={toggleGroup}
              highlightId={selected}
              onSelect={setSelected}
              showBaseline={showBaseline}
            />
          </div>
        )}
        <div className="flex-1 overflow-hidden">
          <GanttChart
            activities={scheduleActivities}
            visibleIds={visibleIds}
            zoom={zoom}
            rangeStart={scheduleRange.start}
            rangeEnd={scheduleRange.end}
            showBaseline={showBaseline}
            showCritical={showCritical}
            highlightId={selected}
            onSelect={setSelected}
          />
        </div>
        {/* Mobile: stacked activity cards if table hidden on small */}
        <div className="block flex-1 overflow-auto border-t border-border bg-card md:hidden">
          <ActivityTable
            activities={scheduleActivities}
            visibleIds={visibleIds}
            collapsedGroups={collapsed}
            onToggleGroup={toggleGroup}
            highlightId={selected}
            onSelect={setSelected}
            showBaseline={showBaseline}
          />
        </div>
      </div>

      {/* Footer detail */}
      {sel && <ActivityDetail a={sel} />}

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border bg-card/50 px-3 py-2 text-[11px] text-muted-foreground">
        <LegendDot color="#6366f1" label="In progress" />
        <LegendDot color="#10b981" label="Complete" />
        <LegendDot color="#ef4444" label="Critical" />
        <LegendDot color="#f59e0b" label="Delayed" />
        <span className="inline-flex items-center gap-1.5"><span className="h-0.5 w-4 bg-muted-foreground/45" /> Baseline</span>
        <span className="inline-flex items-center gap-1.5"><Diamond className="h-3 w-3 rotate-45 text-primary" /> Milestone</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-3 w-0.5 bg-red-500" /> Today</span>
      </div>
    </div>
  );
}

function ToggleChip({ active, onClick, color, children }: { active: boolean; onClick: () => void; color: "red" | "amber"; children: React.ReactNode }) {
  const colorCls = color === "red"
    ? "border-red-500/40 bg-red-500/10 text-red-500"
    : "border-amber-500/40 bg-amber-500/10 text-amber-500";
  return (
    <button onClick={onClick}
      className={cn("inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-[11.5px] font-medium transition",
        active ? colorCls : "border-border bg-card text-muted-foreground hover:text-foreground")}>
      <span className={cn("h-1.5 w-1.5 rounded-full", color === "red" ? "bg-red-500" : "bg-amber-500")} />
      {children}
    </button>
  );
}
function LegendDot({ color, label }: { color: string; label: string }) {
  return <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-3 rounded-sm" style={{ background: color }} /> {label}</span>;
}

function Kpi({ label, value, tone, delta }: { label: string; value: string; tone?: "info" | "warn" | "danger"; delta?: { down: boolean; v: string } }) {
  const cls = tone === "danger" ? "text-red-500" : tone === "warn" ? "text-amber-500" : tone === "info" ? "text-blue-500" : "text-foreground";
  return (
    <div className="bg-card px-3 py-2.5">
      <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 flex items-baseline gap-1.5">
        <div className={cn("text-[16px] font-semibold tabular-nums tracking-tight", cls)}>{value}</div>
        {delta && (
          <span className={cn("inline-flex items-center gap-0.5 text-[10px] font-medium", delta.down ? "text-red-500" : "text-emerald-500")}>
            {delta.down ? <TrendingDown className="h-2.5 w-2.5" /> : <TrendingUp className="h-2.5 w-2.5" />}
            {delta.v}
          </span>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   Detail panel
   ============================================================ */
function ActivityDetail({ a }: { a: ScheduleActivity }) {
  return (
    <div className="border-t border-border bg-muted/20 px-4 py-3">
      <div className="flex flex-wrap items-start gap-x-6 gap-y-2 text-[12px]">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Activity</div>
          <div className="font-semibold">{a.activityId} · {a.name}</div>
        </div>
        <Field label="WBS" value={a.wbs} />
        <Field label="Start" value={a.start} />
        <Field label="Finish" value={a.finish} />
        <Field label="Duration" value={`${a.duration}d`} />
        <Field label="Float" value={`${a.float}d`} tone={a.float === 0 ? "danger" : undefined} />
        <Field label="Progress" value={`${a.progress}%`} />
        <Field label="Resource" value={a.resource ?? "—"} />
        <Field label="Predecessors" value={a.predecessors.join(", ") || "—"} mono />
        <Field label="Successors" value={a.successors.join(", ") || "—"} mono />
        <Field label="Constraint" value={a.constraint} />
        {a.isCritical && (
          <span className="inline-flex items-center gap-1 rounded-md border border-red-500/40 bg-red-500/10 px-2 py-1 text-[10.5px] font-semibold uppercase tracking-wide text-red-500">
            <AlertTriangle className="h-3 w-3" /> Critical path
          </span>
        )}
      </div>
    </div>
  );
}
function Field({ label, value, mono, tone }: { label: string; value: string; mono?: boolean; tone?: "danger" }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={cn("text-[12px]", mono && "font-mono", tone === "danger" && "font-semibold text-red-500")}>{value}</div>
    </div>
  );
}

/* ============================================================
   Other tabs
   ============================================================ */

function Card({ title, action, children, className }: { title: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-xl border border-border bg-card", className)}>
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <h3 className="text-[12.5px] font-semibold">{title}</h3>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function ComparisonView() {
  return (
    <div className="mx-auto max-w-[1500px] space-y-5 p-4 lg:p-6">
      <Card title="Schedule versions">
        <div className="overflow-x-auto">
          <table className="w-full text-[12.5px]">
            <thead><tr className="border-b border-border text-left text-[10.5px] uppercase tracking-wider text-muted-foreground">
              {["Version", "File", "Type", "Date", "Activities", "Imported by", "Status", ""].map(h =>
                <th key={h} className="px-2 py-2 font-semibold">{h}</th>)}
            </tr></thead>
            <tbody>
              {scheduleImports.map((v) => (
                <tr key={v.id} className="border-b border-border/60 hover:bg-accent/40">
                  <td className="px-2 py-2 font-semibold">{v.version}</td>
                  <td className="px-2 py-2 font-mono text-[11px]">{v.file}</td>
                  <td className="px-2 py-2"><Badge variant="secondary" className="font-mono text-[10px]">{v.type}</Badge></td>
                  <td className="px-2 py-2 tabular-nums text-muted-foreground">{v.date}</td>
                  <td className="px-2 py-2 tabular-nums">{v.activities.toLocaleString()}</td>
                  <td className="px-2 py-2 text-muted-foreground">{v.by}</td>
                  <td className="px-2 py-2"><StatusPill status={v.status} /></td>
                  <td className="px-2 py-2 text-right">
                    <Button size="sm" variant="ghost" className="h-7 text-[11px]">Compare</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card title="Variance — v14 vs Baseline R2">
          <ul className="space-y-2.5">
            {scheduleActivities.filter(a => !a.isGroup && a.baselineFinish !== a.finish).slice(0, 8).map(a => {
              const diff = Math.round((new Date(a.finish).getTime() - new Date(a.baselineFinish).getTime()) / 86400000);
              return (
                <li key={a.id} className="flex items-center justify-between gap-3 text-[12px]">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="font-mono text-[10.5px] text-muted-foreground">{a.activityId}</span>
                    <span className="truncate">{a.name}</span>
                  </div>
                  <span className={cn("rounded-md px-1.5 py-0.5 text-[10.5px] font-semibold tabular-nums",
                    diff > 0 ? "bg-red-500/15 text-red-500" : "bg-emerald-500/15 text-emerald-500")}>
                    {diff > 0 ? "+" : ""}{diff}d
                  </span>
                </li>
              );
            })}
          </ul>
        </Card>
        <Card title="Import history">
          <ol className="space-y-3">
            {scheduleImports.map((v, i) => (
              <li key={v.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="grid h-7 w-7 place-items-center rounded-full bg-primary/10 text-primary">
                    <Upload className="h-3.5 w-3.5" />
                  </div>
                  {i < scheduleImports.length - 1 && <div className="mt-1 h-full w-px bg-border" />}
                </div>
                <div className="pb-3">
                  <div className="text-[12.5px] font-medium">{v.file}</div>
                  <div className="text-[11px] text-muted-foreground">{v.date} · {v.by} · {v.activities} activities</div>
                </div>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: "border-emerald-500/40 bg-emerald-500/15 text-emerald-500",
    archived: "border-border bg-muted text-muted-foreground",
    baseline: "border-blue-500/40 bg-blue-500/15 text-blue-500",
    lookahead: "border-purple-500/40 bg-purple-500/15 text-purple-500",
  };
  return <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider", map[status] ?? "")}>{status}</span>;
}

function AnalyticsView() {
  return (
    <div className="mx-auto max-w-[1500px] space-y-5 p-4 lg:p-6">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card title="Earned-value S-curve" className="lg:col-span-2">
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scheduleCurve}>
                <defs>
                  <linearGradient id="bp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} /><stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} /></linearGradient>
                  <linearGradient id="ap" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.35} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", fontSize: 12, borderRadius: 8 }} />
                <Area type="monotone" dataKey="baseline" stroke="hsl(var(--primary))" fill="url(#bp)" strokeWidth={2} name="Baseline" />
                <Area type="monotone" dataKey="actual" stroke="#10b981" fill="url(#ap)" strokeWidth={2} name="Actual" />
                <Line type="monotone" dataKey="forecast" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Forecast" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Float distribution">
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={floatDistribution}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="bucket" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {floatDistribution.map((d, i) => (
                    <Cell key={i} fill={i === 0 ? "#ef4444" : i === 1 ? "#f59e0b" : i === 2 ? "#6366f1" : i === 3 ? "#10b981" : "#94a3b8"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card title="Milestones">
          <div className="overflow-hidden rounded-lg">
            <table className="w-full text-left text-[12.5px]">
              <thead className="bg-muted/50"><tr className="border-b border-border">
                {["Milestone", "Planned", "Actual", "Variance", "Status"].map(h =>
                  <th key={h} className="px-3 py-2 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>)}
              </tr></thead>
              <tbody>
                {scheduleMilestones.map((m) => (
                  <tr key={m.id} className="border-b border-border/60 hover:bg-accent/40">
                    <td className="px-3 py-2 font-medium">{m.name}</td>
                    <td className="px-3 py-2 tabular-nums text-muted-foreground">{m.planned}</td>
                    <td className="px-3 py-2 tabular-nums text-muted-foreground">{m.actual ?? "—"}</td>
                    <td className={cn("px-3 py-2 tabular-nums", m.variance > 0 && "text-red-500")}>{m.variance > 0 ? `+${m.variance}d` : "—"}</td>
                    <td className="px-3 py-2"><MilestoneStatus s={m.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card title="Progress trend (last 12 weeks)">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={scheduleCurve.slice(-12)}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="actual" fill="#6366f1" radius={[3, 3, 0, 0]} />
                <Line type="monotone" dataKey="baseline" stroke="#10b981" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

function MilestoneStatus({ s }: { s: string }) {
  const map: Record<string, string> = {
    complete: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
    "in-progress": "bg-blue-500/15 text-blue-500 border-blue-500/30",
    upcoming: "bg-muted text-muted-foreground border-border",
  };
  return <span className={cn("rounded-full border px-1.5 py-0.5 text-[10px] font-semibold uppercase", map[s])}>{s}</span>;
}

function ResourcesView() {
  return (
    <div className="mx-auto max-w-[1500px] space-y-5 p-4 lg:p-6">
      <Card title="Resource histogram">
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={resourceHistogram}>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="labour" stackId="a" fill="#6366f1" name="Labour" />
              <Bar dataKey="plant" stackId="a" fill="#06b6d4" name="Plant" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card title="Resource allocation by activity">
        <table className="w-full text-[12.5px]">
          <thead><tr className="border-b border-border text-left text-[10.5px] uppercase tracking-wider text-muted-foreground">
            {["Activity", "Resource", "Start", "Finish", "Allocation"].map(h => <th key={h} className="px-2 py-2 font-semibold">{h}</th>)}
          </tr></thead>
          <tbody>
            {scheduleActivities.filter(a => !a.isGroup && a.resource).slice(0, 12).map(a => (
              <tr key={a.id} className="border-b border-border/60 hover:bg-accent/40">
                <td className="px-2 py-2"><span className="font-mono text-[10.5px] text-muted-foreground">{a.activityId}</span> · {a.name}</td>
                <td className="px-2 py-2"><Badge variant="outline" className="text-[10.5px]">{a.resource}</Badge></td>
                <td className="px-2 py-2 tabular-nums text-muted-foreground">{a.start}</td>
                <td className="px-2 py-2 tabular-nums text-muted-foreground">{a.finish}</td>
                <td className="px-2 py-2">
                  <div className="h-1.5 w-32 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-primary" style={{ width: `${Math.min(100, a.duration / 2)}%` }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function ConstraintsView() {
  return (
    <div className="mx-auto max-w-[1500px] space-y-5 p-4 lg:p-6">
      <Card title="Constraints & milestones">
        <table className="w-full text-[12.5px]">
          <thead><tr className="border-b border-border text-left text-[10.5px] uppercase tracking-wider text-muted-foreground">
            {["ID", "Activity", "Constraint", "Date", "Status"].map(h => <th key={h} className="px-2 py-2 font-semibold">{h}</th>)}
          </tr></thead>
          <tbody>
            {scheduleActivities.filter(a => a.constraint !== "ASAP").map(a => (
              <tr key={a.id} className="border-b border-border/60 hover:bg-accent/40">
                <td className="px-2 py-2 font-mono text-[11px]">{a.activityId}</td>
                <td className="px-2 py-2">{a.name}</td>
                <td className="px-2 py-2"><Badge variant="secondary" className="text-[10.5px]">{a.constraint}</Badge></td>
                <td className="px-2 py-2 tabular-nums text-muted-foreground">{a.finish}</td>
                <td className="px-2 py-2"><MilestoneStatus s={a.status === "complete" ? "complete" : a.progress > 0 ? "in-progress" : "upcoming"} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function DelaysView() {
  const delayedActs = scheduleActivities.filter(a => !a.isGroup && (a.status === "delayed" || a.baselineFinish < a.finish));
  return (
    <div className="mx-auto max-w-[1500px] space-y-5 p-4 lg:p-6">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card title="Delay reasons">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={delayReasons} dataKey="count" nameKey="reason" cx="50%" cy="50%"
                  innerRadius={60} outerRadius={100} paddingAngle={2}>
                  {delayReasons.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", fontSize: 12, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-[11.5px]">
            {delayReasons.map(d => (
              <div key={d.reason} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: d.color }} />
                <span className="flex-1 text-muted-foreground">{d.reason}</span>
                <span className="font-semibold tabular-nums">{d.count}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Delayed activities">
          <ul className="space-y-2.5">
            {delayedActs.slice(0, 8).map(a => {
              const diff = Math.round((new Date(a.finish).getTime() - new Date(a.baselineFinish).getTime()) / 86400000);
              return (
                <li key={a.id} className="flex items-center justify-between gap-3 rounded-md border border-border bg-card/60 p-2.5">
                  <div className="min-w-0">
                    <div className="truncate text-[12.5px] font-medium">{a.name}</div>
                    <div className="text-[10.5px] text-muted-foreground">{a.activityId} · finish {a.finish}</div>
                  </div>
                  <Badge className="bg-amber-500/15 text-amber-500 hover:bg-amber-500/20">+{diff}d</Badge>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function ReportsView() {
  const reports = [
    { name: "Look-ahead (3 weeks)", desc: "Activities scheduled within the next 21 days", icon: Calendar },
    { name: "Critical path report", desc: "Activities on the longest path", icon: AlertTriangle },
    { name: "Baseline variance", desc: "Activities vs Baseline R2 — finish variance", icon: GitBranch },
    { name: "Progress S-curve", desc: "Planned vs actual cumulative %", icon: TrendingUp },
    { name: "Milestone tracker", desc: "All key milestones with status", icon: Flag },
    { name: "Resource forecast", desc: "Weekly labour and plant projection", icon: Activity },
  ];
  return (
    <div className="mx-auto max-w-[1500px] p-4 lg:p-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((r, i) => (
          <button key={i} className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-left transition hover:border-primary/40 hover:shadow-sm">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
              <r.icon className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="text-[13.5px] font-semibold">{r.name}</div>
              <div className="mt-0.5 text-[11.5px] text-muted-foreground">{r.desc}</div>
            </div>
            <Download className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
          </button>
        ))}
      </div>
    </div>
  );
}
