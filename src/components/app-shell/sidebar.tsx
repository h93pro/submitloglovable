import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, FolderKanban, FileSpreadsheet, MessageSquare,
  Package, PencilRuler, FileCheck2, Users, ClipboardCheck, Boxes,
  AlertOctagon, HelpCircle, Clock, Settings, UserCog, Bot, Building2,
  ChevronLeft, Download, HardHat, NotebookPen, BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

type Item = { to: string; label: string; icon: React.ComponentType<{ className?: string }> };

const main: Item[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/tenders", label: "Tenders", icon: FileSpreadsheet },
  { to: "/inquiries", label: "Inquiries", icon: MessageSquare },
  { to: "/daily-reports", label: "Daily Reports", icon: NotebookPen },
  { to: "/schedule", label: "Schedule", icon: BarChart3 },
];

const documents: Item[] = [
  { to: "/documents/material-submittals", label: "Material Submittals", icon: Package },
  { to: "/documents/shop-drawings", label: "Shop Drawings", icon: PencilRuler },
  { to: "/documents/technical-submittals", label: "Technical Submittals", icon: FileCheck2 },
  { to: "/documents/subcontractor-approvals", label: "Subcontractor Approvals", icon: Users },
  { to: "/documents/inspection-requests", label: "Inspection Requests", icon: ClipboardCheck },
  { to: "/documents/material-inspection-requests", label: "Material Inspections", icon: Boxes },
  { to: "/documents/ncrs", label: "Non-Conformance", icon: AlertOctagon },
  { to: "/documents/rfis", label: "RFIs", icon: HelpCircle },
  { to: "/overdue", label: "Overdue", icon: Clock },
];

const admin: Item[] = [
  { to: "/admin/users", label: "Users", icon: UserCog },
  { to: "/admin/projects", label: "Projects", icon: Building2 },
  { to: "/admin/settings", label: "Settings", icon: Settings },
  { to: "/admin/whatsapp-bot", label: "WhatsApp Bot", icon: Bot },
];

function SidebarNav({
  collapsed,
  onNavigate,
}: { collapsed: boolean; onNavigate?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });

  const renderItem = (item: Item) => {
    const Icon = item.icon;
    const active = path === item.to || (item.to !== "/" && path.startsWith(item.to));
    return (
      <Link
        key={item.to}
        to={item.to}
        onClick={onNavigate}
        className={cn(
          "group flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-medium transition-colors",
          "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          active && "bg-sidebar-accent text-sidebar-accent-foreground",
          collapsed && "justify-center px-0",
        )}
        title={collapsed ? item.label : undefined}
      >
        <Icon className={cn("h-4 w-4 shrink-0", active && "text-primary")} />
        {!collapsed && <span className="truncate">{item.label}</span>}
        {!collapsed && active && (
          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
        )}
      </Link>
    );
  };

  const section = (label: string, items: Item[]) => (
    <div className="mb-4">
      {!collapsed && (
        <div className="px-2.5 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          {label}
        </div>
      )}
      <div className="flex flex-col gap-0.5">{items.map(renderItem)}</div>
    </div>
  );

  return (
    <>
      {section("Main", main)}
      {section("Submittals", documents)}
      {section("Admin", admin)}
    </>
  );
}

function Brand({ collapsed }: { collapsed: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2">
      <div className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground">
        <HardHat className="h-4 w-4" />
      </div>
      {!collapsed && (
        <div className="flex flex-col leading-none">
          <span className="text-sm font-semibold tracking-tight">SubmitLog</span>
          <span className="text-[10px] text-muted-foreground">Document Control</span>
        </div>
      )}
    </Link>
  );
}

export function AppSidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen md:flex flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200 ease-out",
        collapsed ? "w-[60px]" : "w-[244px]",
      )}
    >
      <div className={cn("flex h-14 items-center border-b border-sidebar-border px-3", collapsed && "justify-center px-0")}>
        <Brand collapsed={collapsed} />
      </div>

      <nav className="scrollbar-thin flex-1 overflow-y-auto px-2 py-3">
        <SidebarNav collapsed={collapsed} />
      </nav>

      <div className={cn("border-t border-sidebar-border p-2", collapsed && "px-1")}>
        <Button
          variant="ghost"
          size="sm"
          className={cn("w-full justify-start gap-2 text-[12px]", collapsed && "justify-center")}
          title="Install app"
        >
          <Download className="h-3.5 w-3.5" />
          {!collapsed && <span>Install App</span>}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn("mt-1 w-full justify-start gap-2 text-[12px] text-muted-foreground", collapsed && "justify-center")}
          onClick={onToggle}
        >
          <ChevronLeft className={cn("h-3.5 w-3.5 transition-transform", collapsed && "rotate-180")} />
          {!collapsed && <span>Collapse</span>}
        </Button>
      </div>
    </aside>
  );
}

export function MobileSidebar({
  open,
  onOpenChange,
}: { open: boolean; onOpenChange: (o: boolean) => void }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[280px] p-0 bg-sidebar border-sidebar-border">
        <SheetHeader className="h-14 flex-row items-center border-b border-sidebar-border px-3 space-y-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <Brand collapsed={false} />
        </SheetHeader>
        <nav className="scrollbar-thin h-[calc(100dvh-3.5rem)] overflow-y-auto px-2 py-3 pb-[env(safe-area-inset-bottom)]">
          <SidebarNav collapsed={false} onNavigate={() => onOpenChange(false)} />
        </nav>
      </SheetContent>
    </Sheet>
  );
}
