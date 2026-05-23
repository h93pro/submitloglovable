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

// ============================================================
// Extended datasets for additional modules
// ============================================================

function makeDocs(prefix: string, count: number, titles: string[]): SubmittalDoc[] {
  return Array.from({ length: count }).map((_, i) => {
    const status = statuses[(i + 1) % statuses.length];
    const submit = (i * 4 + 2) % 60;
    const proj = projects[1 + (i % 4)];
    const overdue = status === "SUBMITTED" && submit > 14;
    return {
      id: `${prefix.toLowerCase()}-${i + 1}`,
      code: `${prefix}-${proj.code}-${pad(i + 1)}`,
      title: titles[i % titles.length],
      supplier: suppliers[(i + 2) % suppliers.length],
      discipline: disciplines[(i + 1) % disciplines.length],
      status,
      submitDate: daysAgo(submit),
      replyDate: status === "SUBMITTED" ? null : daysAgo(Math.max(0, submit - 3)),
      revision: i % 4,
      project: proj.name,
      overdue,
      description: `${prefix} package for review per project specifications. Includes drawings, datasheets and compliance certificates as required.`,
      attachments: [
        { name: `${prefix.toLowerCase()}-package.pdf`, size: "3.1 MB" },
        { name: "compliance.pdf", size: "642 KB" },
      ],
    };
  });
}

export const shopDrawings = makeDocs("SD", 36, [
  "Bridge Deck Reinforcement", "Curtain Wall Connection Details", "Stair Pressurization Layout",
  "Mechanical Riser Diagram", "Concrete Formwork Plan", "Electrical Single Line",
  "Plumbing Isometric L3", "Steel Erection Sequence",
]);

export const technicalSubmittals = makeDocs("TS", 28, [
  "Chiller Specification CH-01", "Lift Type LP-A Spec", "Fire Pump Package",
  "Generator 1500kVA", "Façade Engineering Calcs", "Acoustic Treatment Spec",
]);

export const subcontractorApprovals = makeDocs("SC", 22, [
  "MEP Subcontractor — Acme Mech", "Façade Subcontractor — Glassline",
  "Earthworks — Terra Group", "Electrical — Voltage Systems", "Painting — Pro Finish",
  "Waterproofing — HydroSeal",
]);

export const inspectionRequests = makeDocs("IR", 34, [
  "Concrete Pour Level 12", "Rebar Inspection Slab B", "MEP Rough-in Floor 5",
  "Façade Anchor Pull Test", "Drainage Connection Test", "Fire Stopping Inspection",
]);

export const materialInspections = makeDocs("MIR", 26, [
  "Rebar Delivery Inspection", "Steel Coupon Tests", "Cement Batch Verification",
  "Glass Panel Inspection", "HVAC Duct Coating", "Insulation R-value Check",
]);

export const ncrs = makeDocs("NCR", 14, [
  "Misaligned Anchor Bolts L7", "Concrete Honeycomb West Wall", "Incorrect Pipe Spec",
  "Duct Insulation Gap", "Glass Edge Chip", "Out-of-tolerance Slab",
]);

export const rfis = makeDocs("RFI", 38, [
  "Clarification on Wall Type W12", "Steel Connection at Grid B/4",
  "Concrete Cover Requirement", "MEP Coordination Floor 8", "Door Schedule Conflict",
  "Façade Bracket Detail", "Drainage Slope Verification",
]);

export type DocsModuleKey =
  | "material-submittals" | "shop-drawings" | "technical-submittals"
  | "subcontractor-approvals" | "inspection-requests" | "material-inspection-requests"
  | "ncrs" | "rfis";

export const docModules: Record<DocsModuleKey, { label: string; data: SubmittalDoc[] }> = {
  "material-submittals": { label: "Material Submittals", data: materialSubmittals },
  "shop-drawings": { label: "Shop Drawings", data: shopDrawings },
  "technical-submittals": { label: "Technical Submittals", data: technicalSubmittals },
  "subcontractor-approvals": { label: "Subcontractor Approvals", data: subcontractorApprovals },
  "inspection-requests": { label: "Inspection Requests", data: inspectionRequests },
  "material-inspection-requests": { label: "Material Inspections", data: materialInspections },
  "ncrs": { label: "Non-Conformance Reports", data: ncrs },
  "rfis": { label: "RFIs", data: rfis },
};

export const allDocuments: SubmittalDoc[] = [
  ...materialSubmittals, ...shopDrawings, ...technicalSubmittals,
  ...subcontractorApprovals, ...inspectionRequests, ...materialInspections,
  ...ncrs, ...rfis,
];

// ============================================================
// Projects
// ============================================================

export type ProjectDetail = {
  id: string; code: string; name: string; color: string;
  client: string; location: string; pm: string;
  value: string; progress: number; status: "active" | "planning" | "closeout";
  startDate: string; endDate: string;
  description: string;
  openSubmittals: number; openRfis: number; overdue: number;
  team: { name: string; role: string }[];
};

export const projectDetails: ProjectDetail[] = [
  {
    id: "p1", code: "RCT-21", name: "Riverside Commercial Tower", color: "#f59e0b",
    client: "Riverside Holdings LLC", location: "Brooklyn, NY", pm: "Sarah Chen",
    value: "$184M", progress: 62, status: "active",
    startDate: "2023-04-12", endDate: "2026-08-30",
    description: "42-story mixed-use commercial tower with retail podium, office floors and rooftop amenity deck.",
    openSubmittals: 28, openRfis: 12, overdue: 6,
    team: [
      { name: "Sarah Chen", role: "Project Manager" },
      { name: "Marco Rossi", role: "Senior Engineer" },
      { name: "Priya Nair", role: "Architect" },
      { name: "Ahmed Hassan", role: "MEP Lead" },
    ],
  },
  {
    id: "p2", code: "MBR-18", name: "Metro Bridge Rehabilitation", color: "#10b981",
    client: "City Department of Transportation", location: "Chicago, IL", pm: "Lin Wei",
    value: "$67M", progress: 38, status: "active",
    startDate: "2024-01-08", endDate: "2026-03-15",
    description: "Structural rehabilitation of historic 4-span bridge including deck replacement and seismic retrofit.",
    openSubmittals: 19, openRfis: 8, overdue: 3,
    team: [
      { name: "Lin Wei", role: "Project Manager" },
      { name: "Jonas Berg", role: "Structural Lead" },
    ],
  },
  {
    id: "p3", code: "HHX-04", name: "Harbor Heights Expansion", color: "#06b6d4",
    client: "Harbor Heights Authority", location: "Seattle, WA", pm: "Ahmed Hassan",
    value: "$92M", progress: 18, status: "planning",
    startDate: "2025-02-01", endDate: "2027-06-30",
    description: "Expansion of waterfront mixed-use district with three residential towers and a public plaza.",
    openSubmittals: 12, openRfis: 5, overdue: 1,
    team: [
      { name: "Ahmed Hassan", role: "Project Manager" },
      { name: "Priya Nair", role: "Design Lead" },
    ],
  },
  {
    id: "p4", code: "ADC-09", name: "Airport District Concourse", color: "#a855f7",
    client: "Metropolitan Airport Authority", location: "Atlanta, GA", pm: "Marco Rossi",
    value: "$340M", progress: 81, status: "closeout",
    startDate: "2022-09-15", endDate: "2025-12-20",
    description: "Greenfield airport concourse with 24 gates, baggage handling and apron infrastructure.",
    openSubmittals: 41, openRfis: 18, overdue: 9,
    team: [
      { name: "Marco Rossi", role: "Project Manager" },
      { name: "Sarah Chen", role: "PMO Liaison" },
      { name: "Lin Wei", role: "Civil Lead" },
    ],
  },
];

// ============================================================
// Tenders
// ============================================================

export type Tender = {
  id: string; code: string; title: string; status: "OPEN" | "EVALUATION" | "AWARDED" | "CANCELLED";
  client: string; value: string; submitDeadline: string; submissions: number;
  discipline: string;
};

export const tenders: Tender[] = [
  { id: "t1", code: "TND-2025-014", title: "Steel Framework Package — Tower B", status: "OPEN", client: "Riverside Holdings", value: "$24M", submitDeadline: daysAgo(-12), submissions: 6, discipline: "Structural" },
  { id: "t2", code: "TND-2025-013", title: "MEP Systems — Concourse East", status: "EVALUATION", client: "Metro Airport", value: "$48M", submitDeadline: daysAgo(8), submissions: 9, discipline: "MEP" },
  { id: "t3", code: "TND-2025-012", title: "Curtain Wall — Harbor Tower 2", status: "OPEN", client: "Harbor Authority", value: "$18M", submitDeadline: daysAgo(-21), submissions: 4, discipline: "Façade" },
  { id: "t4", code: "TND-2025-011", title: "Site Earthworks — Phase 1", status: "AWARDED", client: "Harbor Authority", value: "$11M", submitDeadline: daysAgo(35), submissions: 7, discipline: "Civil" },
  { id: "t5", code: "TND-2025-010", title: "Elevator Systems Package", status: "EVALUATION", client: "Riverside Holdings", value: "$9M", submitDeadline: daysAgo(14), submissions: 5, discipline: "Vertical Transport" },
  { id: "t6", code: "TND-2025-009", title: "Façade Cleaning Equipment", status: "CANCELLED", client: "Metro Airport", value: "$2.4M", submitDeadline: daysAgo(45), submissions: 3, discipline: "Façade" },
  { id: "t7", code: "TND-2025-008", title: "Concrete Supply — Bridge Deck", status: "AWARDED", client: "City DOT", value: "$6.2M", submitDeadline: daysAgo(58), submissions: 5, discipline: "Civil" },
  { id: "t8", code: "TND-2025-007", title: "Fire Protection Package", status: "OPEN", client: "Riverside Holdings", value: "$14M", submitDeadline: daysAgo(-6), submissions: 2, discipline: "Life Safety" },
];

// ============================================================
// Users
// ============================================================

export type AppUser = {
  id: string; name: string; email: string; role: "Admin" | "PM" | "Engineer" | "Reviewer" | "Viewer";
  status: "active" | "invited" | "suspended"; lastActive: string; projects: number;
};

const userNames = [
  ["Sarah Chen", "sarah.chen@acme.co"], ["Marco Rossi", "marco.rossi@acme.co"],
  ["Priya Nair", "priya.nair@acme.co"], ["Ahmed Hassan", "ahmed.hassan@acme.co"],
  ["Lin Wei", "lin.wei@acme.co"], ["Jonas Berg", "jonas.berg@acme.co"],
  ["Elena Volkov", "elena.volkov@acme.co"], ["Diego Marin", "diego.marin@acme.co"],
  ["Yuki Tanaka", "yuki.tanaka@acme.co"], ["Femi Okafor", "femi.okafor@acme.co"],
  ["Anna Kowalski", "anna.k@acme.co"], ["Carlos Mendez", "carlos.m@acme.co"],
];
const userRoles: AppUser["role"][] = ["Admin", "PM", "Engineer", "Reviewer", "Viewer"];
const userStatuses: AppUser["status"][] = ["active", "active", "active", "invited", "suspended"];

export const users: AppUser[] = userNames.map(([name, email], i) => ({
  id: `u${i + 1}`, name, email, role: userRoles[i % userRoles.length],
  status: userStatuses[i % userStatuses.length],
  lastActive: i % 5 === 4 ? "Never" : `${i + 1}h ago`,
  projects: 1 + (i % 4),
}));

// ============================================================
// WhatsApp Bot
// ============================================================

export const whatsappStats = {
  messages24h: 1432, activeChats: 87, automationsTriggered: 214, errorRate: 0.4,
};

export const whatsappMessages = [
  { id: "wm1", contact: "Field Supervisor — RCT-21", lastMessage: "Concrete pour level 12 inspection requested for tomorrow.", time: "3m ago", unread: 2, intent: "Inspection request" },
  { id: "wm2", contact: "Marco Rossi", lastMessage: "Uploaded shop drawing SD-MBR-18-0042.", time: "12m ago", unread: 0, intent: "Document upload" },
  { id: "wm3", contact: "Site QA — ADC-09", lastMessage: "NCR raised: misaligned anchor bolts on L7.", time: "1h ago", unread: 1, intent: "NCR" },
  { id: "wm4", contact: "Sarah Chen", lastMessage: "Approved MS-RCT-21-0007.", time: "2h ago", unread: 0, intent: "Approval" },
  { id: "wm5", contact: "Subcontractor Coord.", lastMessage: "Need clarification on RFI-ADC-09-0103.", time: "Yesterday", unread: 0, intent: "RFI" },
];

export const whatsappVolume = Array.from({ length: 14 }).map((_, i) => ({
  day: `D${i + 1}`,
  incoming: 60 + Math.round(Math.sin(i / 2) * 15 + Math.random() * 20),
  outgoing: 40 + Math.round(Math.cos(i / 3) * 10 + Math.random() * 15),
}));

// ============================================================
// Daily Reports
// ============================================================

export type DailyReport = {
  id: string; date: string; project: string; author: string; weather: string;
  manpower: number; equipment: number; status: "draft" | "submitted" | "approved";
  summary: string;
};

export const dailyReports: DailyReport[] = Array.from({ length: 18 }).map((_, i) => {
  const proj = projects[1 + (i % 4)];
  const statusesD: DailyReport["status"][] = ["approved", "submitted", "draft"];
  return {
    id: `dr-${i + 1}`, date: daysAgo(i), project: proj.name,
    author: userNames[i % userNames.length][0],
    weather: ["Clear, 22°C", "Cloudy, 18°C", "Rain, 14°C", "Sunny, 26°C"][i % 4],
    manpower: 30 + (i % 7) * 8, equipment: 6 + (i % 5),
    status: statusesD[i % 3],
    summary: "Concrete pour on level 12 completed. MEP rough-in continuing on floors 6-8. No safety incidents.",
  };
});

// ============================================================
// Schedule analytics
// ============================================================

export const scheduleCurve = Array.from({ length: 24 }).map((_, i) => {
  const t = i / 23;
  const baseline = Math.round(100 / (1 + Math.exp(-8 * (t - 0.5))));
  const actual = Math.max(0, baseline - (i > 14 ? (i - 14) * 1.6 : 0) - (i > 8 ? 3 : 0));
  return { week: `W${i + 1}`, baseline, actual, forecast: Math.min(100, actual + (i > 14 ? (i - 14) * 0.8 : 0)) };
});

export const scheduleMilestones = [
  { id: "m1", name: "Foundation Complete", planned: "2024-06-30", actual: "2024-07-12", variance: 12, status: "complete" as const },
  { id: "m2", name: "Superstructure Topout", planned: "2025-04-15", actual: "2025-05-02", variance: 17, status: "complete" as const },
  { id: "m3", name: "Façade Complete", planned: "2025-11-20", actual: null, variance: 0, status: "in-progress" as const },
  { id: "m4", name: "MEP Rough-in Complete", planned: "2026-02-15", actual: null, variance: 0, status: "upcoming" as const },
  { id: "m5", name: "Substantial Completion", planned: "2026-08-30", actual: null, variance: 0, status: "upcoming" as const },
];
