import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { projectDetails, allDocuments } from "@/lib/mock-data";
import { ChevronLeft, MapPin, User, Calendar, DollarSign, FileText, Users as UsersIcon, BarChart3, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DocumentsTable } from "@/components/documents/documents-table";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { scheduleCurve } from "@/lib/mock-data";

export const Route = createFileRoute("/projects/$id")({
  head: ({ params }) => ({ meta: [{ title: `${params.id} — Project — SubmitLog` }] }),
  loader: ({ params }) => {
    const p = projectDetails.find((x) => x.id === params.id);
    if (!p) throw notFound();
    return p;
  },
  notFoundComponent: () => <div className="grid min-h-[60vh] place-items-center text-sm text-muted-foreground">Project not found.</div>,
  component: Detail,
});

function Detail() {
  const p = Route.useLoaderData();
  const docs = allDocuments.filter((d) => d.project === p.name);

  return (
    <div className="mx-auto max-w-[1500px] px-6 py-6">
      <Link to="/projects" className="mb-3 inline-flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-3.5 w-3.5" /> Back to Projects
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />
            <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">{p.code}</span>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-emerald-400">{p.status}</span>
          </div>
          <h1 className="mt-1.5 text-[22px] font-semibold tracking-tight">{p.name}</h1>
          <p className="mt-0.5 text-[12.5px] text-muted-foreground">{p.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 text-[12.5px]">Edit</Button>
          <Button size="sm" className="h-8 text-[12.5px]">Generate report</Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi icon={DollarSign} label="Contract Value" value={p.value} />
        <Kpi icon={Calendar} label="Schedule" value={`${p.progress}%`} sub={`Ends ${p.endDate}`} />
        <Kpi icon={FileText} label="Open Submittals" value={p.openSubmittals.toString()} sub={`${p.openRfis} RFIs`} />
        <Kpi icon={UsersIcon} label="Team" value={p.team.length.toString()} sub={p.pm} />
      </div>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList className="bg-transparent border-b border-border rounded-none w-full justify-start p-0 h-auto">
          {[
            { v: "overview", label: "Overview", Icon: Activity },
            { v: "documents", label: "Documents", Icon: FileText },
            { v: "schedule", label: "Schedule", Icon: BarChart3 },
            { v: "team", label: "Team", Icon: UsersIcon },
          ].map(({ v, label, Icon }) => (
            <TabsTrigger key={v} value={v} className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 h-9 text-[12.5px] gap-1.5">
              <Icon className="h-3.5 w-3.5" /> {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-5">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <Card title="Project info" className="lg:col-span-2">
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
                {[
                  ["Client", p.client], ["Location", p.location], ["Project Manager", p.pm],
                  ["Start date", p.startDate], ["End date", p.endDate], ["Contract value", p.value],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">{k}</dt>
                    <dd className="mt-0.5 text-[13px]">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-5">
                <div className="mb-1 flex items-center justify-between text-[12px]">
                  <span className="font-medium">Overall progress</span>
                  <span className="font-semibold tabular-nums">{p.progress}%</span>
                </div>
                <Progress value={p.progress} className="h-2" />
              </div>
            </Card>

            <Card title="Quick stats">
              <ul className="space-y-2.5 text-[12.5px]">
                <li className="flex justify-between"><span className="text-muted-foreground">Open submittals</span><span className="font-semibold tabular-nums">{p.openSubmittals}</span></li>
                <li className="flex justify-between"><span className="text-muted-foreground">Open RFIs</span><span className="font-semibold tabular-nums">{p.openRfis}</span></li>
                <li className="flex justify-between"><span className="text-muted-foreground">Overdue items</span><span className="font-semibold tabular-nums text-destructive">{p.overdue}</span></li>
                <li className="flex justify-between"><span className="text-muted-foreground">Total documents</span><span className="font-semibold tabular-nums">{docs.length}</span></li>
              </ul>
            </Card>

            <Card title="Schedule curve (last 24w)" className="lg:col-span-3">
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={scheduleCurve}>
                    <defs>
                      <linearGradient id="bp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} /><stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} /></linearGradient>
                      <linearGradient id="ap" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
                    </defs>
                    <XAxis dataKey="week" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", fontSize: 12, borderRadius: 8 }} />
                    <Area type="monotone" dataKey="baseline" stroke="hsl(var(--primary))" fill="url(#bp)" strokeWidth={2} />
                    <Area type="monotone" dataKey="actual" stroke="#10b981" fill="url(#ap)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="mt-5">
          <DocumentsTable data={docs} basePath="/documents/material-submittals" />
        </TabsContent>

        <TabsContent value="schedule" className="mt-5">
          <Card title="Milestones">
            <ul className="divide-y divide-border">
              {[
                { name: "Foundation Complete", planned: "2024-06-30", actual: "2024-07-12", variance: 12, status: "complete" },
                { name: "Superstructure Topout", planned: "2025-04-15", actual: "2025-05-02", variance: 17, status: "complete" },
                { name: "Façade Complete", planned: "2025-11-20", actual: "—", variance: 0, status: "in-progress" },
                { name: "Substantial Completion", planned: p.endDate, actual: "—", variance: 0, status: "upcoming" },
              ].map((m) => (
                <li key={m.name} className="flex items-center justify-between py-2.5 text-[12.5px]">
                  <div>
                    <div className="font-medium">{m.name}</div>
                    <div className="text-[11px] text-muted-foreground">Planned {m.planned} · Actual {m.actual}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    {m.variance > 0 && <span className="text-[11px] text-destructive">+{m.variance}d</span>}
                    <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] uppercase">{m.status}</span>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-5">
          <Card title="Team members">
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {p.team.map((m) => (
                <li key={m.name} className="flex items-center gap-3 rounded-lg border border-border bg-background p-3">
                  <Avatar className="h-9 w-9"><AvatarFallback className="bg-primary/15 text-[11px] font-semibold text-primary">{m.name.split(" ").map((x) => x[0]).join("")}</AvatarFallback></Avatar>
                  <div className="min-w-0">
                    <div className="truncate text-[13px] font-medium">{m.name}</div>
                    <div className="text-[11px] text-muted-foreground">{m.role}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, sub }: { icon: typeof MapPin; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="flex items-center gap-2">
        <div className="grid h-7 w-7 place-items-center rounded-md bg-primary/10 text-primary"><Icon className="h-3.5 w-3.5" /></div>
        <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">{label}</div>
      </div>
      <div className="mt-2 text-[18px] font-semibold tabular-nums">{value}</div>
      {sub && <div className="text-[11px] text-muted-foreground">{sub}</div>}
    </div>
  );
}

function Card({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-xl border border-border bg-card ${className ?? ""}`}>
      <div className="border-b border-border px-4 py-2.5"><h3 className="text-[12.5px] font-semibold">{title}</h3></div>
      <div className="p-4">{children}</div>
    </section>
  );
}
