import * as React from "react";
import {
  Check,
  ChevronDown,
  Columns3,
  Filter,
  Rows3,
  Save,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type Density = "comfortable" | "cozy" | "compact";

export type SavedView = {
  id: string;
  name: string;
  query?: string;
  filters?: Record<string, unknown>;
};

export type ColumnDef = {
  id: string;
  label: string;
  required?: boolean;
};

export function DataTableToolbar({
  search,
  onSearch,
  placeholder = "Search…",
  columns,
  visibleColumns,
  onVisibleColumnsChange,
  density,
  onDensityChange,
  views = [],
  activeViewId,
  onSelectView,
  onSaveView,
  onClearFilters,
  filtersActive,
  children,
  rightSlot,
}: {
  search: string;
  onSearch: (v: string) => void;
  placeholder?: string;
  columns: ColumnDef[];
  visibleColumns: Set<string>;
  onVisibleColumnsChange: (next: Set<string>) => void;
  density: Density;
  onDensityChange: (d: Density) => void;
  views?: SavedView[];
  activeViewId?: string;
  onSelectView?: (id: string) => void;
  onSaveView?: () => void;
  onClearFilters?: () => void;
  filtersActive?: boolean;
  children?: React.ReactNode;
  rightSlot?: React.ReactNode;
}) {
  const activeView = views.find((v) => v.id === activeViewId);
  return (
    <div className="flex flex-col gap-2 border-b border-border bg-card/60 px-3 py-2.5 sm:flex-row sm:items-center">
      {/* Saved view selector */}
      {views.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span className="max-w-[140px] truncate">{activeView?.name ?? "All records"}</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Saved views
            </DropdownMenuLabel>
            {views.map((v) => (
              <DropdownMenuItem
                key={v.id}
                onClick={() => onSelectView?.(v.id)}
                className="flex items-center justify-between"
              >
                <span>{v.name}</span>
                {v.id === activeViewId && <Check className="h-3.5 w-3.5 text-primary" />}
              </DropdownMenuItem>
            ))}
            {onSaveView && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onSaveView} className="gap-2">
                  <Save className="h-3.5 w-3.5" /> Save current view
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Search */}
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={placeholder}
          className="h-8 pl-8 pr-8 text-[13px]"
          aria-label="Search records"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearch("")}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 grid h-5 w-5 -translate-y-1/2 place-items-center rounded text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Extra filter slots */}
      {children}

      {filtersActive && onClearFilters && (
        <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-[12px]" onClick={onClearFilters}>
          <Filter className="h-3.5 w-3.5" /> Clear
          <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">active</Badge>
        </Button>
      )}

      <div className="ml-auto flex items-center gap-1.5">
        {/* Density */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1.5" aria-label="Row density">
              <Rows3 className="h-3.5 w-3.5" />
              <span className="hidden md:inline capitalize">{density}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Density
            </DropdownMenuLabel>
            <DropdownMenuRadioGroup value={density} onValueChange={(v) => onDensityChange(v as Density)}>
              <DropdownMenuRadioItem value="comfortable">Comfortable</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="cozy">Cozy</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="compact">Compact</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Columns */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1.5" aria-label="Toggle columns">
              <Columns3 className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Columns</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Visible columns
            </DropdownMenuLabel>
            {columns.map((c) => (
              <DropdownMenuCheckboxItem
                key={c.id}
                checked={visibleColumns.has(c.id)}
                disabled={c.required}
                onCheckedChange={(checked) => {
                  const next = new Set(visibleColumns);
                  if (checked) next.add(c.id);
                  else next.delete(c.id);
                  onVisibleColumnsChange(next);
                }}
              >
                {c.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {rightSlot}
      </div>
    </div>
  );
}

/* Sticky bulk-action bar */
export function BulkActionBar({
  count,
  onClear,
  children,
}: {
  count: number;
  onClear: () => void;
  children?: React.ReactNode;
}) {
  if (count === 0) return null;
  return (
    <div
      role="region"
      aria-label={`${count} selected`}
      className={cn(
        "sticky bottom-3 z-30 mx-auto flex w-fit max-w-full items-center gap-2 rounded-full",
        "border border-border bg-card/95 px-3 py-1.5 shadow-lg backdrop-blur",
        "animate-fade-in",
      )}
    >
      <Badge className="h-5 rounded-full px-2 text-[11px]">{count}</Badge>
      <span className="text-[12.5px] text-muted-foreground">selected</span>
      <div className="mx-1 h-4 w-px bg-border" />
      {children}
      <Button variant="ghost" size="sm" className="h-7 px-2 text-[12px]" onClick={onClear}>
        <X className="mr-1 h-3.5 w-3.5" /> Clear
      </Button>
    </div>
  );
}

/* Density → padding class helper */
export function densityRowClass(d: Density) {
  return d === "compact" ? "py-1.5 text-[12.5px]" : d === "cozy" ? "py-2.5 text-[13px]" : "py-3.5 text-[13.5px]";
}
