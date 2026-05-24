import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { tenders } from "@/lib/mock-data";
import { ChevronLeft, Calendar, DollarSign, FileText, Users, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/tenders/$id")({
  head: ({ params }) => ({ meta: [{ title: `${params.id} — Tender — SubmitLog` }] }),
  loader: ({ params }) => {
    const t = tenders.find((x) => x.id === params.id);
    if (!t) throw notFound();
    return t;
  },
  notFoundComponent: () => <div className="grid min-h-[60vh] place-items-center text-sm text-muted-foreground">Tender not found.</div>,
  component: TenderDetail,
});

function TenderDetail() {
  const t = Route.useLoaderData();
  return (
    <div className="mx-auto max-w-[1400px] px-6 py-6">
      <Link to="/tenders" className="mb-3 inline-flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-3.5 w-3.5" /> Back to Tenders
      </Link>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">{t.code}</span>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-emerald-400">{t.status}</span>
          </div>
          <h1 className="mt-1.5 text-[20px] font-semibold tracking-tight">{t.title}</h1>
          <p className="mt-0.5 text-[12.5px] text-muted-foreground">{t.client} · {t.discipline}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8 text-[12.5px]">Edit</Button>
          <Button size="sm" className="h-8 text-[12.5px]">Invite suppliers</Button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi icon={DollarSign} label="Est. value" value={t.value} />
        <Kpi icon={Calendar} label="Deadline" value={t.submitDeadline} />
        <Kpi icon={FileText} label="Documents" value="12" />
        <Kpi icon={Users} label="Submissions" value={t.submissions.toString()} />
      </div>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList className="bg-transparent border-b border-border rounded-none w-full justify-start p-0 h-auto">
          {["overview", "details", "documents", "submissions", "addendums", "inquiries", "team", "notes"].map((v) => (
            <TabsTrigger key={v} value={v} className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 h-9 text-[12.5px] capitalize whitespace-nowrap">
              {v.replace("-", " ")}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-5">
          <Card title="Scope of work">
            <p className="text-[13px] leading-relaxed text-foreground/90">
              Furnish all labor, materials and equipment required for the {t.title.toLowerCase()} including all related submittals,
              shop drawings, quality control, testing and commissioning per project specifications.
            </p>
          </Card>
        </TabsContent>
        <TabsContent value="documents" className="mt-5">
          <Card title="Tender documents">
            <ul className="divide-y divide-border text-[12.5px]">
              {["Instructions to Bidders.pdf", "Specifications Section 05.pdf", "Drawings — Steel Package.dwg", "Form of Tender.docx"].map((f) => (
                <li key={f} className="flex items-center justify-between py-2"><span>{f}</span><Button variant="ghost" size="sm" className="h-7 text-[11.5px]">Download</Button></li>
              ))}
            </ul>
          </Card>
        </TabsContent>
        <TabsContent value="submissions" className="mt-5">
          <Card title={`Supplier submissions (${t.submissions})`}>
            <ul className="divide-y divide-border text-[12.5px]">
              {Array.from({ length: t.submissions }).map((_, i) => (
                <li key={i} className="flex items-center justify-between py-2">
                  <div><div className="font-medium">Supplier {i + 1} Co.</div><div className="text-[11px] text-muted-foreground">Submitted {i + 1}d ago</div></div>
                  <div className="tabular-nums">${(Math.random() * 5 + 18).toFixed(2)}M</div>
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>
        <TabsContent value="addendums" className="mt-5">
          <Card title="Addendums"><Empty label="No addendums issued yet." /></Card>
        </TabsContent>
        <TabsContent value="inquiries" className="mt-5">
          <Card title="Supplier inquiries"><Empty label="No inquiries received." /></Card>
        </TabsContent>
        <TabsContent value="details" className="mt-5">
          <Card title="Tender details">
            <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["Code", t.code], ["Client", t.client], ["Discipline", t.discipline],
                ["Status", t.status], ["Est. value", t.value], ["Submission deadline", t.submitDeadline],
                ["Submissions received", t.submissions.toString()],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">{k}</dt>
                  <dd className="mt-0.5 text-[13px]">{v}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </TabsContent>
        <TabsContent value="team" className="mt-5">
          <Card title="Evaluation team">
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { name: "Sarah Chen", role: "Tender lead" },
                { name: "Marco Rossi", role: "Technical reviewer" },
                { name: "Priya Nair", role: "Commercial reviewer" },
              ].map((m) => (
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
        <TabsContent value="notes" className="mt-5">
          <TenderNotes />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TenderNotes() {
  const [notes, setNotes] = useState<{ id: string; text: string; at: string }[]>([]);
  const [draft, setDraft] = useState("");
  return (
    <Card title="Internal notes">
      <div className="space-y-2.5">
        <Textarea
          placeholder="Add an internal evaluation note…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          className="text-[12.5px]"
        />
        <div className="flex justify-end">
          <Button
            size="sm"
            className="h-8 gap-1.5 text-[12.5px]"
            disabled={!draft.trim()}
            onClick={() => {
              setNotes((prev) => [{ id: `n${Date.now()}`, text: draft.trim(), at: "just now" }, ...prev]);
              setDraft("");
              toast.success("Note added");
            }}
          >
            <Plus className="h-3.5 w-3.5" /> Add note
          </Button>
        </div>
        {notes.length === 0 ? (
          <Empty label="No notes yet." />
        ) : (
          <ul className="mt-2 space-y-2">
            {notes.map((n) => (
              <li key={n.id} className="rounded-md border border-border bg-background p-3">
                <p className="text-[13px] text-foreground/90">{n.text}</p>
                <div className="mt-1 text-[11px] text-muted-foreground">{n.at}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}

function Kpi({ icon: Icon, label, value }: { icon: typeof DollarSign; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="flex items-center gap-2"><div className="grid h-7 w-7 place-items-center rounded-md bg-primary/10 text-primary"><Icon className="h-3.5 w-3.5" /></div><div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">{label}</div></div>
      <div className="mt-2 text-[16px] font-semibold tabular-nums">{value}</div>
    </div>
  );
}
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-xl border border-border bg-card"><div className="border-b border-border px-4 py-2.5"><h3 className="text-[12.5px] font-semibold">{title}</h3></div><div className="p-4">{children}</div></section>;
}
function Empty({ label }: { label: string }) { return <div className="grid place-items-center py-10 text-[12.5px] text-muted-foreground">{label}</div>; }
