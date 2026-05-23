import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon, Shield, Bell, Plug, Building, Palette } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — SubmitLog" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-6 py-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary"><SettingsIcon className="h-5 w-5" /></div>
        <div>
          <h1 className="text-[20px] font-semibold tracking-tight">Settings</h1>
          <p className="text-[12.5px] text-muted-foreground">Organization, workflow, integrations and preferences</p>
        </div>
      </div>

      <Tabs defaultValue="general" orientation="vertical" className="flex gap-6">
        <TabsList className="flex h-auto w-48 shrink-0 flex-col items-stretch bg-transparent p-0">
          {[
            { v: "general", label: "General", Icon: Building },
            { v: "security", label: "Security", Icon: Shield },
            { v: "notifications", label: "Notifications", Icon: Bell },
            { v: "integrations", label: "Integrations", Icon: Plug },
            { v: "appearance", label: "Appearance", Icon: Palette },
          ].map(({ v, label, Icon }) => (
            <TabsTrigger key={v} value={v} className="justify-start gap-2 rounded-md px-2.5 py-1.5 text-[12.5px] data-[state=active]:bg-accent data-[state=active]:shadow-none">
              <Icon className="h-3.5 w-3.5" /> {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="min-w-0 flex-1">
          <TabsContent value="general" className="mt-0 space-y-5">
            <Card title="Organization">
              <Field label="Organization name"><Input defaultValue="Acme Construction Co" /></Field>
              <Field label="Default project code prefix"><Input defaultValue="ACM" /></Field>
              <Field label="Time zone"><Input defaultValue="America/New_York" /></Field>
            </Card>
            <Card title="Document numbering">
              <Field label="Submittal sequence start"><Input defaultValue="0001" /></Field>
              <Field label="Auto-increment on revision"><Switch defaultChecked /></Field>
            </Card>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm">Reset</Button>
              <Button size="sm" onClick={() => toast.success("Settings saved")}>Save changes</Button>
            </div>
          </TabsContent>

          <TabsContent value="security" className="mt-0 space-y-5">
            <Card title="Authentication">
              <Field label="Require SSO"><Switch /></Field>
              <Field label="Enforce 2FA for admins"><Switch defaultChecked /></Field>
              <Field label="Session timeout (minutes)"><Input defaultValue="60" /></Field>
            </Card>
            <Card title="Access control"><Field label="Allow guest reviewers"><Switch /></Field></Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-0 space-y-5">
            <Card title="Email notifications">
              <Field label="Document approved"><Switch defaultChecked /></Field>
              <Field label="Revision requested"><Switch defaultChecked /></Field>
              <Field label="Overdue digest (daily)"><Switch defaultChecked /></Field>
              <Field label="Weekly summary"><Switch /></Field>
            </Card>
            <Card title="WhatsApp notifications">
              <Field label="Push alerts to bot"><Switch defaultChecked /></Field>
              <Field label="Severity threshold"><Input defaultValue="medium" /></Field>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="mt-0 space-y-3">
            {[
              { name: "Microsoft Teams", desc: "Mirror updates to a Teams channel", connected: true },
              { name: "Procore", desc: "Two-way sync of RFIs and submittals", connected: false },
              { name: "Autodesk Construction Cloud", desc: "Drawings and BIM models", connected: true },
              { name: "WhatsApp Cloud API", desc: "Field bot for daily reports", connected: true },
              { name: "Slack", desc: "Project channel notifications", connected: false },
            ].map((i) => (
              <div key={i.name} className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
                <div>
                  <div className="text-[13px] font-medium">{i.name}</div>
                  <div className="text-[11.5px] text-muted-foreground">{i.desc}</div>
                </div>
                <Button size="sm" variant={i.connected ? "outline" : "default"} className="h-8 text-[12px]">
                  {i.connected ? "Connected" : "Connect"}
                </Button>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="appearance" className="mt-0 space-y-5">
            <Card title="Display">
              <Field label="Compact mode"><Switch /></Field>
              <Field label="Show document codes in tables"><Switch defaultChecked /></Field>
              <Field label="Sticky table headers"><Switch defaultChecked /></Field>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-4 py-2.5"><h3 className="text-[12.5px] font-semibold">{title}</h3></div>
      <div className="space-y-3 p-4">{children}</div>
    </section>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <Label className="text-[12.5px]">{label}</Label>
        <div className="w-64 min-w-0">{children}</div>
      </div>
      <Separator />
    </>
  );
}
