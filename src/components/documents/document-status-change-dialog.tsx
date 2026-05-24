import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/documents/status-badge";
import { Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DocStatus } from "@/lib/mock-data";

const COMMENT_REQUIRED: DocStatus[] = ["REJECTED", "REVISE & RESUBMIT", "APPROVED AS NOTED"];

const CONFIRM_CLASSES: Record<DocStatus, string> = {
  APPROVED: "bg-emerald-600 hover:bg-emerald-600/90 text-white",
  "APPROVED AS NOTED": "bg-amber-600 hover:bg-amber-600/90 text-white",
  "REVISE & RESUBMIT": "bg-red-600 hover:bg-red-600/90 text-white",
  REJECTED: "bg-red-800 hover:bg-red-800/90 text-white",
  VOID: "bg-muted-foreground hover:bg-muted-foreground/90 text-white",
  SUBMITTED: "",
};

export function DocumentStatusChangeDialog({
  open, onOpenChange, currentStatus, newStatus, documentCode,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentStatus: DocStatus;
  newStatus: DocStatus;
  documentCode: string;
}) {
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const required = COMMENT_REQUIRED.includes(newStatus);

  useEffect(() => {
    if (open) {
      setComment("");
      setError(null);
    }
  }, [open, newStatus]);

  async function handleConfirm() {
    if (required && !comment.trim()) {
      setError("A comment is required for this status change.");
      return;
    }
    setError(null);
    setSubmitting(true);
    // Mock submission — no backend wiring yet
    await new Promise((r) => setTimeout(r, 500));
    setSubmitting(false);
    toast.success(`Status changed to ${newStatus}`, { description: documentCode });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Change status to {newStatus}</DialogTitle>
          <DialogDescription>{documentCode}</DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center gap-3 py-2">
          <StatusBadge status={currentStatus} />
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <StatusBadge status={newStatus} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="status-comment">
            Comment {required ? <span className="text-destructive">*</span> : <span className="text-muted-foreground">(optional)</span>}
          </Label>
          <Textarea
            id="status-comment"
            rows={4}
            value={comment}
            onChange={(e) => { setComment(e.target.value); if (error) setError(null); }}
            placeholder={required ? "Explain the reason for this status change…" : "Optional comment"}
            aria-invalid={!!error}
          />
          {error ? <p className="text-[12px] font-medium text-destructive">{error}</p> : null}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>Cancel</Button>
          <Button
            onClick={handleConfirm}
            disabled={submitting}
            className={cn(CONFIRM_CLASSES[newStatus])}
          >
            {submitting ? <><Loader2 className="animate-spin" /> Updating…</> : `Confirm — ${newStatus}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
