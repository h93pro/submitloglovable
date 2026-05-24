import { createFileRoute } from "@tanstack/react-router";
import {
  Building2, FileText, KeyRound, Sparkles, UserCog, Bot,
  Bell, Palette, DatabaseBackup, ShieldCheck, Save, RotateCcw,
  HelpCircle, CheckCircle2, AlertTriangle, Plug, ChevronRight,
  Smartphone, Download, Upload, RefreshCw, Trash2, WifiOff, Cloud, HardDrive, Clock,
} from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useBlocker } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — SubmitLog" }] }),
  component: SettingsPage,
});

/* ─────────── Dirty-state tracking ─────────── */

type DirtyCtx = {
  dirty: Set<string>;
  markDirty: (id: string) => void;
  clearAll: () => void;
};
const DirtyContext = createContext<DirtyCtx | null>(null);
const useDirty = () => useContext(DirtyContext)!;

type Section = {
  id: string;
  label: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  render: () => React.ReactNode;
};

const sections: Section[] = [
  { id: "company", label: "Company Info", description: "Organization identity, branding and locale", Icon: Building2, render: () => <CompanyInfo /> },
  { id: "document-defaults", label: "Document Defaults", description: "Numbering, revisions and workflow defaults", Icon: FileText, render: () => <DocumentDefaults /> },
  { id: "password-rules", label: "Password Rules", description: "Password strength and rotation policy", Icon: KeyRound, render: () => <PasswordRules /> },
  { id: "ai", label: "AI Provider", description: "Model, API keys and AI-assisted features", Icon: Sparkles, badge: "Beta", render: () => <AIProvider /> },
  { id: "primary-admin", label: "Primary Admin", description: "Account responsible for billing and ownership", Icon: UserCog, render: () => <PrimaryAdmin /> },
  { id: "whatsapp", label: "WhatsApp Bot", description: "Field reporting bot configuration", Icon: Bot, render: () => <WhatsAppBot /> },
  { id: "notifications", label: "Notifications", description: "Email, push and digest preferences", Icon: Bell, render: () => <Notifications /> },
  { id: "appearance", label: "Appearance & Theme", description: "Layout density, theme and tables", Icon: Palette, render: () => <Appearance /> },
  { id: "pwa", label: "PWA & Offline", description: "Install, offline sync and background updates", Icon: Smartphone, badge: "New", render: () => <PWAOffline /> },
  { id: "backup", label: "Backup & System", description: "Snapshots, retention, exports and restore", Icon: DatabaseBackup, render: () => <BackupSystem /> },
  { id: "security", label: "Security & Access Logs", description: "Sessions, SSO and audit trail", Icon: ShieldCheck, render: () => <SecurityLogs /> },
];

function SettingsPage() {
  const [active, setActive] = useState(sections[0].id);

  const handleSave = () => toast.success("Settings saved", { description: "Your changes are now live across the organization." });
  const handleReset = () => toast("Reverted to last saved", { icon: <RotateCcw className="h-4 w-4" /> });

  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-full bg-background">
        {/* Page header */}
        <div className="border-b border-border bg-card/50">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-4 px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h1 className="text-[20px] font-semibold tracking-tight">Workspace settings</h1>
                <p className="text-[12.5px] text-muted-foreground">
                  Configure how SubmitLog works for your organization. Changes apply to all members.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={handleReset}>
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </Button>
              <Button size="sm" className="h-8 gap-1.5" onClick={handleSave}>
                <Save className="h-3.5 w-3.5" /> Save changes
              </Button>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6">
          {/* Desktop: sticky side nav + content */}
          <div className="hidden lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-8">
            <aside className="sticky top-[72px] h-[calc(100vh-96px)] overflow-y-auto pr-2">
              <nav className="flex flex-col gap-0.5">
                {sections.map((s) => {
                  const Icon = s.Icon;
                  const isActive = active === s.id;
                  return (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setActive(s.id);
                        document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                      className={cn(
                        "group flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-medium transition-colors",
                        "text-muted-foreground hover:bg-accent hover:text-foreground",
                        isActive && "bg-accent text-foreground",
                      )}
                    >
                      <Icon className={cn("h-4 w-4 shrink-0", isActive && "text-primary")} />
                      <span className="flex-1 truncate">{s.label}</span>
                      {s.badge && (
                        <Badge variant="secondary" className="h-4 px-1.5 text-[9px]">{s.badge}</Badge>
                      )}
                      <ChevronRight className={cn("h-3.5 w-3.5 opacity-0 transition", isActive && "opacity-100 text-primary")} />
                    </a>
                  );
                })}
              </nav>
            </aside>

            <div className="min-w-0 space-y-6">
              {sections.map((s) => (
                <SettingsCard key={s.id} section={s} />
              ))}
            </div>
          </div>

          {/* Mobile / tablet: accordion */}
          <div className="lg:hidden">
            <Accordion type="single" collapsible defaultValue={sections[0].id} className="space-y-2">
              {sections.map((s) => {
                const Icon = s.Icon;
                return (
                  <AccordionItem
                    key={s.id}
                    value={s.id}
                    className="rounded-xl border border-border bg-card px-4"
                  >
                    <AccordionTrigger className="py-3 hover:no-underline">
                      <div className="flex min-w-0 items-center gap-3 text-left">
                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[13.5px] font-semibold">{s.label}</span>
                            {s.badge && <Badge variant="secondary" className="h-4 px-1.5 text-[9px]">{s.badge}</Badge>}
                          </div>
                          <p className="truncate text-[11.5px] font-normal text-muted-foreground">{s.description}</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 pt-1">
                      <div className="space-y-5">{s.render()}</div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </div>

        {/* Sticky mobile save bar */}
        <div className="sticky bottom-0 z-20 border-t border-border bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center gap-2 pb-[env(safe-area-inset-bottom)]">
            <Button variant="outline" size="sm" className="h-9 flex-1 gap-1.5" onClick={handleReset}>
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </Button>
            <Button size="sm" className="h-9 flex-1 gap-1.5" onClick={handleSave}>
              <Save className="h-3.5 w-3.5" /> Save changes
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

/* ─────────── Reusable building blocks ─────────── */

function SettingsCard({ section }: { section: Section }) {
  const Icon = section.Icon;
  return (
    <section id={section.id} className="scroll-mt-24 rounded-xl border border-border bg-card shadow-sm">
      <header className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[14.5px] font-semibold tracking-tight">{section.label}</h2>
              {section.badge && <Badge variant="secondary" className="h-4 px-1.5 text-[9px]">{section.badge}</Badge>}
            </div>
            <p className="text-[12.5px] text-muted-foreground">{section.description}</p>
          </div>
        </div>
      </header>
      <div className="space-y-5 p-5">{section.render()}</div>
    </section>
  );
}

function Row({
  label, hint, children, control,
}: {
  label: string;
  hint?: string;
  children?: React.ReactNode;
  control?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <div className="min-w-0 max-w-prose">
        <div className="flex items-center gap-1.5">
          <Label className="text-[13px] font-medium">{label}</Label>
          {hint && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="text-muted-foreground/70 hover:text-foreground">
                  <HelpCircle className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-[12px]">{hint}</TooltipContent>
            </Tooltip>
          )}
        </div>
        {children && <p className="mt-0.5 text-[12px] text-muted-foreground">{children}</p>}
      </div>
      <div className="w-full shrink-0 sm:w-[280px]">{control}</div>
    </div>
  );
}

function RowDivider() {
  return <Separator className="my-1" />;
}

/* ─────────── Section bodies ─────────── */

function CompanyInfo() {
  return (
    <>
      <Row label="Organization name" control={<Input defaultValue="Acme Construction Co" />}>
        Displayed on documents, reports and shared links.
      </Row>
      <RowDivider />
      <Row label="Legal entity" control={<Input defaultValue="Acme Construction LLC" />}>
        Used on contracts and tender submissions.
      </Row>
      <RowDivider />
      <Row label="Headquarters address" control={<Textarea rows={2} defaultValue="500 Madison Ave, New York, NY 10022" />} />
      <RowDivider />
      <Row label="Time zone" hint="All due dates and timestamps render in this zone unless overridden by a project."
        control={
          <Select defaultValue="ny">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ny">America / New York (UTC−5)</SelectItem>
              <SelectItem value="la">America / Los Angeles (UTC−8)</SelectItem>
              <SelectItem value="lon">Europe / London (UTC+0)</SelectItem>
              <SelectItem value="dxb">Asia / Dubai (UTC+4)</SelectItem>
            </SelectContent>
          </Select>
        } />
    </>
  );
}

function DocumentDefaults() {
  return (
    <>
      <Row label="Project code prefix" hint="Prefixed to every new document code, e.g. ACM-SUB-0001."
        control={<Input defaultValue="ACM" />} />
      <RowDivider />
      <Row label="Submittal sequence start" control={<Input defaultValue="0001" />} />
      <RowDivider />
      <Row label="Auto-increment on revision"
        control={<div className="flex items-center justify-end"><Switch defaultChecked /></div>}>
        Each revision bumps the document code by one minor version.
      </Row>
      <RowDivider />
      <Row label="Default reviewer" control={
        <Select defaultValue="lead">
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="lead">Project Lead</SelectItem>
            <SelectItem value="qa">QA Manager</SelectItem>
            <SelectItem value="pm">Project Manager</SelectItem>
          </SelectContent>
        </Select>
      } />
    </>
  );
}

function PasswordRules() {
  return (
    <>
      <Row label="Minimum length" control={<Input type="number" defaultValue={12} />}>
        Recommended: 12+ characters.
      </Row>
      <RowDivider />
      <Row label="Require uppercase, number & symbol"
        control={<div className="flex items-center justify-end"><Switch defaultChecked /></div>} />
      <RowDivider />
      <Row label="Rotate every (days)" hint="Set to 0 to disable mandatory rotation."
        control={<Input type="number" defaultValue={90} />} />
      <RowDivider />
      <Row label="Block reused passwords"
        control={<div className="flex items-center justify-end"><Switch defaultChecked /></div>}>
        Prevents reusing the last 5 passwords.
      </Row>
    </>
  );
}

function AIProvider() {
  return (
    <>
      <Row label="Provider" control={
        <Select defaultValue="lovable">
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="lovable">Lovable AI Gateway</SelectItem>
            <SelectItem value="openai">OpenAI</SelectItem>
            <SelectItem value="anthropic">Anthropic</SelectItem>
            <SelectItem value="azure">Azure OpenAI</SelectItem>
          </SelectContent>
        </Select>
      }>
        Powers summaries, suggestion replies and document classification.
      </Row>
      <RowDivider />
      <Row label="Default model" control={
        <Select defaultValue="gpt-4o-mini">
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-4o-mini">gpt-4o-mini · fast</SelectItem>
            <SelectItem value="gpt-4o">gpt-4o · balanced</SelectItem>
            <SelectItem value="claude-sonnet">claude-sonnet · reasoning</SelectItem>
          </SelectContent>
        </Select>
      } />
      <RowDivider />
      <Row label="API key" hint="Stored encrypted. Only the last 4 characters are visible."
        control={<Input type="password" defaultValue="sk-live-••••7421" />} />
      <RowDivider />
      <Row label="Enable AI document summary"
        control={<div className="flex items-center justify-end"><Switch defaultChecked /></div>} />
    </>
  );
}

function PrimaryAdmin() {
  return (
    <>
      <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 p-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary/15 text-[12px] font-semibold text-primary">SC</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[13px] font-semibold">
            Sarah Chen
            <Badge variant="secondary" className="h-4 px-1.5 text-[9px]">Owner</Badge>
          </div>
          <div className="truncate text-[11.5px] text-muted-foreground">sarah.chen@acme.co · +1 (212) 555-0114</div>
        </div>
        <Button size="sm" variant="outline" className="h-8 text-[12px]">Transfer</Button>
      </div>
      <Row label="Backup contact email" hint="Receives ownership recovery emails."
        control={<Input type="email" defaultValue="ops@acme.co" />} />
      <RowDivider />
      <Row label="Require admin approval for new members"
        control={<div className="flex items-center justify-end"><Switch defaultChecked /></div>} />
    </>
  );
}

function WhatsAppBot() {
  return (
    <>
      <div className="flex items-start gap-3 rounded-lg border border-success/30 bg-success/5 p-3">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
        <div className="text-[12.5px]">
          <div className="font-medium">Bot is connected</div>
          <div className="text-muted-foreground">+1 (415) 555-0104 · 1,284 messages this week</div>
        </div>
      </div>
      <Row label="Bot phone number" control={<Input defaultValue="+1 (415) 555-0104" />} />
      <RowDivider />
      <Row label="Webhook URL" hint="Where WhatsApp Cloud API will deliver events."
        control={<Input defaultValue="https://submitlog.app/api/public/wa-webhook" />} />
      <RowDivider />
      <Row label="Auto-create daily reports"
        control={<div className="flex items-center justify-end"><Switch defaultChecked /></div>}>
        Site updates sent to the bot are converted into draft daily reports.
      </Row>
      <RowDivider />
      <Row label="Severity threshold" control={
        <Select defaultValue="medium">
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low — all messages</SelectItem>
            <SelectItem value="medium">Medium — flagged issues</SelectItem>
            <SelectItem value="high">High — incidents only</SelectItem>
          </SelectContent>
        </Select>
      } />
    </>
  );
}

function Notifications() {
  const items = [
    ["Document approved", true],
    ["Revision requested", true],
    ["Comment mentions me", true],
    ["Overdue digest (daily 8am)", true],
    ["Weekly summary", false],
    ["Tender deadline reminders", true],
  ] as const;
  return (
    <>
      <div className="grid gap-2 sm:grid-cols-2">
        {items.map(([label, checked]) => (
          <label key={label} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
            <span className="text-[13px]">{label}</span>
            <Switch defaultChecked={checked} />
          </label>
        ))}
      </div>
      <RowDivider />
      <Row label="Email delivery address" control={<Input type="email" defaultValue="sarah.chen@acme.co" />} />
      <RowDivider />
      <Row label="Push to mobile app"
        control={<div className="flex items-center justify-end"><Switch defaultChecked /></div>} />
    </>
  );
}

function Appearance() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  return (
    <>
      <Row label="Theme" control={
        <div className="grid grid-cols-3 gap-1.5 rounded-md border border-border bg-muted/40 p-1">
          {(["light", "dark", "system"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={cn(
                "rounded px-2 py-1.5 text-[12px] capitalize transition",
                theme === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      } />
      <RowDivider />
      <Row label="Density" control={
        <Select defaultValue="comfortable">
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="compact">Compact</SelectItem>
            <SelectItem value="comfortable">Comfortable</SelectItem>
            <SelectItem value="spacious">Spacious</SelectItem>
          </SelectContent>
        </Select>
      } />
      <RowDivider />
      <Row label="Sticky table headers"
        control={<div className="flex items-center justify-end"><Switch defaultChecked /></div>} />
      <RowDivider />
      <Row label="Show document codes in tables"
        control={<div className="flex items-center justify-end"><Switch defaultChecked /></div>} />
    </>
  );
}

function PWAOffline() {
  const [installable] = useState(true);
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Install state" value={installable ? "Available" : "Installed"} hint="Add to home screen" Icon={Smartphone} tone="info" />
        <Stat label="Offline cache" value="84 MB" hint="of 500 MB limit" Icon={HardDrive} tone="success" />
        <Stat label="Last sync" value="3m ago" hint="Wi-Fi · auto" Icon={RefreshCw} tone="success" />
      </div>

      <Row label="Enable offline mode" control={
        <div className="flex items-center justify-end"><Switch defaultChecked /></div>
      }>
        Cache documents, RFIs and project data so field teams can keep working without a connection.
      </Row>
      <RowDivider />
      <Row label="Install as app" control={
        <Button variant="outline" size="sm" className="h-9 w-full gap-1.5">
          <Download className="h-3.5 w-3.5" /> Install SubmitLog
        </Button>
      }>
        Adds SubmitLog to the home screen on iOS, Android and desktop browsers.
      </Row>
      <RowDivider />
      <Row label="Background sync" control={
        <Select defaultValue="wifi">
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="always">Always (Wi-Fi + cellular)</SelectItem>
            <SelectItem value="wifi">Wi-Fi only</SelectItem>
            <SelectItem value="manual">Manual only</SelectItem>
          </SelectContent>
        </Select>
      }>
        Choose when queued updates should upload from the device.
      </Row>
      <RowDivider />
      <Row label="Sync interval" control={
        <Select defaultValue="5">
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Every minute</SelectItem>
            <SelectItem value="5">Every 5 minutes</SelectItem>
            <SelectItem value="15">Every 15 minutes</SelectItem>
            <SelectItem value="60">Hourly</SelectItem>
          </SelectContent>
        </Select>
      } />
      <RowDivider />
      <Row label="Offline storage limit" control={
        <Select defaultValue="500">
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="250">250 MB</SelectItem>
            <SelectItem value="500">500 MB</SelectItem>
            <SelectItem value="1024">1 GB</SelectItem>
            <SelectItem value="2048">2 GB</SelectItem>
          </SelectContent>
        </Select>
      } />
      <RowDivider />
      <Row label="Cache attachments" control={
        <div className="flex items-center justify-end"><Switch /></div>
      }>
        Drawings, PDFs and photos. Increases storage use significantly.
      </Row>
      <RowDivider />
      <Row label="Auto-update app" control={
        <div className="flex items-center justify-end"><Switch defaultChecked /></div>
      }>
        Quietly install new versions in the background and apply on next launch.
      </Row>
      <RowDivider />
      <Row label="Push notifications" control={
        <div className="flex items-center justify-end"><Switch defaultChecked /></div>
      }>
        Approvals, mentions and overdue items pushed to installed devices.
      </Row>

      <div className="rounded-lg border border-border bg-muted/30 p-3">
        <div className="mb-2 flex items-center gap-2">
          <WifiOff className="h-3.5 w-3.5 text-muted-foreground" />
          <h4 className="text-[12.5px] font-semibold">Pending offline queue</h4>
          <Badge variant="secondary" className="ml-auto h-5 text-[10px]">7 items</Badge>
        </div>
        <p className="mb-3 text-[11.5px] text-muted-foreground">
          Changes captured while offline are uploaded automatically when a connection is restored.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" className="h-8 gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" /> Sync now
          </Button>
          <Button size="sm" variant="outline" className="h-8 gap-1.5">
            <Cloud className="h-3.5 w-3.5" /> View queue
          </Button>
          <Button size="sm" variant="ghost" className="h-8 gap-1.5 text-destructive">
            <Trash2 className="h-3.5 w-3.5" /> Clear cache
          </Button>
        </div>
      </div>
    </>
  );
}

function BackupSystem() {
  const snapshots = [
    { id: "s1", name: "Daily automatic", when: "Today, 03:00", size: "1.2 GB", type: "Auto" },
    { id: "s2", name: "Pre-migration snapshot", when: "Yesterday, 14:22", size: "1.2 GB", type: "Manual" },
    { id: "s3", name: "Weekly rollup", when: "Sun, 03:00", size: "1.1 GB", type: "Auto" },
    { id: "s4", name: "Quarter close", when: "Sep 30, 23:59", size: "980 MB", type: "Manual" },
  ];
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Last backup" value="2h ago" hint="Automatic · healthy" Icon={CheckCircle2} tone="success" />
        <Stat label="Storage used" value="42.7 GB" hint="of 200 GB" Icon={DatabaseBackup} tone="info" />
        <Stat label="Next snapshot" value="In 9h 12m" hint="Daily · 03:00 UTC" Icon={Clock} tone="info" />
      </div>

      <Row label="Backup frequency" control={
        <Select defaultValue="daily">
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="hourly">Hourly</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
          </SelectContent>
        </Select>
      }>
        Automated snapshot of the entire workspace including documents, attachments and audit history.
      </Row>
      <RowDivider />
      <Row label="Retention policy" control={
        <Select defaultValue="90">
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="30">30 days</SelectItem>
            <SelectItem value="90">90 days</SelectItem>
            <SelectItem value="180">180 days</SelectItem>
            <SelectItem value="365">1 year</SelectItem>
            <SelectItem value="forever">Forever</SelectItem>
          </SelectContent>
        </Select>
      }>
        Snapshots older than the retention window are permanently deleted.
      </Row>
      <RowDivider />
      <Row label="Long-term archive" control={
        <div className="flex items-center justify-end"><Switch defaultChecked /></div>
      }>
        Keep monthly snapshots in cold storage for 7 years for regulatory compliance.
      </Row>
      <RowDivider />
      <Row label="Backup region" control={
        <Select defaultValue="eu-west">
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="eu-west">EU West (Ireland)</SelectItem>
            <SelectItem value="us-east">US East (Virginia)</SelectItem>
            <SelectItem value="ap-south">Asia Pacific (Singapore)</SelectItem>
          </SelectContent>
        </Select>
      } />
      <RowDivider />
      <Row label="Encryption at rest" control={
        <div className="flex items-center justify-end gap-2">
          <Badge variant="secondary" className="h-5 gap-1 text-[10px]">
            <ShieldCheck className="h-3 w-3" /> AES-256
          </Badge>
          <Switch defaultChecked disabled />
        </div>
      } />

      <Separator />

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-[12.5px] font-semibold">Manual actions</h4>
          <Badge variant="outline" className="text-[10px]">Audit logged</Badge>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <Button variant="outline" size="sm" className="h-9 justify-start gap-2">
            <DatabaseBackup className="h-3.5 w-3.5" /> Create snapshot now
          </Button>
          <Button variant="outline" size="sm" className="h-9 justify-start gap-2">
            <Download className="h-3.5 w-3.5" /> Download full export (.zip)
          </Button>
          <Button variant="outline" size="sm" className="h-9 justify-start gap-2">
            <FileText className="h-3.5 w-3.5" /> Export documents (.csv)
          </Button>
          <Button variant="outline" size="sm" className="h-9 justify-start gap-2">
            <Upload className="h-3.5 w-3.5" /> Restore from snapshot
          </Button>
        </div>
        <p className="mt-2 text-[11.5px] text-muted-foreground">
          Exports include all documents, projects, attachments and audit logs scoped to your workspace.
        </p>
      </div>

      <div className="rounded-lg border border-border">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <div className="flex items-center gap-2">
            <DatabaseBackup className="h-3.5 w-3.5 text-muted-foreground" />
            <h4 className="text-[12.5px] font-semibold">Recent snapshots</h4>
          </div>
          <Button variant="ghost" size="sm" className="h-7 text-[11.5px]">View all</Button>
        </div>
        <ul className="divide-y divide-border">
          {snapshots.map((s) => (
            <li key={s.id} className="flex items-center gap-3 px-3 py-2.5 text-[12px]">
              <div className="grid h-7 w-7 place-items-center rounded-md bg-muted text-muted-foreground">
                <DatabaseBackup className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">{s.name}</div>
                <div className="text-[11px] text-muted-foreground">{s.when} · {s.size}</div>
              </div>
              <Badge variant="secondary" className="hidden h-5 text-[10px] sm:inline-flex">{s.type}</Badge>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="Download"><Download className="h-3.5 w-3.5" /></Button>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="Restore"><RotateCcw className="h-3.5 w-3.5" /></Button>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive" title="Delete"><Trash2 className="h-3.5 w-3.5" /></Button>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
        <div className="flex items-start gap-2">
          <AlertTriangle className="mt-0.5 h-4 w-4 text-destructive" />
          <div className="flex-1">
            <h4 className="text-[12.5px] font-semibold text-destructive">Danger zone</h4>
            <p className="mt-0.5 text-[11.5px] text-muted-foreground">
              Permanently purge all snapshots older than the retention policy. This cannot be undone.
            </p>
          </div>
          <Button variant="destructive" size="sm" className="h-8 gap-1.5">
            <Trash2 className="h-3.5 w-3.5" /> Purge now
          </Button>
        </div>
      </div>
    </>
  );
}

function SecurityLogs() {
  const logs = [
    { who: "Sarah Chen", what: "Updated password policy", when: "2 minutes ago", ip: "73.42.18.9", ok: true },
    { who: "Marcus Webb", what: "Signed in", when: "1 hour ago", ip: "98.110.4.21", ok: true },
    { who: "Unknown", what: "Failed sign-in attempt", when: "3 hours ago", ip: "203.0.113.7", ok: false },
    { who: "Priya Shah", what: "Connected Procore integration", when: "Yesterday", ip: "73.42.18.9", ok: true },
  ];
  return (
    <>
      <Row label="Require SSO"
        control={<div className="flex items-center justify-end"><Switch /></div>}>
        When enabled, members must sign in through your identity provider.
      </Row>
      <RowDivider />
      <Row label="Enforce 2FA for admins"
        control={<div className="flex items-center justify-end"><Switch defaultChecked /></div>} />
      <RowDivider />
      <Row label="Session timeout (minutes)" control={<Input type="number" defaultValue={60} />} />

      <div className="rounded-lg border border-border">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <div className="flex items-center gap-2">
            <Plug className="h-3.5 w-3.5 text-muted-foreground" />
            <h4 className="text-[12.5px] font-semibold">Recent activity</h4>
          </div>
          <Button variant="ghost" size="sm" className="h-7 text-[11.5px]">View all</Button>
        </div>
        <ul className="divide-y divide-border">
          {logs.map((l, i) => (
            <li key={i} className="flex items-center gap-3 px-3 py-2.5">
              <div className={cn(
                "grid h-7 w-7 shrink-0 place-items-center rounded-full",
                l.ok ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive",
              )}>
                {l.ok ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[12.5px] font-medium">{l.what}</div>
                <div className="truncate text-[11px] text-muted-foreground">{l.who} · {l.ip}</div>
              </div>
              <div className="shrink-0 text-[11px] text-muted-foreground">{l.when}</div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function Stat({
  label, value, hint, Icon, tone,
}: {
  label: string; value: string; hint: string;
  Icon: React.ComponentType<{ className?: string }>;
  tone: "success" | "info" | "warning";
}) {
  const toneCls = tone === "success" ? "bg-success/15 text-success"
    : tone === "warning" ? "bg-warning/15 text-warning-foreground"
    : "bg-info/15 text-info";
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="flex items-center justify-between">
        <span className="text-[11.5px] uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className={cn("grid h-6 w-6 place-items-center rounded-md", toneCls)}>
          <Icon className="h-3.5 w-3.5" />
        </span>
      </div>
      <div className="mt-1.5 text-[18px] font-semibold tracking-tight">{value}</div>
      <div className="text-[11px] text-muted-foreground">{hint}</div>
    </div>
  );
}
