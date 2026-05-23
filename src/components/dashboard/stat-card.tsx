import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

type Tone = "default" | "success" | "warning" | "destructive" | "info";

const toneClasses: Record<Tone, string> = {
  default: "text-foreground",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
  info: "text-info",
};

export function StatCard({
  label,
  value,
  delta,
  tone = "default",
  icon: Icon,
  children,
}: {
  label: string;
  value: string | number;
  delta?: { value: string; positive?: boolean };
  tone?: Tone;
  icon?: React.ComponentType<{ className?: string }>;
  children?: React.ReactNode;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 transition hover:border-border/80 hover:shadow-sm">
      <div className="flex items-start justify-between">
        <div className="text-[11.5px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        {Icon && (
          <div className={cn("grid h-7 w-7 place-items-center rounded-md bg-muted", toneClasses[tone])}>
            <Icon className="h-3.5 w-3.5" />
          </div>
        )}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <div className={cn("text-2xl font-semibold tabular-nums tracking-tight", toneClasses[tone])}>
          {value}
        </div>
        {delta && (
          <div className={cn(
            "inline-flex items-center gap-0.5 text-[11.5px] font-medium",
            delta.positive ? "text-success" : "text-destructive",
          )}>
            {delta.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {delta.value}
          </div>
        )}
      </div>
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
