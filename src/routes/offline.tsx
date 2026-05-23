import { createFileRoute, Link } from "@tanstack/react-router";
import { WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/offline")({
  head: () => ({ meta: [{ title: "Offline — SubmitLog" }] }),
  component: () => (
    <div className="grid min-h-[70vh] place-items-center px-6">
      <div className="max-w-md text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-muted text-muted-foreground"><WifiOff className="h-6 w-6" /></div>
        <h1 className="mt-4 text-[20px] font-semibold tracking-tight">You're offline</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Recent documents and drafts are still available. New uploads will sync automatically when you reconnect.
        </p>
        <div className="mt-5 flex justify-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-[12.5px]" onClick={() => location.reload()}>
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </Button>
          <Link to="/"><Button size="sm" className="h-8 text-[12.5px]">Back to dashboard</Button></Link>
        </div>
        <div className="mt-6 rounded-lg border border-border bg-card p-3 text-left text-[12px]">
          <div className="font-semibold">Pending sync</div>
          <ul className="mt-1 space-y-1 text-muted-foreground">
            <li>· 2 daily reports drafted</li>
            <li>· 1 attachment queued</li>
            <li>· 4 status changes</li>
          </ul>
        </div>
      </div>
    </div>
  ),
});
