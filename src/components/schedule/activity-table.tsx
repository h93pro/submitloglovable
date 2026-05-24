import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronDown, Diamond, AlertTriangle, CheckCircle2, Clock, Circle } from "lucide-react";
import type { ScheduleActivity } from "@/lib/mock-data";
import { GANTT_ROW_H } from "./gantt-chart";

const STATUS_ICON = {
  complete: { icon: CheckCircle2, cls: "text-emerald-500" },
  "in-progress": { icon: Clock, cls: "text-blue-500" },
  delayed: { icon: AlertTriangle, cls: "text-amber-500" },
  "not-started": { icon: Circle, cls: "text-muted-foreground/60" },
} as const;

export function ActivityTable({
  activities,
  visibleIds,
  collapsedGroups,
  onToggleGroup,
  highlightId,
  onSelect,
  showBaseline,
}: {
  activities: ScheduleActivity[];
  visibleIds: string[];
  collapsedGroups: Set<string>;
  onToggleGroup: (id: string) => void;
  highlightId?: string | null;
  onSelect?: (id: string) => void;
  showBaseline: boolean;
}) {
  const rows = visibleIds
    .map((id) => activities.find((a) => a.id === id))
    .filter(Boolean) as ScheduleActivity[];

  return (
    <div className="h-full overflow-auto">
      <table className="w-full text-[11.5px]" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
        <thead className="sticky top-0 z-10 bg-card/95 backdrop-blur">
          <tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground">
            <Th className="w-[70px]">ID</Th>
            <Th className="min-w-[280px]">Activity name</Th>
            <Th className="w-[64px]">WBS</Th>
            <Th className="w-[88px]">Start</Th>
            <Th className="w-[88px]">Finish</Th>
            <Th className="w-[56px] text-right">Dur</Th>
            <Th className="w-[80px]">Progress</Th>
            <Th className="w-[56px] text-right">Float</Th>
            <Th className="w-[100px]">Predecessors</Th>
            <Th className="w-[70px]">Status</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((a) => {
            const S = STATUS_ICON[a.status];
            const Icon = S.icon;
            const collapsed = collapsedGroups.has(a.id);
            const isHi = highlightId === a.id;
            return (
              <tr
                key={a.id}
                onClick={() => onSelect?.(a.id)}
                style={{ height: GANTT_ROW_H }}
                className={cn(
                  "cursor-pointer border-b border-border/60 hover:bg-accent/40",
                  isHi && "bg-primary/5",
                  a.isGroup && "bg-muted/40 font-semibold",
                )}
              >
                <Td className={cn("font-mono tabular-nums text-[10.5px]", a.isCritical && "text-red-500")}>
                  {a.activityId}
                </Td>
                <Td>
                  <div className="flex items-center gap-1.5" style={{ paddingLeft: a.depth * 12 }}>
                    {a.isGroup ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); onToggleGroup(a.id); }}
                        className="grid h-4 w-4 place-items-center rounded hover:bg-accent"
                      >
                        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </button>
                    ) : a.isMilestone ? (
                      <Diamond className="h-3 w-3 rotate-45 text-primary" />
                    ) : (
                      <span className={cn("h-1.5 w-1.5 rounded-full", a.isCritical ? "bg-red-500" : "bg-muted-foreground/40")} />
                    )}
                    <span className={cn("truncate", a.isCritical && !a.isGroup && "text-red-500")}>{a.name}</span>
                    {showBaseline && a.baselineFinish !== a.finish && !a.isGroup && (
                      <span className="ml-1 rounded bg-amber-500/15 px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-amber-500">
                        Δ {(new Date(a.finish).getTime() - new Date(a.baselineFinish).getTime()) / 86400000 > 0 ? "+" : ""}
                        {Math.round((new Date(a.finish).getTime() - new Date(a.baselineFinish).getTime()) / 86400000)}d
                      </span>
                    )}
                  </div>
                </Td>
                <Td className="font-mono text-[10px] text-muted-foreground">{a.wbs}</Td>
                <Td className="tabular-nums text-muted-foreground">{a.start}</Td>
                <Td className="tabular-nums text-muted-foreground">{a.finish}</Td>
                <Td className="text-right tabular-nums">{a.duration}d</Td>
                <Td>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          a.status === "complete" ? "bg-emerald-500" :
                            a.status === "delayed" ? "bg-amber-500" :
                              a.isCritical ? "bg-red-500" : "bg-primary",
                        )}
                        style={{ width: `${a.progress}%` }}
                      />
                    </div>
                    <span className="w-7 text-right tabular-nums text-[10px] text-muted-foreground">{a.progress}%</span>
                  </div>
                </Td>
                <Td className={cn("text-right tabular-nums", a.float === 0 && "font-semibold text-red-500")}>
                  {a.isGroup ? "—" : `${a.float}d`}
                </Td>
                <Td className="truncate font-mono text-[10px] text-muted-foreground">{a.predecessors.join(", ") || "—"}</Td>
                <Td>
                  <span className={cn("inline-flex items-center gap-1", S.cls)}>
                    <Icon className="h-3 w-3" />
                    <span className="text-[10px] capitalize">{a.status.replace("-", " ")}</span>
                  </span>
                </Td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return <th className={cn("border-b border-border bg-card px-2 py-2 font-semibold", className)}>{children}</th>;
}
function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={cn("px-2 align-middle", className)}>{children}</td>;
}
