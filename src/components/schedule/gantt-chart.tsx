import * as React from "react";
import { cn } from "@/lib/utils";
import type { ScheduleActivity } from "@/lib/mock-data";

type Zoom = "day" | "week" | "month" | "quarter";

const ROW_H = 30;
const DAY_W: Record<Zoom, number> = { day: 22, week: 8, month: 2.6, quarter: 1.1 };

function toUTC(iso: string) { return new Date(iso + "T00:00:00Z").getTime(); }
function fmtMonth(d: Date) { return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" }); }
function fmtDay(d: Date) { return d.getUTCDate().toString(); }

export function GanttChart({
  activities,
  visibleIds,
  zoom,
  rangeStart,
  rangeEnd,
  showBaseline,
  showCritical,
  highlightId,
  onSelect,
}: {
  activities: ScheduleActivity[];
  visibleIds: string[];
  zoom: Zoom;
  rangeStart: string;
  rangeEnd: string;
  showBaseline: boolean;
  showCritical: boolean;
  highlightId?: string | null;
  onSelect?: (id: string) => void;
}) {
  const dayW = DAY_W[zoom];
  const startMs = toUTC(rangeStart);
  const endMs = toUTC(rangeEnd);
  const totalDays = Math.ceil((endMs - startMs) / 86400000);
  const width = Math.max(totalDays * dayW, 800);
  const today = Date.now();
  const todayX = ((today - startMs) / 86400000) * dayW;

  const rows = visibleIds
    .map((id) => activities.find((a) => a.id === id))
    .filter(Boolean) as ScheduleActivity[];
  const height = rows.length * ROW_H;

  // Build month/week ticks
  const months: { x: number; label: string; w: number }[] = [];
  const sub: { x: number; label: string }[] = [];
  const cursor = new Date(startMs);
  cursor.setUTCDate(1);
  while (cursor.getTime() < endMs) {
    const x = ((cursor.getTime() - startMs) / 86400000) * dayW;
    const next = new Date(cursor);
    next.setUTCMonth(next.getUTCMonth() + 1);
    const w = ((Math.min(next.getTime(), endMs) - cursor.getTime()) / 86400000) * dayW;
    months.push({ x, label: fmtMonth(cursor), w });
    cursor.setTime(next.getTime());
  }
  if (zoom === "day" || zoom === "week") {
    const step = zoom === "day" ? 1 : 7;
    const c2 = new Date(startMs);
    while (c2.getTime() < endMs) {
      const x = ((c2.getTime() - startMs) / 86400000) * dayW;
      sub.push({ x, label: zoom === "day" ? fmtDay(c2) : `W${Math.ceil(((c2.getTime() - startMs) / 86400000 + 1) / 7)}` });
      c2.setUTCDate(c2.getUTCDate() + step);
    }
  }

  const idToRow: Record<string, number> = {};
  rows.forEach((a, i) => { idToRow[a.id] = i; });

  function barFor(a: ScheduleActivity) {
    const s = ((toUTC(a.start) - startMs) / 86400000) * dayW;
    const e = ((toUTC(a.finish) - startMs) / 86400000) * dayW;
    return { x: s, w: Math.max(e - s, 2) };
  }
  function blFor(a: ScheduleActivity) {
    const s = ((toUTC(a.baselineStart) - startMs) / 86400000) * dayW;
    const e = ((toUTC(a.baselineFinish) - startMs) / 86400000) * dayW;
    return { x: s, w: Math.max(e - s, 2) };
  }

  return (
    <div className="relative h-full overflow-auto bg-card">
      <div style={{ width }} className="relative">
        {/* Sticky header */}
        <div className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur">
          <svg width={width} height={44} className="block">
            {months.map((m, i) => (
              <g key={i}>
                <line x1={m.x} y1={0} x2={m.x} y2={44} stroke="hsl(var(--border))" />
                <text x={m.x + 6} y={16} fontSize={10.5} fontWeight={600} fill="hsl(var(--foreground))">{m.label}</text>
              </g>
            ))}
            {sub.map((s, i) => (
              <text key={i} x={s.x + 2} y={34} fontSize={9} fill="hsl(var(--muted-foreground))">{s.label}</text>
            ))}
          </svg>
        </div>

        {/* Body */}
        <svg width={width} height={height} className="block">
          {/* Row stripes */}
          {rows.map((a, i) => (
            <rect key={`s${a.id}`} x={0} y={i * ROW_H} width={width} height={ROW_H}
              fill={i % 2 === 0 ? "transparent" : "hsl(var(--muted) / 0.35)"} />
          ))}
          {/* Vertical month gridlines */}
          {months.map((m, i) => (
            <line key={`g${i}`} x1={m.x} y1={0} x2={m.x} y2={height} stroke="hsl(var(--border) / 0.6)" />
          ))}
          {/* Today line */}
          {todayX > 0 && todayX < width && (
            <g>
              <line x1={todayX} y1={0} x2={todayX} y2={height} stroke="#ef4444" strokeWidth={1.4} strokeDasharray="4 3" />
              <rect x={todayX - 18} y={2} width={36} height={14} rx={3} fill="#ef4444" />
              <text x={todayX} y={12} fontSize={9} fontWeight={700} fill="#fff" textAnchor="middle">TODAY</text>
            </g>
          )}

          {/* Dependency arrows */}
          {rows.map((a) => a.predecessors.map((p) => {
            const from = rows.find((r) => r.activityId === p);
            if (!from) return null;
            const fi = idToRow[from.id];
            const ti = idToRow[a.id];
            if (fi === undefined || ti === undefined) return null;
            const fb = barFor(from);
            const tb = barFor(a);
            const x1 = fb.x + fb.w;
            const y1 = fi * ROW_H + ROW_H / 2;
            const x2 = tb.x;
            const y2 = ti * ROW_H + ROW_H / 2;
            const mx = x1 + 6;
            const stroke = a.isCritical && from.isCritical && showCritical ? "#ef4444" : "hsl(var(--muted-foreground) / 0.55)";
            return (
              <path key={`${from.id}-${a.id}`}
                d={`M${x1},${y1} L${mx},${y1} L${mx},${y2} L${x2 - 2},${y2}`}
                fill="none" stroke={stroke} strokeWidth={1}
                markerEnd="url(#arrow)" />
            );
          }))}

          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0,0 L10,5 L0,10 z" fill="hsl(var(--muted-foreground) / 0.7)" />
            </marker>
            <pattern id="hash" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
              <line x1={0} y1={0} x2={0} y2={6} stroke="rgba(255,255,255,0.25)" strokeWidth={3} />
            </pattern>
          </defs>

          {/* Bars */}
          {rows.map((a, i) => {
            const y = i * ROW_H;
            const { x, w } = barFor(a);
            const bl = blFor(a);
            const isCrit = a.isCritical && showCritical;
            const groupFill = "hsl(var(--foreground))";
            const fill = a.isMilestone
              ? "transparent"
              : a.isGroup
                ? groupFill
                : a.status === "complete"
                  ? "#10b981"
                  : a.status === "delayed"
                    ? "#f59e0b"
                    : isCrit
                      ? "#ef4444"
                      : "#6366f1";
            const isHighlight = highlightId === a.id;
            return (
              <g key={a.id} onClick={() => onSelect?.(a.id)} className="cursor-pointer">
                {/* Highlight row */}
                {isHighlight && <rect x={0} y={y} width={width} height={ROW_H} fill="hsl(var(--primary) / 0.08)" />}

                {/* Baseline */}
                {showBaseline && !a.isMilestone && !a.isGroup && (
                  <rect x={bl.x} y={y + ROW_H - 6} width={bl.w} height={3} rx={1.5}
                    fill="hsl(var(--muted-foreground) / 0.45)" />
                )}

                {a.isMilestone ? (
                  <g transform={`translate(${x},${y + ROW_H / 2}) rotate(45)`}>
                    <rect x={-7} y={-7} width={14} height={14}
                      fill={a.status === "complete" ? "#10b981" : isCrit ? "#ef4444" : "#6366f1"}
                      stroke="hsl(var(--background))" strokeWidth={1.5} />
                  </g>
                ) : a.isGroup ? (
                  <g>
                    <rect x={x} y={y + 9} width={w} height={8} fill={groupFill} rx={1} />
                    <polygon points={`${x},${y + 17} ${x + 5},${y + 22} ${x + 10},${y + 17}`} fill={groupFill} />
                    <polygon points={`${x + w},${y + 17} ${x + w - 5},${y + 22} ${x + w - 10},${y + 17}`} fill={groupFill} />
                  </g>
                ) : (
                  <g>
                    <rect x={x} y={y + 6} width={w} height={ROW_H - 14} rx={3}
                      fill={fill} opacity={0.28} />
                    <rect x={x} y={y + 6} width={(w * a.progress) / 100} height={ROW_H - 14} rx={3}
                      fill={fill} />
                    {a.progress > 0 && a.progress < 100 && (
                      <rect x={x + (w * a.progress) / 100 - 1} y={y + 6} width={2} height={ROW_H - 14}
                        fill="hsl(var(--background))" />
                    )}
                    {/* Float bar */}
                    {a.float > 0 && (
                      <rect x={x + w} y={y + ROW_H / 2 - 1} width={Math.min(a.float * dayW, 60)} height={2}
                        fill="hsl(var(--muted-foreground) / 0.5)" />
                    )}
                  </g>
                )}

                {/* Label after bar */}
                {!a.isGroup && w > 40 && (
                  <text x={x + w + 8} y={y + ROW_H / 2 + 3} fontSize={10}
                    fill="hsl(var(--muted-foreground))">
                    {a.progress}%
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export const GANTT_ROW_H = ROW_H;
