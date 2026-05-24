import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Inbox,
  Loader2,
  Lock,
  RefreshCw,
  ServerCrash,
  Timer,
  Wrench,
  FolderOpen,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/* =========================================================
 * Shared shell — keeps every state visually identical
 * ========================================================= */
function StateShell({
  icon: Icon,
  tone = "muted",
  title,
  description,
  children,
  className,
  compact,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tone?: "muted" | "primary" | "warning" | "destructive" | "success";
  title: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  compact?: boolean;
}) {
  const toneMap: Record<string, string> = {
    muted: "bg-muted text-muted-foreground",
    primary: "bg-primary/10 text-primary",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    destructive: "bg-destructive/10 text-destructive",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  };
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center text-center animate-fade-in",
        compact ? "py-10 px-6" : "py-16 px-6",
        className,
      )}
    >
      <div
        className={cn(
          "mb-4 grid place-items-center rounded-2xl ring-1 ring-border/60",
          compact ? "h-12 w-12" : "h-14 w-14",
          toneMap[tone],
        )}
      >
        <Icon className={compact ? "h-5 w-5" : "h-6 w-6"} />
      </div>
      <h3 className="text-[15px] font-semibold tracking-tight text-foreground">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
      {children && <div className="mt-5 flex flex-wrap items-center justify-center gap-2">{children}</div>}
    </div>
  );
}

/* =========================================================
 * Empty / Search-empty
 * ========================================================= */
export function EmptyState({
  title = "Nothing here yet",
  description = "Once data is created, it will appear in this view.",
  actionLabel,
  onAction,
  compact,
}: {
  title?: string;
  description?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
}) {
  return (
    <StateShell icon={Inbox} title={title} description={description} compact={compact}>
      {actionLabel && (
        <Button size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </StateShell>
  );
}

export function SearchEmptyState({
  query,
  onClear,
}: {
  query?: string;
  onClear?: () => void;
}) {
  return (
    <StateShell
      icon={Search}
      title="No results found"
      description={
        query ? (
          <>
            We couldn't find anything matching{" "}
            <span className="font-medium text-foreground">"{query}"</span>. Try a different keyword
            or clear filters.
          </>
        ) : (
          "Try a different keyword or adjust your filters."
        )
      }
      compact
    >
      {onClear && (
        <Button size="sm" variant="outline" onClick={onClear}>
          Clear filters
        </Button>
      )}
    </StateShell>
  );
}

/* =========================================================
 * Loading
 * ========================================================= */
export function LoadingState({ label = "Loading", compact }: { label?: string; compact?: boolean }) {
  return (
    <StateShell icon={Loader2} tone="primary" title={label} description="One moment please…" compact={compact}>
      <span className="sr-only">{label}</span>
    </StateShell>
  );
}

export function TableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-2 p-3" aria-hidden>
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="grid gap-3 rounded-md border border-border/40 bg-card/60 px-3 py-3"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}
        >
          {Array.from({ length: cols }).map((__, c) => (
            <Skeleton key={c} className="h-3.5" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3 rounded-xl border border-border bg-card p-4">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      ))}
    </div>
  );
}

/* =========================================================
 * Error
 * ========================================================= */
export function ErrorState({
  title = "Something went wrong",
  description = "We hit an unexpected error loading this view. You can retry, or contact support if the issue persists.",
  onRetry,
  compact,
}: {
  title?: string;
  description?: React.ReactNode;
  onRetry?: () => void;
  compact?: boolean;
}) {
  return (
    <StateShell icon={AlertTriangle} tone="destructive" title={title} description={description} compact={compact}>
      {onRetry && (
        <Button size="sm" variant="outline" onClick={onRetry} className="gap-1.5">
          <RefreshCw className="h-3.5 w-3.5" /> Try again
        </Button>
      )}
    </StateShell>
  );
}

/* =========================================================
 * Production app states (full-page)
 * ========================================================= */
function FullPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-[calc(100dvh-4rem)] place-items-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm animate-fade-in">
        {children}
      </div>
    </div>
  );
}

export function UnauthorizedState() {
  return (
    <FullPageShell>
      <StateShell
        icon={Lock}
        tone="warning"
        title="You don't have access"
        description="This area requires additional permissions. If you believe this is a mistake, ask your workspace admin to update your role."
        compact
      >
        <Button asChild size="sm" variant="outline">
          <Link to="/">Back to dashboard</Link>
        </Button>
      </StateShell>
    </FullPageShell>
  );
}

export function SessionExpiredState({ onSignIn }: { onSignIn?: () => void }) {
  return (
    <FullPageShell>
      <StateShell
        icon={Timer}
        tone="warning"
        title="Your session has expired"
        description="For your security, you've been signed out after a period of inactivity. Sign in again to continue where you left off."
        compact
      >
        <Button size="sm" onClick={onSignIn}>
          Sign in again
        </Button>
      </StateShell>
    </FullPageShell>
  );
}

export function ServerErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <FullPageShell>
      <StateShell
        icon={ServerCrash}
        tone="destructive"
        title="Server error"
        description="Our service is temporarily unavailable. We've been notified — please try again in a moment."
        compact
      >
        <Button size="sm" variant="outline" onClick={onRetry} className="gap-1.5">
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
        <Button asChild size="sm" variant="ghost">
          <Link to="/">Go home</Link>
        </Button>
      </StateShell>
    </FullPageShell>
  );
}

export function MaintenanceState() {
  return (
    <FullPageShell>
      <StateShell
        icon={Wrench}
        tone="primary"
        title="Scheduled maintenance"
        description="SubmitLog is briefly offline for a planned upgrade. We'll be back shortly — thanks for your patience."
        compact
      />
    </FullPageShell>
  );
}

export function NoProjectSelectedState({ onSelect }: { onSelect?: () => void }) {
  return (
    <StateShell
      icon={FolderOpen}
      tone="primary"
      title="No project selected"
      description="Pick a project to view its documents, schedule and reports. Your selection is remembered across sessions."
    >
      <Button size="sm" onClick={onSelect}>
        Choose a project
      </Button>
      <Button asChild size="sm" variant="outline">
        <Link to="/projects">Browse projects</Link>
      </Button>
    </StateShell>
  );
}
