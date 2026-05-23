import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard, FolderKanban, Package, PencilRuler, FileCheck2, HelpCircle, Plus, Settings, Bot,
} from "lucide-react";

export function CommandPalette({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: () => void;
}) {
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const go = (to: string) => {
    onOpenChange(false);
    navigate({ to });
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => { onOpenChange(false); onCreate(); }}>
            <Plus className="mr-2 h-4 w-4" /> Create new document
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Navigate">
          <CommandItem onSelect={() => go("/")}><LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</CommandItem>
          <CommandItem onSelect={() => go("/projects")}><FolderKanban className="mr-2 h-4 w-4" /> Projects</CommandItem>
          <CommandItem onSelect={() => go("/documents/material-submittals")}><Package className="mr-2 h-4 w-4" /> Material Submittals</CommandItem>
          <CommandItem onSelect={() => go("/documents/shop-drawings")}><PencilRuler className="mr-2 h-4 w-4" /> Shop Drawings</CommandItem>
          <CommandItem onSelect={() => go("/documents/technical-submittals")}><FileCheck2 className="mr-2 h-4 w-4" /> Technical Submittals</CommandItem>
          <CommandItem onSelect={() => go("/documents/rfis")}><HelpCircle className="mr-2 h-4 w-4" /> RFIs</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Admin">
          <CommandItem onSelect={() => go("/admin/settings")}><Settings className="mr-2 h-4 w-4" /> Settings</CommandItem>
          <CommandItem onSelect={() => go("/admin/whatsapp-bot")}><Bot className="mr-2 h-4 w-4" /> WhatsApp Bot</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
