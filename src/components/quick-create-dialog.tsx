import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export type QuickField =
  | { name: string; label: string; type: "text" | "date" | "number"; placeholder?: string; required?: boolean; col?: 1 | 2 }
  | { name: string; label: string; type: "textarea"; placeholder?: string; rows?: number; col?: 1 | 2 }
  | { name: string; label: string; type: "select"; options: string[]; col?: 1 | 2 };

export function QuickCreateDialog({
  trigger,
  title,
  description,
  submitLabel = "Create",
  fields,
  onSubmit,
}: {
  trigger: ReactNode;
  title: string;
  description?: string;
  submitLabel?: string;
  fields: QuickField[];
  onSubmit?: (values: Record<string, string>) => void;
}) {
  const [open, setOpen] = useState(false);
  const initial: Record<string, string> = {};
  fields.forEach((f) => {
    initial[f.name] = f.type === "select" ? f.options[0] : "";
  });
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const set = (k: string, v: string) => {
    setValues((s) => ({ ...s, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: false }));
  };

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const nextErr: Record<string, boolean> = {};
    fields.forEach((f) => {
      if ("required" in f && f.required && !values[f.name]?.trim()) nextErr[f.name] = true;
    });
    if (Object.keys(nextErr).length) {
      setErrors(nextErr);
      return;
    }
    onSubmit?.(values);
    toast.success(`${title} created`);
    setOpen(false);
    setValues(initial);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="flex max-h-[92vh] flex-col gap-0 p-0 sm:max-w-[600px]">
        <DialogHeader className="border-b border-border px-6 py-4">
          <DialogTitle className="text-[16px]">{title}</DialogTitle>
          {description && <DialogDescription className="text-[12.5px]">{description}</DialogDescription>}
        </DialogHeader>
        <form onSubmit={submit} className="grid grid-cols-1 gap-4 overflow-y-auto px-6 py-5 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.name} className={`flex flex-col gap-1.5 ${f.col === 2 ? "sm:col-span-2" : ""}`}>
              <Label className="text-[12px] font-medium">{f.label}</Label>
              {f.type === "textarea" ? (
                <Textarea rows={f.rows ?? 3} placeholder={f.placeholder} value={values[f.name]} onChange={(e) => set(f.name, e.target.value)} />
              ) : f.type === "select" ? (
                <Select value={values[f.name]} onValueChange={(v) => set(f.name, v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {f.options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  type={f.type}
                  placeholder={f.placeholder}
                  value={values[f.name]}
                  onChange={(e) => set(f.name, e.target.value)}
                  aria-invalid={errors[f.name] || undefined}
                />
              )}
              {errors[f.name] && <span className="text-[11px] text-destructive">Required</span>}
            </div>
          ))}
        </form>
        <DialogFooter className="flex-row gap-2 border-t border-border bg-background px-6 py-3 sm:justify-end">
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
          <Button size="sm" onClick={() => submit()}>{submitLabel}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
