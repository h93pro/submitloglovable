import { Search, Bell, Sun, Moon, LayoutGrid, List, ChevronDown, Plus, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme";
import { projects } from "@/lib/mock-data";
import { useState } from "react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
  DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function Topbar({
  onOpenPalette,
  onCreate,
  onOpenMobileNav,
}: {
  onOpenPalette: () => void;
  onCreate: () => void;
  onOpenMobileNav?: () => void;
}) {
  const { theme, toggle } = useTheme();
  const [project, setProject] = useState(projects[0]);
  const [view, setView] = useState<"grid" | "list">("list");

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 sm:gap-3 border-b border-border bg-background/80 px-3 sm:px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {onOpenMobileNav && (
        <Button variant="ghost" size="icon" className="h-8 w-8 md:hidden -ml-1" onClick={onOpenMobileNav} aria-label="Open navigation">
          <Menu className="h-4 w-4" />
        </Button>
      )}
      {/* Project selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2 -ml-1 max-w-[180px] sm:max-w-none">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: project.color }} />
            <span className="truncate text-[13px] font-medium">{project.name}</span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Switch project
          </DropdownMenuLabel>
          {projects.map((p) => (
            <DropdownMenuItem key={p.id} onClick={() => setProject(p)} className="gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
              <span className="flex-1 text-[13px]">{p.name}</span>
              <span className="text-[10px] text-muted-foreground">{p.code}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="mx-1 hidden h-5 w-px bg-border sm:block" />

      {/* Search */}
      <button
        onClick={onOpenPalette}
        className="group hidden sm:flex h-8 max-w-md flex-1 items-center gap-2 rounded-md border border-border bg-muted/40 px-2.5 text-left text-[12.5px] text-muted-foreground transition hover:bg-muted"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="flex-1">Search..</span>
        <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">⌘K</kbd>
      </button>
      <Button variant="ghost" size="icon" className="h-8 w-8 sm:hidden" onClick={onOpenPalette} aria-label="Search">
        <Search className="h-4 w-4" />
      </Button>

      <div className="flex-1 sm:hidden" />

      {/* View toggle */}
      <div className="hidden items-center rounded-md border border-border bg-muted/40 p-0.5 md:flex">
        {(["list", "grid"] as const).map((v) => {
          const Icon = v === "list" ? List : LayoutGrid;
          return (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "grid h-6 w-7 place-items-center rounded text-muted-foreground transition",
                view === v && "bg-background text-foreground shadow-sm",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
            </button>
          );
        })}
      </div>

      <Button size="sm" onClick={onCreate} className="h-8 gap-1.5 px-2 sm:px-2.5 text-[12.5px]">
        <Plus className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">New</span>
      </Button>

      <Button variant="ghost" size="icon" className="hidden sm:inline-flex h-8 w-8" onClick={toggle}>
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>

      <Button variant="ghost" size="icon" className="relative h-8 w-8">
        <Bell className="h-4 w-4" />
        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="ml-1 outline-none">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-primary/15 text-[11px] font-semibold text-primary">SC</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="text-[13px]">Sarah Chen</div>
            <div className="text-[11px] font-normal text-muted-foreground">sarah.chen@acme.co</div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Preferences</DropdownMenuItem>
          <DropdownMenuItem>Keyboard shortcuts</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
