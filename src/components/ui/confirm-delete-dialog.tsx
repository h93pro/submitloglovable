import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export function ConfirmDeleteDialog({
  open, onOpenChange, itemType, itemName, onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemType: string;
  itemName: string;
  onConfirm?: () => void | Promise<void>;
}) {
  const [deleting, setDeleting] = useState(false);

  async function handleConfirm(e: React.MouseEvent) {
    e.preventDefault();
    setDeleting(true);
    try {
      await onConfirm?.();
      // Mock confirmation — no backend wiring yet
      await new Promise((r) => setTimeout(r, 400));
      toast.success(`Deleted`, { description: itemName });
      onOpenChange(false);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {itemType}?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete <span className="font-semibold text-foreground">{itemName}</span>. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={deleting}
            className={cn(buttonVariants({ variant: "destructive" }))}
          >
            {deleting ? <><Loader2 className="animate-spin" /> Deleting…</> : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
