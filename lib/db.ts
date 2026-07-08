import { supabase } from "./supabase";
import { v4 as uuidv4 } from "uuid";

// ─── Locked Identity Constants ────────────────────────────────
// These values are authoritative and cannot be changed via admin.
export const LOCKED_IDENTITY = {
  businessName: "BetterDose",
  ownerName: "Nebiyu Muluadam",
  ukRegistryNumber: "16119809",
  address: "Office 10954, 182-184 High Street North, East Ham, London E6 2JA / Addis Ababa, Ethiopia",
};

// SHA-256 admin credentials
export const HASHED_USER = "465b4559212c20268d1a7390f2edc759df98fd7de88fb185cedada852578d824";
export const HASHED_PASS = "d21f966e9781321ea264408f2003fc328ed6c5c5a16cd50a91331736f72450a2";

// ─── Types ────────────────────────────────────────────────────

export interface Project {
  id: string;
  name: string;
  category: "completed" | "ongoing" | "university" | "qa-testing";
  description: string;
  technologiesUsed: string[];
  screenshots: string[];
  githubRepository: string;
  liveDemo: string;
  teamMembers: string[];
  projectStartDate: string;
  projectEndDate: string;
  status: string;
  features: string[];
  technicalArchitecture: string;
  documentationLinks: { label: string; url: string }[];
  clientType: string;
  projectOutcome: string;
  projectChallenges: string;
  notes: string;
  displayOrder: number;
  isPrivate: boolean;
  referenceCode: string;
}

export interface BusinessConfig {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  phone2?: string;
  phone3?: string;
  address: string;
  ukRegistryNumber?: string;
  linkedInNebiyu?: string;
  githubNebiyu?: string;
  linkedInEyob?: string;
  githubEyob?: string;
  linkedInAbel?: string;
  githubAbel?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  uniEmail: string;
  profEmail: string;
  github: string;
  linkedin: string;
  skills: string[];
  profilePhotoUrl: string;
  displayOrder: number;
}

export interface ActivityEntry {
  id: string;
  projectName: string;
  entryType: "Feature" | "Delivery" | "Deployment" | "Repository Update" | "Upgrade" | "Internal" | "Academic";
  description: string;
  dateLabel: string;
  tech: string[];
  status: string;
  displayOrder: number;
  createdAt?: string;
}

export interface Lead {
  id: string;
  leadNumber: number;
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
  status: string;
  source: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface InvoiceMilestone {
  milestone: string;
  description: string;
  completionDate: string;
  amount: number;
  status: string;
}

export interface PaymentHistoryEntry {
  date: string;
  method: string;
  reference: string;
  amount: number;
  status: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  company: string;
  country: string;
  phone: string;
  projectReference: string;
  purchaseOrder: string;
  currency: string;
  paymentMethod: string;
  issueDate: string;
  dueDate: string;
  paymentStatus: string;
  items: InvoiceItem[];
  milestones: InvoiceMilestone[];
  paymentHistory: PaymentHistoryEntry[];
  deliverables: string[];
  subtotal: number;
  discount: number;
  tax: number;
  amountPaid: number;
  remainingBalance: number;
  totalDue: number;
  notes: string;
  signatureUrl: string;
  stampUrl: string;
  verificationCode: string;
  fileUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContractMilestone {
  milestone: string;
  description: string;
  completionDate: string;
  amount: number;
  status: string;
}

export interface ContractPaymentSchedule {
  phase: string;
  amount: number;
  dueDate: string;
  status: string;
}

export interface Contract {
  id: string;
  contractNumber: string;
  clientName: string;
  clientEmail: string;
  company: string;
  project: string;
  status: string;
  issueDate: string;
  scopeOfWork: string;
  milestones: ContractMilestone[];
  deliverables: string[];
  paymentSchedule: ContractPaymentSchedule[];
  governingLaw: string;
  notes: string;
  fileUrl: string;
  signatureUrl: string;
  stampUrl: string;
  verificationCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface StorageFile {
  name: string;
  url: string;
  bucket: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "archived";
  createdAt: string;
}

export const INITIAL_CONFIG: BusinessConfig = {
  ...LOCKED_IDENTITY,
  email: "",
  phone: "",
  phone2: "",
  phone3: "",
  linkedInNebiyu: "",
  githubNebiyu: "",
  linkedInEyob: "",
  githubEyob: "",
  linkedInAbel: "",
  githubAbel: "",
};

// ─── Row mapping helpers ──────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function rowToProject(row: any): Project {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description ?? "",
    technologiesUsed: row.technologies_used ?? [],
    screenshots: row.screenshots ?? [],
    githubRepository: row.github_repository ?? "",
    liveDemo: row.live_demo ?? "",
    teamMembers: row.team_members ?? [],
    projectStartDate: row.project_start_date ?? "",
    projectEndDate: row.project_end_date ?? "",
    status: row.status ?? "",
    features: row.features ?? [],
    technicalArchitecture: row.technical_architecture ?? "",
    documentationLinks: row.documentation_links ?? [],
    clientType: row.client_type ?? "",
    projectOutcome: row.project_outcome ?? "",
    projectChallenges: row.project_challenges ?? "",
    notes: row.notes ?? "",
    displayOrder: row.display_order ?? 0,
    isPrivate: row.is_private ?? false,
    referenceCode: row.reference_code ?? "",
  };
}

export function projectToRow(p: Project) {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    description: p.description,
    technologies_used: p.technologiesUsed,
    screenshots: p.screenshots,
    github_repository: p.githubRepository,
    live_demo: p.liveDemo,
    team_members: p.teamMembers,
    project_start_date: p.projectStartDate || null,
    project_end_date: p.projectEndDate || null,
    status: p.status,
    features: p.features,
    technical_architecture: p.technicalArchitecture,
    documentation_links: p.documentationLinks,
    client_type: p.clientType,
    project_outcome: p.projectOutcome,
    project_challenges: p.projectChallenges,
    notes: p.notes,
    display_order: p.displayOrder,
    is_private: p.isPrivate,
    reference_code: p.referenceCode,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function rowToTeamMember(row: any): TeamMember {
  return {
    id: row.id,
    name: row.name,
    role: row.role ?? "",
    bio: row.bio ?? "",
    uniEmail: row.uni_email ?? "",
    profEmail: row.prof_email ?? "",
    github: row.github ?? "",
    linkedin: row.linkedin ?? "",
    skills: row.skills ?? [],
    profilePhotoUrl: row.profile_photo_url ?? "",
    displayOrder: row.display_order ?? 0,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function rowToConfig(row: any): BusinessConfig {
  return {
    ...LOCKED_IDENTITY,
    email: row.email ?? "",
    phone: row.phone ?? "",
    phone2: row.phone2 ?? "",
    phone3: row.phone3 ?? "",
    linkedInNebiyu: row.linkedin_nebiyu ?? "",
    githubNebiyu: row.github_nebiyu ?? "",
    linkedInEyob: row.linkedin_eyob ?? "",
    githubEyob: row.github_eyob ?? "",
    linkedInAbel: row.linkedin_abel ?? "",
    githubAbel: row.github_abel ?? "",
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function rowToActivity(row: any): ActivityEntry {
  return {
    id: row.id,
    projectName: row.project_name,
    entryType: row.entry_type,
    description: row.description ?? "",
    dateLabel: row.date_label ?? "",
    tech: row.tech ?? [],
    status: row.status ?? "",
    displayOrder: row.display_order ?? 0,
    createdAt: row.created_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function rowToContactMessage(row: any): ContactMessage {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    subject: row.subject ?? "",
    message: row.message,
    status: row.status ?? "unread",
    createdAt: row.created_at,
  };
}

// ─── READ functions (anon client, public access) ──────────────

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_private", false)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) { console.error("fetchProjects:", error); return []; }
  return (data ?? []).map(rowToProject);
}

export async function fetchAllProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) { console.error("fetchAllProjects:", error); return []; }
  return (data ?? []).map(rowToProject);
}

export async function fetchProjectById(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();
  if (error) { console.error("fetchProjectById:", error); return null; }
  return rowToProject(data);
}

export async function fetchConfig(): Promise<BusinessConfig> {
  const { data, error } = await supabase
    .from("business_config")
    .select("*")
    .eq("id", 1)
    .single();
  if (error) { console.error("fetchConfig:", error); return INITIAL_CONFIG; }
  return rowToConfig(data);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function rowToLead(row: any): Lead {
  return {
    id: row.id,
    leadNumber: row.lead_number,
    name: row.name,
    email: row.email,
    company: row.company ?? "",
    subject: row.subject ?? "",
    message: row.message ?? "",
    status: row.status ?? "New",
    source: row.source ?? "Contact Form",
    notes: row.notes ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function fetchLeads(token: string): Promise<Lead[]> {
  const res = await fetch("/api/leads", { headers: adminHeaders(token) });
  if (!res.ok) return [];
  const data = await res.json();
  return (data ?? []).map(rowToLead);
}

export async function apiUpdateLead(id: string, updates: Partial<Pick<Lead, "status" | "notes">>, token: string): Promise<boolean> {
  const res = await fetch("/api/leads", {
    method: "PATCH",
    headers: adminHeaders(token),
    body: JSON.stringify({ id, ...updates }),
  });
  return res.ok;
}

export async function apiDeleteLead(id: string, token: string): Promise<boolean> {
  const res = await fetch("/api/leads", {
    method: "DELETE",
    headers: adminHeaders(token),
    body: JSON.stringify({ id }),
  });
  return res.ok;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function rowToInvoice(row: any): Invoice {
  return {
    id: row.id,
    invoiceNumber: row.invoice_number,
    clientName: row.client_name,
    clientEmail: row.client_email,
    company: row.company ?? "",
    country: row.country ?? "",
    phone: row.phone ?? "",
    projectReference: row.project_reference ?? "",
    purchaseOrder: row.purchase_order ?? "",
    currency: row.currency ?? "USD",
    paymentMethod: row.payment_method ?? "Wise",
    issueDate: row.issue_date ?? "",
    dueDate: row.due_date ?? "",
    paymentStatus: row.payment_status ?? "Pending",
    items: Array.isArray(row.items) ? row.items : [],
    milestones: Array.isArray(row.milestones) ? row.milestones : [],
    paymentHistory: Array.isArray(row.payment_history) ? row.payment_history : [],
    deliverables: Array.isArray(row.deliverables) ? row.deliverables : [],
    subtotal: Number(row.subtotal ?? 0),
    discount: Number(row.discount ?? 0),
    tax: Number(row.tax ?? 0),
    amountPaid: Number(row.amount_paid ?? 0),
    remainingBalance: Number(row.remaining_balance ?? 0),
    totalDue: Number(row.total_due ?? 0),
    notes: row.notes ?? "",
    signatureUrl: row.signature_url ?? "",
    stampUrl: row.stamp_url ?? "",
    verificationCode: row.verification_code ?? "",
    fileUrl: row.file_url ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function fetchInvoices(token: string): Promise<Invoice[]> {
  const res = await fetch("/api/invoices", { headers: adminHeaders(token) });
  if (!res.ok) return [];
  const data = await res.json();
  return (data ?? []).map(rowToInvoice);
}

export async function apiUpdateInvoice(id: string, updates: Partial<Invoice>, token: string): Promise<boolean> {
  const dbUpdates = {
    payment_status: updates.paymentStatus,
    notes: updates.notes,
  };
  const res = await fetch("/api/invoices", {
    method: "PATCH",
    headers: adminHeaders(token),
    body: JSON.stringify({ id, ...dbUpdates }),
  });
  return res.ok;
}

export async function apiDeleteInvoice(id: string, token: string): Promise<boolean> {
  const res = await fetch("/api/invoices", {
    method: "DELETE",
    headers: adminHeaders(token),
    body: JSON.stringify({ id }),
  });
  return res.ok;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function rowToContract(row: any): Contract {
  return {
    id: row.id,
    contractNumber: row.contract_number,
    clientName: row.client_name,
    clientEmail: row.client_email,
    company: row.company ?? "",
    project: row.project ?? "",
    status: row.status ?? "Draft",
    issueDate: row.issue_date ?? "",
    scopeOfWork: row.scope_of_work ?? "",
    milestones: Array.isArray(row.milestones) ? row.milestones : [],
    deliverables: Array.isArray(row.deliverables) ? row.deliverables : [],
    paymentSchedule: Array.isArray(row.payment_schedule) ? row.payment_schedule : [],
    governingLaw: row.governing_law ?? "United Kingdom",
    notes: row.notes ?? "",
    fileUrl: row.file_url ?? "",
    signatureUrl: row.signature_url ?? "",
    stampUrl: row.stamp_url ?? "",
    verificationCode: row.verification_code ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function fetchContracts(token: string): Promise<Contract[]> {
  const res = await fetch("/api/contracts", { headers: adminHeaders(token) });
  if (!res.ok) return [];
  const data = await res.json();
  return (data ?? []).map(rowToContract);
}

export async function apiUpdateContract(id: string, updates: Partial<Contract>, token: string): Promise<boolean> {
  const dbUpdates: Record<string, any> = {};
  if (updates.contractNumber !== undefined) dbUpdates.contract_number = updates.contractNumber;
  if (updates.clientName !== undefined) dbUpdates.client_name = updates.clientName;
  if (updates.clientEmail !== undefined) dbUpdates.client_email = updates.clientEmail;
  if (updates.company !== undefined) dbUpdates.company = updates.company;
  if (updates.project !== undefined) dbUpdates.project = updates.project;
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.issueDate !== undefined) dbUpdates.issue_date = updates.issueDate;
  if (updates.scopeOfWork !== undefined) dbUpdates.scope_of_work = updates.scopeOfWork;
  if (updates.milestones !== undefined) dbUpdates.milestones = updates.milestones;
  if (updates.deliverables !== undefined) dbUpdates.deliverables = updates.deliverables;
  if (updates.paymentSchedule !== undefined) dbUpdates.payment_schedule = updates.paymentSchedule;
  if (updates.governingLaw !== undefined) dbUpdates.governing_law = updates.governingLaw;
  if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
  if (updates.fileUrl !== undefined) dbUpdates.file_url = updates.fileUrl;
  if (updates.signatureUrl !== undefined) dbUpdates.signature_url = updates.signatureUrl;
  if (updates.stampUrl !== undefined) dbUpdates.stamp_url = updates.stampUrl;
  if (updates.verificationCode !== undefined) dbUpdates.verification_code = updates.verificationCode;

  const res = await fetch("/api/contracts", {
    method: "PATCH",
    headers: adminHeaders(token),
    body: JSON.stringify({ id, ...dbUpdates }),
  });
  return res.ok;
}

export async function apiDeleteContract(id: string, token: string): Promise<boolean> {
  const res = await fetch("/api/contracts", {
    method: "DELETE",
    headers: adminHeaders(token),
    body: JSON.stringify({ id }),
  });
  return res.ok;
}

export async function fetchTeamMembers(): Promise<TeamMember[]> {
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .order("display_order", { ascending: true });
  if (error) { console.error("fetchTeamMembers:", error); return []; }
  return (data ?? []).map(rowToTeamMember);
}

export async function fetchActivityEntries(): Promise<ActivityEntry[]> {
  const { data, error } = await supabase
    .from("activity_entries")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) { console.error("fetchActivityEntries:", error); return []; }
  return (data ?? []).map(rowToActivity);
}

// ─── WRITE functions (via secure API routes) ──────────────────
// Admin token = "hashedUser:hashedPass" sent in x-admin-token header.

function adminHeaders(token: string): HeadersInit {
  return { "Content-Type": "application/json", "x-admin-token": token };
}

export async function apiUpsertProject(project: Project, token: string): Promise<Project | null> {
  const res = await fetch("/api/projects", {
    method: "POST",
    headers: adminHeaders(token),
    body: JSON.stringify(projectToRow(project)),
  });
  if (!res.ok) { console.error("apiUpsertProject:", await res.text()); return null; }
  const row = await res.json();
  return rowToProject(row);
}

export async function apiDeleteProject(id: string, token: string): Promise<boolean> {
  const res = await fetch("/api/projects", {
    method: "DELETE",
    headers: adminHeaders(token),
    body: JSON.stringify({ id }),
  });
  return res.ok;
}

export async function apiSaveConfig(config: BusinessConfig, token: string): Promise<boolean> {
  const res = await fetch("/api/config", {
    method: "POST",
    headers: adminHeaders(token),
    body: JSON.stringify({
      email: config.email,
      phone: config.phone,
      phone2: config.phone2,
      phone3: config.phone3,
      linkedin_nebiyu: config.linkedInNebiyu,
      github_nebiyu: config.githubNebiyu,
      linkedin_eyob: config.linkedInEyob,
      github_eyob: config.githubEyob,
      linkedin_abel: config.linkedInAbel,
      github_abel: config.githubAbel,
    }),
  });
  return res.ok;
}

export async function apiUpsertTeamMember(member: TeamMember, token: string): Promise<TeamMember | null> {
  const res = await fetch("/api/team", {
    method: "POST",
    headers: adminHeaders(token),
    body: JSON.stringify({
      id: member.id,
      name: member.name,
      role: member.role,
      bio: member.bio,
      uni_email: member.uniEmail,
      prof_email: member.profEmail,
      github: member.github,
      linkedin: member.linkedin,
      skills: member.skills,
      profile_photo_url: member.profilePhotoUrl,
      display_order: member.displayOrder,
    }),
  });
  if (!res.ok) { console.error("apiUpsertTeamMember:", await res.text()); return null; }
  const row = await res.json();
  return rowToTeamMember(row);
}

export async function apiDeleteTeamMember(id: string, token: string): Promise<boolean> {
  const res = await fetch("/api/team", {
    method: "DELETE",
    headers: adminHeaders(token),
    body: JSON.stringify({ id }),
  });
  return res.ok;
}

export async function apiUpsertActivity(entry: ActivityEntry, token: string): Promise<ActivityEntry | null> {
  const res = await fetch("/api/activity", {
    method: "POST",
    headers: adminHeaders(token),
    body: JSON.stringify({
      id: entry.id,
      project_name: entry.projectName,
      entry_type: entry.entryType,
      description: entry.description,
      date_label: entry.dateLabel,
      tech: entry.tech,
      status: entry.status,
      display_order: entry.displayOrder,
    }),
  });
  if (!res.ok) { console.error("apiUpsertActivity:", await res.text()); return null; }
  const row = await res.json();
  return rowToActivity(row);
}

export async function apiDeleteActivity(id: string, token: string): Promise<boolean> {
  const res = await fetch("/api/activity", {
    method: "DELETE",
    headers: adminHeaders(token),
    body: JSON.stringify({ id }),
  });
  return res.ok;
}

export async function apiUploadFile(
  file: File,
  bucket: "portfolio-images" | "documents" | "team-photos",
  token: string
): Promise<{ url: string; path: string; name: string } | null> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("bucket", bucket);
  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { "x-admin-token": token },
    body: formData,
  });
  if (!res.ok) { console.error("apiUploadFile:", await res.text()); return null; }
  return res.json();
}

export async function apiListFiles(
  bucket: "portfolio-images" | "documents" | "team-photos"
): Promise<StorageFile[]> {
  const res = await fetch(`/api/upload?bucket=${bucket}`);
  if (!res.ok) return [];
  return res.json();
}

export async function apiSubmitContactMessage(
  msg: Omit<ContactMessage, "id" | "status" | "createdAt">
): Promise<ContactMessage | null> {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(msg),
  });
  if (!res.ok) { console.error("apiSubmitContactMessage:", await res.text()); return null; }
  return rowToContactMessage(await res.json());
}

export async function apiFetchContactMessages(token: string): Promise<ContactMessage[]> {
  const res = await fetch("/api/contact", {
    method: "GET",
    headers: adminHeaders(token),
  });
  if (!res.ok) { console.error("apiFetchContactMessages:", await res.text()); return []; }
  const data = await res.json();
  return (data ?? []).map(rowToContactMessage);
}

export async function apiDeleteContactMessage(id: string, token: string): Promise<boolean> {
  const res = await fetch("/api/contact", {
    method: "DELETE",
    headers: adminHeaders(token),
    body: JSON.stringify({ id }),
  });
  return res.ok;
}

export async function apiUpdateMessageStatus(
  id: string,
  status: "unread" | "read" | "archived",
  token: string
): Promise<ContactMessage | null> {
  const res = await fetch("/api/contact", {
    method: "PATCH",
    headers: adminHeaders(token),
    body: JSON.stringify({ id, status }),
  });
  if (!res.ok) { console.error("apiUpdateMessageStatus:", await res.text()); return null; }
  return rowToContactMessage(await res.json());
}

// ─── Scaffold helpers ─────────────────────────────────────────

export function newProject(): Project {
  return {
    id: uuidv4(),
    name: "",
    category: "completed",
    description: "",
    technologiesUsed: [],
    screenshots: [],
    githubRepository: "",
    liveDemo: "",
    teamMembers: [],
    projectStartDate: "",
    projectEndDate: "",
    status: "",
    features: [],
    technicalArchitecture: "",
    documentationLinks: [],
    clientType: "",
    projectOutcome: "",
    projectChallenges: "",
    notes: "",
    displayOrder: 0,
    isPrivate: false,
    referenceCode: "",
  };
}

export function newTeamMember(): TeamMember {
  return {
    id: uuidv4(),
    name: "",
    role: "",
    bio: "",
    uniEmail: "",
    profEmail: "",
    github: "",
    linkedin: "",
    skills: [],
    profilePhotoUrl: "",
    displayOrder: 99,
  };
}

export function newActivityEntry(): ActivityEntry {
  return {
    id: uuidv4(),
    projectName: "",
    entryType: "Feature",
    description: "",
    dateLabel: "",
    tech: [],
    status: "In Development",
    displayOrder: 0,
  };
}
