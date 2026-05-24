import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { QuickCreateDialog } from "@/components/quick-create-dialog";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";

export const Route = createFileRoute("/inquiries")({
  head: () => ({ meta: [{ title: "Inquiries — SubmitLog" }] }),
  component: InquiriesPage,
});

const inquiries = [
  { id: 1, from: "Voltage Systems", subject: "Clarification on switchgear submittal specs", project: "Riverside Commercial Tower", status: "open", time: "2h ago" },
  { id: 2, from: "Glassline Façades", subject: "Bonding agent compatibility — Section 08.44", project: "Harbor Heights Expansion", status: "answered", time: "5h ago" },
  { id: 3, from: "Acme Mechanical", subject: "Lead time for chillers CH-01", project: "Airport District Concourse", status: "open", time: "Yesterday" },
  { id: 4, from: "Forge Industries", subject: "Are alternates allowed for anchor bolts?", project: "Metro Bridge Rehabilitation", status: "open", time: "Yesterday" },
  { id: 5, from: "Hydro Supply Co", subject: "RFI on plumbing fixture finish selection", project: "Riverside Commercial Tower", status: "answered", time: "2d ago" },
];

function InquiriesPage() {
  const [q, setQ] = useState("");
  const [toDelete, setToDelete] = useState<(typeof inquiries)[number] | null>(null);
  const filtered = inquiries.filter((i) => !q || (i.subject + i.from).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="mx-auto max-w-[1300px] px-6 py-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary"><MessageSquare className="h-5 w-5" /></div>
          <div>
            <h1 className="text-[20px] font-semibold tracking-tight">Inquiries</h1>
            <p className="text-[12.5px] text-muted-foreground">{inquiries.length} inquiries · {inquiries.filter((i) => i.status === "open").length} awaiting reply</p>
          </div>
        </div>
        <QuickCreateDialog
          title="New inquiry"
          description="Send a clarification request to a supplier or subcontractor."
          submitLabel="Send inquiry"
          trigger={<Button size="sm" className="h-8 gap-1.5 text-[12.5px]"><Plus className="h-3.5 w-3.5" /> New inquiry</Button>}
          fields={[
            { name: "from", label: "Recipient", type: "text", placeholder: "Supplier or contact", required: true },
            { name: "project", label: "Project", type: "select", options: ["Riverside Commercial Tower", "Harbor Heights Expansion", "Airport District Concourse", "Metro Bridge Rehabilitation"] },
            { name: "subject", label: "Subject", type: "text", placeholder: "Short subject line", required: true, col: 2 },
            { name: "body", label: "Message", type: "textarea", rows: 5, placeholder: "Describe the clarification needed…", col: 2 },
          ]}
        />
      </div>

      <div className="mb-3 relative">
        <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search inquiries…" value={q} onChange={(e) => setQ(e.target.value)} className="h-8 w-80 pl-7 text-[12.5px]" />
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <ul className="divide-y divide-border">
          {filtered.map((i) => (
            <li key={i.id} className="flex items-start gap-3 p-3 hover:bg-accent/40">
              <Avatar className="h-9 w-9"><AvatarFallback className="bg-primary/15 text-[11px] font-semibold text-primary">{i.from.split(" ").map((x) => x[0]).slice(0, 2).join("")}</AvatarFallback></Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[12.5px] font-semibold">{i.from}</span>
                  <span className={`rounded-full border px-1.5 py-0.5 text-[9.5px] font-semibold uppercase ${i.status === "open" ? "bg-amber-500/15 text-amber-400 border-amber-500/30" : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"}`}>{i.status}</span>
                  <span className="ml-auto text-[11px] text-muted-foreground">{i.time}</span>
                </div>
                <div className="mt-0.5 text-[13px]">{i.subject}</div>
                <div className="text-[11px] text-muted-foreground">{i.project}</div>
              </div>
            </li>
          ))}
          {filtered.length === 0 && <li className="grid min-h-[200px] place-items-center text-[12.5px] text-muted-foreground">No inquiries match your search.</li>}
        </ul>
      </div>
    </div>
  );
}
