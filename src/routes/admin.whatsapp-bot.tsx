import { createFileRoute } from "@tanstack/react-router";
import { whatsappStats, whatsappMessages, whatsappVolume } from "@/lib/mock-data";
import { Bot, MessageCircle, Activity, AlertCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/admin/whatsapp-bot")({
  head: () => ({ meta: [{ title: "WhatsApp Bot — SubmitLog" }] }),
  component: WhatsAppPage,
});

function WhatsAppPage() {
  return (
    <div className="mx-auto max-w-[1500px] px-6 py-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-500/15 text-emerald-400"><Bot className="h-5 w-5" /></div>
          <div>
            <h1 className="text-[20px] font-semibold tracking-tight">WhatsApp Bot</h1>
            <p className="text-[12.5px] text-muted-foreground">Field bot live activity, automations and message volume</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
          </span>
          <Button variant="outline" size="sm" className="h-8 text-[12.5px]">Configure</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi icon={MessageCircle} label="Messages (24h)" value={whatsappStats.messages24h.toLocaleString()} />
        <Kpi icon={Activity} label="Active chats" value={whatsappStats.activeChats.toString()} />
        <Kpi icon={Bot} label="Automations" value={whatsappStats.automationsTriggered.toString()} />
        <Kpi icon={AlertCircle} label="Error rate" value={`${whatsappStats.errorRate}%`} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card title="Message volume (14d)" className="lg:col-span-2">
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={whatsappVolume}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="incoming" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="outgoing" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Live chats">
          <ul className="divide-y divide-border">
            {whatsappMessages.map((m) => (
              <li key={m.id} className="flex items-start gap-3 py-2.5">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-[10px] font-semibold text-emerald-400">
                  {m.contact.split(" ").slice(0, 2).map((x) => x[0]).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-[12.5px] font-medium">{m.contact}</span>
                    <span className="text-[10.5px] text-muted-foreground">{m.time}</span>
                  </div>
                  <p className="line-clamp-1 text-[11.5px] text-muted-foreground">{m.lastMessage}</p>
                  <span className="mt-0.5 inline-block rounded bg-muted px-1.5 py-0.5 text-[9.5px] uppercase tracking-wider text-muted-foreground">{m.intent}</span>
                </div>
                {m.unread > 0 && <span className="grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">{m.unread}</span>}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card title="Quick broadcast" className="mt-5">
        <div className="flex gap-2">
          <Input placeholder="Send a broadcast to all active site supervisors…" className="flex-1" />
          <Button className="gap-1.5"><Send className="h-3.5 w-3.5" /> Send</Button>
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">Broadcasts are rate-limited and logged. Estimated delivery: 87 active recipients.</p>
      </Card>
    </div>
  );
}

function Kpi({ icon: Icon, label, value }: { icon: typeof Bot; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="flex items-center gap-2"><div className="grid h-7 w-7 place-items-center rounded-md bg-primary/10 text-primary"><Icon className="h-3.5 w-3.5" /></div><div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">{label}</div></div>
      <div className="mt-2 text-[18px] font-semibold tabular-nums">{value}</div>
    </div>
  );
}
function Card({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return <section className={`rounded-xl border border-border bg-card ${className ?? ""}`}><div className="border-b border-border px-4 py-2.5"><h3 className="text-[12.5px] font-semibold">{title}</h3></div><div className="p-4">{children}</div></section>;
}
