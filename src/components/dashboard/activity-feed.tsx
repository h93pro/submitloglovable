import { activityFeed } from "@/lib/mock-data";
import { CheckCircle2, FileUp, RefreshCw, MessageSquare, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = {
  approved: { Icon: CheckCircle2, color: "text-success bg-success/10" },
  submitted: { Icon: FileUp, color: "text-info bg-info/10" },
  revise: { Icon: RefreshCw, color: "text-warning bg-warning/15" },
  comment: { Icon: MessageSquare, color: "text-muted-foreground bg-muted" },
  rejected: { Icon: XCircle, color: "text-destructive bg-destructive/10" },
};

export function ActivityFeed() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-[13px] font-semibold">Recent activity</h3>
        <button className="text-[11.5px] text-muted-foreground hover:text-foreground">View all</button>
      </div>
      <ul className="divide-y divide-border">
        {activityFeed.map((a) => {
          const { Icon, color } = iconMap[a.type];
          return (
            <li key={a.id} className="flex items-start gap-3 px-4 py-3">
              <div className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-full", color)}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1 text-[12.5px] leading-snug">
                <span className="font-medium">{a.user}</span>{" "}
                <span className="text-muted-foreground">{a.action}</span>{" "}
                <span className="font-medium">{a.target}</span>
                <div className="mt-0.5 text-[11px] text-muted-foreground">{a.time}</div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
