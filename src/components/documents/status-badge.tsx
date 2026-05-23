import { cn } from "@/lib/utils";
import type { DocStatus } from "@/lib/mock-data";

const styles: Record<DocStatus, string> = {
  "SUBMITTED": "bg-info/10 text-info border-info/20",
  "APPROVED": "bg-success/10 text-success border-success/20",
  "APPROVED AS NOTED": "bg-success/10 text-success/90 border-success/20",
  "REVISE & RESUBMIT": "bg-warning/15 text-warning border-warning/30",
  "REJECTED": "bg-destructive/10 text-destructive border-destructive/20",
  "VOID": "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ status, className }: { status: DocStatus; className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10.5px] font-medium uppercase tracking-wide whitespace-nowrap",
      styles[status],
      className,
    )}>
      <span className="h-1 w-1 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );
}
