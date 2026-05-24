import { useRef, useState, type DragEvent } from "react";
import { Link } from "@tanstack/react-router";
import type { SubmittalDoc } from "@/lib/mock-data";
import { StatusBadge } from "@/components/documents/status-badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ChevronLeft, CheckCircle2, XCircle, RefreshCw, Ban, FileText, Sparkles,
  Paperclip, Download as DownloadIcon, History, MessageSquare, Link2, ScrollText, UploadCloud, X,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

export function DocumentDetail({
  doc, backTo, backLabel,
}: {
  doc: SubmittalDoc;
  backTo: string;
  backLabel: string;
}) {
  return (
    <div className="mx-auto max-w-[1400px] px-6 py-6">
      <Link to={backTo} className="mb-3 inline-flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-3.5 w-3.5" /> Back to {backLabel}
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">{doc.code}</span>
            <StatusBadge status={doc.status} />
            <span className="font-mono text-[11px] text-muted-foreground">rev {doc.revision}</span>
          </div>
          <h1 className="mt-1.5 text-[20px] font-semibold tracking-tight">{doc.title}</h1>
          <p className="mt-0.5 text-[12.5px] text-muted-foreground">{doc.supplier} · {doc.discipline} · {doc.project}</p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-[12.5px] text-destructive hover:text-destructive" onClick={() => toast("Marked as rejected")}>
            <XCircle className="h-3.5 w-3.5" /> Reject
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-[12.5px]" onClick={() => toast("Revision requested")}>
            <RefreshCw className="h-3.5 w-3.5" /> Revise
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-[12.5px]" onClick={() => toast("Document voided")}>
            <Ban className="h-3.5 w-3.5" /> Void
          </Button>
          <Button size="sm" className="h-8 gap-1.5 text-[12.5px]" onClick={() => toast.success("Document approved")}>
            <CheckCircle2 className="h-3.5 w-3.5" /> Approve
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="mt-5">
        <TabsList className="bg-transparent border-b border-border rounded-none w-full justify-start p-0 h-auto overflow-x-auto">
          {[
            { v: "overview", label: "Overview", Icon: FileText },
            { v: "revisions", label: "Revisions", Icon: History },
            { v: "links", label: "Links", Icon: Link2 },
            { v: "comments", label: "Comments", Icon: MessageSquare },
            { v: "attachments", label: "Attachments", Icon: Paperclip },
            { v: "audit", label: "Audit log", Icon: ScrollText },
          ].map(({ v, label, Icon }) => (
            <TabsTrigger key={v} value={v} className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 h-9 text-[12.5px] gap-1.5 whitespace-nowrap">
              <Icon className="h-3.5 w-3.5" /> {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-5">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-5">
              <Section title="Metadata">
                <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
                  {[
                    ["Code", doc.code], ["Project", doc.project], ["Discipline", doc.discipline],
                    ["Supplier", doc.supplier], ["Submit date", doc.submitDate], ["Reply date", doc.replyDate ?? "—"],
                    ["Revision", `r${doc.revision}`], ["Status", doc.status],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">{k}</dt>
                      <dd className="mt-0.5 text-[13px]">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-4">
                  <div className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">Description</div>
                  <p className="mt-1 text-[13px] leading-relaxed text-foreground/90">{doc.description}</p>
                </div>
              </Section>

              <Section title="Attachments" right={<Button variant="ghost" size="sm" className="h-7 gap-1.5 text-[12px]"><UploadCloud className="h-3.5 w-3.5" /> Upload</Button>}>
                <div className="space-y-2">
                  {doc.attachments?.map((f) => (
                    <div key={f.name} className="flex items-center gap-3 rounded-md border border-border bg-background p-2.5">
                      <div className="grid h-8 w-8 place-items-center rounded bg-muted text-muted-foreground"><Paperclip className="h-3.5 w-3.5" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="truncate text-[12.5px] font-medium">{f.name}</div>
                        <div className="text-[11px] text-muted-foreground">{f.size}</div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><DownloadIcon className="h-3.5 w-3.5" /></Button>
                    </div>
                  ))}
                  <div className="grid place-items-center rounded-md border border-dashed border-border bg-muted/30 px-4 py-6 text-center">
                    <UploadCloud className="mb-1.5 h-4 w-4 text-muted-foreground" />
                    <div className="text-[12px] font-medium">Drop files here</div>
                    <div className="text-[11px] text-muted-foreground">PDF, DWG, XLSX · up to 50 MB</div>
                  </div>
                </div>
              </Section>
            </div>

            <div className="space-y-5">
              <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-4">
                <div className="mb-2 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <h3 className="text-[12.5px] font-semibold">AI summary</h3>
                </div>
                <p className="text-[12.5px] leading-relaxed text-foreground/85">
                  Document includes compliance certificates and supporting drawings for {doc.title.toLowerCase()}.
                  No discrepancies detected against project specifications.
                </p>
                <Button variant="ghost" size="sm" className="mt-3 h-7 gap-1.5 text-[11.5px] text-primary hover:text-primary">Regenerate</Button>
              </div>

              <Section title="Workflow">
                <ol className="relative space-y-3 border-l border-border pl-4">
                  {[
                    { label: "Submitted by contractor", time: doc.submitDate, done: true, active: false },
                    { label: "Engineer review", time: doc.status !== "SUBMITTED" ? "complete" : "in progress", done: doc.status !== "SUBMITTED", active: doc.status === "SUBMITTED" },
                    { label: "Owner approval", time: doc.status === "APPROVED" ? doc.replyDate ?? "—" : "—", done: doc.status === "APPROVED" || doc.status === "APPROVED AS NOTED", active: false },
                  ].map((s, i) => (
                    <li key={i} className="relative">
                      <span className={`absolute -left-[21px] top-0.5 grid h-3.5 w-3.5 place-items-center rounded-full border-2 ${s.done ? "border-primary bg-primary" : s.active ? "border-primary bg-background" : "border-border bg-background"}`} />
                      <div className="text-[12.5px] font-medium">{s.label}</div>
                      <div className="text-[11px] text-muted-foreground">{s.time}</div>
                    </li>
                  ))}
                </ol>
              </Section>

              <Section title="Team">
                <div className="flex flex-wrap gap-2">
                  {["Sarah Chen", "Marco Rossi", "Priya Nair"].map((n) => (
                    <div key={n} className="flex items-center gap-2 rounded-full border border-border bg-background px-2 py-1">
                      <Avatar className="h-5 w-5"><AvatarFallback className="bg-primary/15 text-[9px] font-semibold text-primary">{n.split(" ").map((p) => p[0]).join("")}</AvatarFallback></Avatar>
                      <span className="text-[12px]">{n}</span>
                    </div>
                  ))}
                </div>
              </Section>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="revisions" className="mt-5">
          <Section title="Revision history">
            <ol className="relative space-y-4 border-l border-border pl-5">
              {Array.from({ length: doc.revision + 1 }).map((_, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[25px] top-1 grid h-4 w-4 place-items-center rounded-full border-2 border-primary bg-background" />
                  <div className="text-[13px] font-medium">Revision r{doc.revision - i}</div>
                  <div className="text-[11.5px] text-muted-foreground">Updated · {doc.submitDate}</div>
                  <p className="mt-1 text-[12.5px] text-foreground/80">Re-submitted with engineer comments addressed. Updated datasheet attached.</p>
                </li>
              ))}
            </ol>
          </Section>
        </TabsContent>

        <TabsContent value="links" className="mt-5">
          <Section title="Linked items"><Empty label="No linked items yet." /></Section>
        </TabsContent>
        <TabsContent value="comments" className="mt-5">
          <Section title="Comments"><Empty label="Be the first to comment." /></Section>
        </TabsContent>
        <TabsContent value="attachments" className="mt-5">
          <Section title="Attachments">
            <AttachmentsZone initial={doc.attachments ?? []} />
          </Section>
        </TabsContent>
        <TabsContent value="audit" className="mt-5">
          <Section title="Audit log">
            <ul className="space-y-2 text-[12.5px]">
              {[
                ["Created", doc.submitDate, "Sarah Chen"],
                ["Status changed to " + doc.status, doc.submitDate, "System"],
                ["Attachment uploaded", doc.submitDate, "Marco Rossi"],
              ].map(([action, time, who], i) => (
                <li key={i} className="flex items-center justify-between border-b border-border/60 py-1.5">
                  <span>{action}</span>
                  <span className="text-muted-foreground">{who} · {time}</span>
                </li>
              ))}
            </ul>
          </Section>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Section({ title, right, children }: { title: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <h3 className="text-[12.5px] font-semibold">{title}</h3>
        {right}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function Empty({ label }: { label: string }) {
  return <div className="grid place-items-center py-10 text-[12.5px] text-muted-foreground">{label}</div>;
}
