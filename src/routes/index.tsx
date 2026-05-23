import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Clock, CheckCircle2, AlertTriangle, ArrowRight, Plus, Search, Bot } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { MiniTrend } from "@/components/dashboard/mini-trend";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { Button } from "@/components/ui/button";
import { scheduleAlerts, materialSubmittals } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — SubmitLog" },
      { name: "description", content: "Overview of submittals, approvals, and project health." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const overdueCount = materialSubmittals.filter((d) => d.overdue).length;

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-6">
      {/* Page header */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            Welcome back. Here's what's happening across your projects.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-[12.5px]">
            Customize
          </Button>
          <Button size="sm" className="h-8 gap-1.5 text-[12.5px]">
            <Plus className="h-3.5 w-3.5" /> New document
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Documents" value="1,284" icon={FileText} delta={{ value: "+8.2%", positive: true }}>
          <MiniTrend dataKey="submitted" />
        </StatCard>
        <StatCard label="Pending Review" value="146" tone="info" icon={Clock} delta={{ value: "+12", positive: false }} />
        <StatCard label="Approved This Month" value="312" tone="success" icon={CheckCircle2} delta={{ value: "+24%", positive: true }}>
          <MiniTrend dataKey="approved" color="oklch(0.68 0.16 155)" />
        </StatCard>
        <StatCard label="Overdue" value={overdueCount} tone="destructive" icon={AlertTriangle} delta={{ value: "+3", positive: false }} />
      </div>

      {/* Main grid */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Schedule alerts */}
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <h3 className="text-[13px] font-semibold">Schedule alerts</h3>
                <span className="rounded bg-destructive/15 px-1.5 py-0.5 text-[10px] font-semibold text-destructive">
                  {scheduleAlerts.length}
                </span>
              </div>
              <button className="text-[11.5px] text-muted-foreground hover:text-foreground">View all</button>
            </div>
            <ul className="divide-y divide-border">
              {scheduleAlerts.map((a) => (
                <li key={a.id} className="flex items-center gap-3 px-4 py-3">
                  <span className={cn(
                    "h-2 w-2 shrink-0 rounded-full",
                    a.severity === "high" && "bg-destructive",
                    a.severity === "medium" && "bg-warning",
                    a.severity === "low" && "bg-info",
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-[13px] font-medium">{a.title}</div>
                    <div className="text-[11.5px] text-muted-foreground">{a.project}</div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[11.5px]"
                    onClick={() => toast.success("Alert acknowledged")}
                  >
                    Acknowledge
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          {/* Project health */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[13px] font-semibold">Project health</h3>
              <Link to="/projects" className="inline-flex items-center gap-1 text-[11.5px] text-muted-foreground hover:text-foreground">
                All projects <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { name: "Riverside Commercial Tower", code: "RCT-21", color: "#f59e0b", progress: 68, status: "On track" },
                { name: "Metro Bridge Rehabilitation", code: "MBR-18", color: "#10b981", progress: 42, status: "At risk" },
                { name: "Harbor Heights Expansion", code: "HHX-04", color: "#06b6d4", progress: 91, status: "On track" },
                { name: "Airport District Concourse", code: "ADC-09", color: "#a855f7", progress: 23, status: "Delayed" },
              ].map((p) => (
                <div key={p.code} className="rounded-lg border border-border bg-background p-3 transition hover:border-border/80">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-sm" style={{ background: p.color }} />
                    <span className="truncate text-[13px] font-medium">{p.name}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11.5px] text-muted-foreground">
                    <span className="font-mono">{p.code}</span>
                    <span className={cn(
                      p.status === "On track" && "text-success",
                      p.status === "At risk" && "text-warning",
                      p.status === "Delayed" && "text-destructive",
                    )}>{p.status}</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${p.progress}%`, background: p.color }}
                    />
                  </div>
                  <div className="mt-1 text-right text-[11px] tabular-nums text-muted-foreground">{p.progress}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          {/* Quick actions */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="mb-3 text-[13px] font-semibold">Quick actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "New submittal", icon: Plus, to: "/documents/material-submittals" },
                { label: "Search docs", icon: Search, to: "/documents/material-submittals" },
                { label: "WhatsApp bot", icon: Bot, to: "/admin/whatsapp-bot" },
                { label: "Overdue items", icon: AlertTriangle, to: "/overdue" },
              ].map((a) => (
                <Link
                  key={a.label}
                  to={a.to}
                  className="flex flex-col items-start gap-1.5 rounded-lg border border-border bg-background p-3 text-left transition hover:border-primary/40 hover:bg-accent/40"
                >
                  <a.icon className="h-4 w-4 text-primary" />
                  <span className="text-[12.5px] font-medium">{a.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}
