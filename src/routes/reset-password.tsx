import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Loader2, HardHat, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password — SubmitLog" },
      { name: "description", content: "Choose a new password using your reset link." },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (next.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (next !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    // Mock submission — no backend wiring yet
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    toast.success("Password reset successfully");
    navigate({ to: "/login" });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6 rounded-lg border bg-card p-8 shadow-sm">
        <div className="flex flex-col items-center space-y-3 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <HardHat className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">Choose a new password</h1>
            <p className="text-sm text-muted-foreground">
              Your reset link has been verified. Pick a strong new password.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
                Saving…
              </>
            ) : (
              "Reset password"
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
