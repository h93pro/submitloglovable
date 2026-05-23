import { createFileRoute, Link } from "@tanstack/react-router";
import { Construction } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ComingSoon({ title, blurb }: { title: string; blurb: string }) {
  return (
    <div className="mx-auto max-w-[1400px] px-6 py-6">
      <h1 className="text-[20px] font-semibold tracking-tight">{title}</h1>
      <p className="mt-0.5 text-[12.5px] text-muted-foreground">{blurb}</p>

      <div className="mt-6 grid min-h-[420px] place-items-center rounded-xl border border-dashed border-border bg-card">
        <div className="max-w-md text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
            <Construction className="h-5 w-5" />
          </div>
          <h2 className="mt-3 text-[15px] font-semibold">Module coming soon</h2>
          <p className="mt-1 text-[12.5px] text-muted-foreground">
            This module shares the same enterprise table, detail, and workflow patterns as Material Submittals.
            We've built the full vertical for that module first.
          </p>
          <Link to="/documents/material-submittals">
            <Button size="sm" className="mt-4 h-8 text-[12.5px]">See the reference module</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Default export used by stub routes — see route files below.
export const Route = createFileRoute("/_coming-soon-helper")({
  component: () => null,
});
