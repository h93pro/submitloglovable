import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Loader2, HardHat, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/change-password")({
  head: () => ({
    meta: [
      { title: "Change password — SubmitLog" },
      { name: "description", content: "Set a new password for your SubmitLog account." },
    ],
  }),
  component: ChangePasswordPage,
});

function ChangePasswordPage() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (next.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (next !== confirm) {
      setError("New passwords do not match.");
      return;
    }
    if (current && current === next) {
      setError("New password must differ from current password.");
      return;
    }

    setLoading(true);
    // Mock submission — no backend wiring yet
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    toast.success("Password changed successfully");
    navigate({ to: "/" });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6 rounded-lg border bg-card p-8 shadow-sm">
        <div className="flex flex-col items-center space-y-3 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <HardHat className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">Change password</h1>
            <p className="text-sm text-muted-foreground">
              Choose a new password to continue using SubmitLog.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="current">Current password</Label>
            <Input
              id="current"
              type="password"
              autoComplete="current-password"
              required
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="next">New password</Label>
            <Input
              id="next"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={next}
              onChange={(e) => setNext(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm new password</Label>
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={loading}
            />
          </div>

          {error ? (
            <p className="text-sm font-medium text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                Updating…
              </>
            ) : (
              "Update password"
            )}
          </Button>

          <div className="text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
