export type DocStatus =
  | "SUBMITTED"
  | "APPROVED"
  | "APPROVED AS NOTED"
  | "REVISE & RESUBMIT"
  | "REJECTED"
  | "VOID";

export type SubmittalDoc = {
  id: string;
  code: string;
  title: string;
  supplier: string;
  discipline: string;
  status: DocStatus;
  submitDate: string;
  replyDate: string | null;
  revision: number;
  project: string;
  overdue?: boolean;
  description?: string;
  attachments?: { name: string; size: string }[];
};

export const projects = [
  { id: "all", code: "ALL", name: "All Projects", color: "#5b6cff" },
  { id: "p1", code: "RCT-21", name: "Riverside Commercial Tower", color: "#f59e0b" },
  { id: "p2", code: "MBR-18", name: "Metro Bridge Rehabilitation", color: "#10b981" },
  { id: "p3", code: "HHX-04", name: "Harbor Heights Expansion", color: "#06b6d4" },
  { id: "p4", code: "ADC-09", name: "Airport District Concourse", color: "#a855f7" },
];

const disciplines = ["Civil", "Mechanical", "Electrical", "Architectural", "HVAC", "Plumbing", "Structural"];
const suppliers = ["ACME Steel", "Northrop Concrete", "BlueLine Mechanical", "Voltage Systems", "Hydro Supply Co", "Apex Aluminum", "Forge Industries"];
const statuses: DocStatus[] = ["SUBMITTED", "APPROVED", "APPROVED AS NOTED", "REVISE & RESUBMIT", "REJECTED", "VOID"];

function pad(n: number, w = 4) { return n.toString().padStart(w, "0"); }
function daysAgo(d: number) {
  const x = new Date();
  x.setDate(x.getDate() - d);
  return x.toISOString().slice(0, 10);
}

export const materialSubmittals: SubmittalDoc[] = Array.from({ length: 42 }).map((_, i) => {
  const status = statuses[i % statuses.length];
  const submit = (i * 3) % 60;
  const replied = status === "SUBMITTED" ? null : daysAgo(Math.max(0, submit - 4));
  const overdue = status === "SUBMITTED" && submit > 14;
  const proj = projects[1 + (i % 4)];
  return {
    id: `ms-${i + 1}`,
    code: `MS-${proj.code}-${pad(i + 1)}`,
    title: [
      "Structural Steel Grade A572", "Curtain Wall Glazing System", "HVAC Rooftop Unit RTU-04",
      "Fire-rated Doors Type B", "Reinforced Concrete Mix C40", "LED Lighting Fixtures L-22",
      "Waterproof Membrane Roof", "Aluminum Cladding Panels", "Plumbing Fixtures Premium",
      "Switchgear 480V Main", "Insulation Mineral Wool", "Tile Flooring Porcelain",
    ][i % 12],
    supplier: suppliers[i % suppliers.length],
    discipline: disciplines[i % disciplines.length],
    status,
    submitDate: daysAgo(submit),
    replyDate: replied,
    revision: (i % 4),
    project: proj.name,
    overdue,
    description: "Submittal package for review per project specifications. Includes datasheets, compliance certificates, and shop drawings as required.",
    attachments: [
      { name: "datasheet.pdf", size: "2.4 MB" },
      { name: "compliance-cert.pdf", size: "812 KB" },
      { name: "shop-drawings-r" + (i % 4) + ".dwg", size: "5.1 MB" },
    ],
  };
});

export const activityFeed = [
  { id: 1, user: "Sarah Chen", action: "approved", target: "MS-RCT-21-0007 · Curtain Wall Glazing", time: "12m ago", type: "approved" as const },
  { id: 2, user: "Marco Rossi", action: "submitted", target: "SD-MBR-18-0042 · Bridge Deck Reinforcement", time: "1h ago", type: "submitted" as const },
  { id: 3, user: "Priya Nair", action: "requested revision on", target: "TS-HHX-04-0019", time: "2h ago", type: "revise" as const },
  { id: 4, user: "Ahmed Hassan", action: "commented on", target: "RFI-ADC-09-0103", time: "3h ago", type: "comment" as const },
  { id: 5, user: "Lin Wei", action: "uploaded revision r2 to", target: "MS-RCT-21-0003", time: "5h ago", type: "submitted" as const },
  { id: 6, user: "Jonas Berg", action: "rejected", target: "MS-MBR-18-0021", time: "Yesterday", type: "rejected" as const },
];

export const scheduleAlerts = [
  { id: 1, title: "12 submittals overdue past 14 days", severity: "high" as const, project: "Riverside Commercial Tower" },
  { id: 2, title: "Baseline update required this week", severity: "medium" as const, project: "Metro Bridge Rehabilitation" },
  { id: 3, title: "RFI response time SLA breached on 3 items", severity: "high" as const, project: "Airport District Concourse" },
  { id: 4, title: "Weekly progress report due Friday", severity: "low" as const, project: "Harbor Heights Expansion" },
];

export const trendData = Array.from({ length: 14 }).map((_, i) => ({
  day: `D${i + 1}`,
  submitted: 8 + Math.round(Math.sin(i / 2) * 4 + Math.random() * 5),
  approved: 5 + Math.round(Math.cos(i / 3) * 3 + Math.random() * 4),
}));
