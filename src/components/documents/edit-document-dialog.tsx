import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import type { SubmittalDoc } from "@/lib/mock-data";

export function EditDocumentDialog({
  open, onOpenChange, document,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: SubmittalDoc;
}) {
  const [title, setTitle] = useState(document.title);
  const [supplier, setSupplier] = useState(document.supplier);
  const [discipline, setDiscipline] = useState(document.discipline);
  const [submitDate, setSubmitDate] = useState(document.submitDate);
  const [replyDate, setReplyDate] = useState(document.replyDate ?? "");
  const [description, setDescription] = useState(document.description ?? "");
  const [saving, setSaving] = useState(false);

  // Re-sync fields when the dialog is reopened for a different doc
  useEffect(() => {
    if (open) {
      setTitle(document.title);
      setSupplier(document.supplier);
      setDiscipline(document.discipline);
      setSubmitDate(document.submitDate);
      setReplyDate(document.replyDate ?? "");
      setDescription(document.description ?? "");
    }
  }, [open, document]);

  async function handleSave() {
    setSaving(true);
    // Mock submission — no backend wiring yet
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    toast.success("Document updated");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Edit document</DialogTitle>
          <DialogDescription>Update document metadata. Changes apply to the current revision.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-3 py-2 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="ed-code">Code</Label>
            <Input id="ed-code" value={document.code} readOnly className="font-mono text-[12.5px]" />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="ed-title">Title</Label>
            <Input id="ed-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ed-supplier">Supplier</Label>
            <Input id="ed-supplier" value={supplier} onChange={(e) => setSupplier(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ed-discipline">Discipline</Label>
            <Input id="ed-discipline" value={discipline} onChange={(e) => setDiscipline(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ed-submit">Submit date</Label>
            <Input id="ed-submit" type="date" value={submitDate} onChange={(e) => setSubmitDate(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ed-reply">Reply date</Label>
            <Input id="ed-reply" type="date" value={replyDate} onChange={(e) => setReplyDate(e.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="ed-desc">Description</Label>
            <Textarea id="ed-desc" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving || !title.trim()}>
            {saving ? <><Loader2 className="animate-spin" /> Saving…</> : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
