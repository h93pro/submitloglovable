import { createFileRoute } from "@tanstack/react-router";
import { users, type AppUser } from "@/lib/mock-data";
import { UserCog, Plus, Search, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Users — SubmitLog" }] }),
  component: UsersPage,
});

const statusStyles: Record<AppUser["status"], string> = {
  active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  invited: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  suspended: "bg-destructive/15 text-destructive border-destructive/30",
};

function UsersPage() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const filtered = users.filter((u) => !q || u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary"><UserCog className="h-5 w-5" /></div>
          <div>
            <h1 className="text-[20px] font-semibold tracking-tight">Users</h1>
            <p className="text-[12.5px] text-muted-foreground">{users.length} members · {users.filter((u) => u.status === "active").length} active</p>
          </div>
        </div>
        <Button size="sm" className="h-8 gap-1.5 text-[12.5px]" onClick={() => setOpen(true)}><Plus className="h-3.5 w-3.5" /> Invite user</Button>
      </div>

      <div className="mb-3 flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search users…" value={q} onChange={(e) => setQ(e.target.value)} className="h-8 w-72 pl-7 text-[12.5px]" />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <table className="w-full text-left text-[13px]">
          <thead className="bg-muted/50">
            <tr className="border-b border-border">
              {["User", "Role", "Status", "Projects", "Last active", ""].map((h) => (
                <th key={h} className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-border/60 hover:bg-accent/40">
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="h-7 w-7"><AvatarFallback className="bg-primary/15 text-[10px] font-semibold text-primary">{u.name.split(" ").map((x) => x[0]).join("")}</AvatarFallback></Avatar>
                    <div>
                      <div className="text-[12.5px] font-medium">{u.name}</div>
                      <div className="text-[11px] text-muted-foreground">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2.5"><span className="rounded-md bg-muted px-1.5 py-0.5 text-[11px]">{u.role}</span></td>
                <td className="px-3 py-2.5"><span className={cn("rounded-full border px-1.5 py-0.5 text-[10px] font-semibold uppercase", statusStyles[u.status])}>{u.status}</span></td>
                <td className="px-3 py-2.5 tabular-nums">{u.projects}</td>
                <td className="px-3 py-2.5 text-muted-foreground">{u.lastActive}</td>
                <td className="px-3 py-2.5 text-right"><Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-3.5 w-3.5" /></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Invite user</SheetTitle>
            <SheetDescription>Send an invitation email with role and project access.</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1.5"><Label htmlFor="name">Full name</Label><Input id="name" placeholder="Jane Doe" /></div>
            <div className="space-y-1.5"><Label htmlFor="email">Email</Label><Input id="email" type="email" placeholder="jane@company.com" /></div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select defaultValue="Engineer"><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["Admin", "PM", "Engineer", "Reviewer", "Viewer"].map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => { toast.success("Invitation sent"); setOpen(false); }}>Send invite</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
