import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { UploadCloud } from "lucide-react";

const schema = z.object({
  type: z.string().min(1),
  code: z.string().min(2).max(40),
  title: z.string().min(3).max(140),
  supplier: z.string().min(2).max(80),
  discipline: z.string().min(1),
  submitDate: z.string().min(1),
  replyDate: z.string().optional(),
  description: z.string().max(1000).optional(),
});

type FormData = z.infer<typeof schema>;

export function CreateDocumentSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "material-submittals",
      code: "",
      title: "",
      supplier: "",
      discipline: "Civil",
      submitDate: new Date().toISOString().slice(0, 10),
      description: "",
    },
  });

  const onSubmit = (data: FormData) => {
    toast.success("Document created", { description: `${data.code} · ${data.title}` });
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-[92vh] flex-col gap-0 p-0 sm:max-w-[640px] md:max-w-[720px]"
      >
        <DialogHeader className="border-b border-border px-6 py-4">
          <DialogTitle className="text-[16px]">New document</DialogTitle>
          <DialogDescription className="text-[12.5px]">
            Create a submittal, drawing, RFI, or inspection record.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-5"
        >
          <Field label="Type">
            <Select
              value={form.watch("type")}
              onValueChange={(v) => form.setValue("type", v)}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="material-submittals">Material Submittal</SelectItem>
                <SelectItem value="shop-drawings">Shop Drawing</SelectItem>
                <SelectItem value="technical-submittals">Technical Submittal</SelectItem>
                <SelectItem value="rfis">RFI</SelectItem>
                <SelectItem value="ncrs">NCR</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Code" error={form.formState.errors.code?.message}>
              <Input placeholder="MS-RCT-21-0099" {...form.register("code")} />
            </Field>
            <Field label="Discipline">
              <Select
                value={form.watch("discipline")}
                onValueChange={(v) => form.setValue("discipline", v)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Civil", "Mechanical", "Electrical", "Architectural", "HVAC", "Plumbing", "Structural"].map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field label="Title" error={form.formState.errors.title?.message}>
            <Input placeholder="e.g. Curtain Wall Glazing System" {...form.register("title")} />
          </Field>

          <Field label="Supplier" error={form.formState.errors.supplier?.message}>
            <Input placeholder="ACME Steel" {...form.register("supplier")} />
          </Field>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Submit date">
              <Input type="date" {...form.register("submitDate")} />
            </Field>
            <Field label="Expected reply">
              <Input type="date" {...form.register("replyDate")} />
            </Field>
          </div>

          <Field label="Description">
            <Textarea rows={4} placeholder="Optional context for reviewers…" {...form.register("description")} />
          </Field>

          <div>
            <Label className="text-[12px] font-medium">Attachments</Label>
            <div className="mt-1.5 grid place-items-center rounded-md border border-dashed border-border bg-muted/30 px-4 py-8 text-center transition hover:bg-muted/50">
              <UploadCloud className="mb-2 h-5 w-5 text-muted-foreground" />
              <div className="text-[12.5px] font-medium">Drop files or click to upload</div>
              <div className="text-[11px] text-muted-foreground">PDF, DWG, XLSX · up to 50 MB</div>
            </div>
          </div>
        </form>

        <DialogFooter className="flex-row gap-2 border-t border-border bg-background px-6 py-3 sm:justify-end">
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button size="sm" onClick={form.handleSubmit(onSubmit)}>Create document</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-[12px] font-medium">{label}</Label>
      {children}
      {error && <span className="text-[11px] text-destructive">{error}</span>}
    </div>
  );
}
