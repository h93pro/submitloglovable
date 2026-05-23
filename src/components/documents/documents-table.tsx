import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel,
  getSortedRowModel, useReactTable, type ColumnDef, type SortingState,
} from "@tanstack/react-table";
import {
  ArrowUpDown, ChevronLeft, ChevronRight, Search, Filter, Download,
  FileSpreadsheet, MoreHorizontal, AlertTriangle,
} from "lucide-react";
import type { SubmittalDoc, DocStatus } from "@/lib/mock-data";
import { StatusBadge } from "./status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const statuses: DocStatus[] = ["SUBMITTED", "APPROVED", "APPROVED AS NOTED", "REVISE & RESUBMIT", "REJECTED", "VOID"];

export function DocumentsTable({ data, basePath }: { data: SubmittalDoc[]; basePath: string }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Set<DocStatus>>(new Set());
  const [rowSelection, setRowSelection] = useState({});

  const columns = useMemo<ColumnDef<SubmittalDoc>[]>(() => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
          aria-label="Select row"
          onClick={(e) => e.stopPropagation()}
        />
      ),
      size: 32,
    },
    {
      accessorKey: "code",
      header: ({ column }) => <SortBtn col={column} label="Code" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.overdue && <AlertTriangle className="h-3 w-3 text-destructive" />}
          <span className="font-mono text-[12px] font-medium">{row.original.code}</span>
        </div>
      ),
    },
    {
      accessorKey: "title",
      header: ({ column }) => <SortBtn col={column} label="Title" />,
      cell: ({ row }) => (
        <Link
          to={`${basePath}/$id`}
          params={{ id: row.original.id }}
          className="text-[13px] font-medium hover:text-primary"
        >
          {row.original.title}
        </Link>
      ),
    },
    { accessorKey: "supplier", header: "Supplier", cell: ({ getValue }) => <span className="text-[12.5px] text-muted-foreground">{getValue() as string}</span> },
    { accessorKey: "discipline", header: "Discipline", cell: ({ getValue }) => <span className="text-[12.5px]">{getValue() as string}</span> },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => <StatusBadge status={getValue() as DocStatus} />,
    },
    {
      accessorKey: "submitDate",
      header: ({ column }) => <SortBtn col={column} label="Submitted" />,
      cell: ({ getValue }) => <span className="text-[12px] tabular-nums text-muted-foreground">{getValue() as string}</span>,
    },
    {
      accessorKey: "replyDate",
      header: "Reply",
      cell: ({ getValue }) => {
        const v = getValue() as string | null;
        return <span className="text-[12px] tabular-nums text-muted-foreground">{v ?? "—"}</span>;
      },
    },
    {
      accessorKey: "revision",
      header: "Rev",
      cell: ({ getValue }) => <span className="font-mono text-[12px]">r{getValue() as number}</span>,
    },
    {
      id: "actions",
      cell: () => (
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => e.stopPropagation()}>
          <MoreHorizontal className="h-3.5 w-3.5" />
        </Button>
      ),
      size: 40,
    },
  ], [basePath]);

  const filtered = useMemo(() => {
    return data.filter((d) => {
      if (statusFilter.size && !statusFilter.has(d.status)) return false;
      if (search) {
        const q = search.toLowerCase();
        return d.code.toLowerCase().includes(q) || d.title.toLowerCase().includes(q) || d.supplier.toLowerCase().includes(q);
      }
      return true;
    });
  }, [data, search, statusFilter]);

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting, rowSelection },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 12 } },
  });

  const selectedCount = Object.keys(rowSelection).length;

  return (
    <div className="flex flex-col gap-3">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search code, title, supplier…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-72 pl-7 text-[12.5px]"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-[12.5px]">
              <Filter className="h-3.5 w-3.5" />
              Status
              {statusFilter.size > 0 && (
                <span className="ml-1 rounded bg-primary/15 px-1.5 text-[10px] font-semibold text-primary">{statusFilter.size}</span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {statuses.map((s) => (
              <DropdownMenuCheckboxItem
                key={s}
                checked={statusFilter.has(s)}
                onCheckedChange={(v) => {
                  const next = new Set(statusFilter);
                  if (v) next.add(s); else next.delete(s);
                  setStatusFilter(next);
                }}
              >
                <StatusBadge status={s} className="text-[10px]" />
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex-1" />

        {selectedCount > 0 && (
          <span className="text-[12px] text-muted-foreground">{selectedCount} selected</span>
        )}

        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-[12.5px]">
          <FileSpreadsheet className="h-3.5 w-3.5" /> Export Excel
        </Button>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-[12.5px]">
          <Download className="h-3.5 w-3.5" /> Export CSV
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="scrollbar-thin max-h-[calc(100vh-280px)] overflow-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="sticky top-0 z-10 bg-muted/50 backdrop-blur">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="border-b border-border">
                  {hg.headers.map((h) => (
                    <th key={h.id} className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="px-3 py-16 text-center text-[13px] text-muted-foreground">
                    No documents match your filters.
                  </td>
                </tr>
              )}
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    "group border-b border-border/60 transition-colors hover:bg-accent/40",
                    row.original.overdue && "bg-destructive/[0.03]",
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-2.5">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-border bg-muted/30 px-3 py-2 text-[12px] text-muted-foreground">
          <div>
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}–
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              filtered.length,
            )} of {filtered.length}
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}>
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span className="px-2 text-[12px]">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <Button variant="ghost" size="icon" className="h-7 w-7" disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SortBtn({ col, label }: { col: any; label: string }) {
  return (
    <button onClick={() => col.toggleSorting(col.getIsSorted() === "asc")} className="inline-flex items-center gap-1 hover:text-foreground">
      {label}
      <ArrowUpDown className="h-3 w-3 opacity-60" />
    </button>
  );
}
