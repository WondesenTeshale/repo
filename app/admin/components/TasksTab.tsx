"use client";
import { useState } from "react";
import { Calendar, Clock, CheckCircle, Circle, AlertTriangle, ChevronDown, Plus, Filter } from "lucide-react";

const VIEWS = ["Board", "List", "Timeline"];
const PRIORITIES = ["All", "Critical", "High", "Medium", "Low"];

const tasks = [
  { id: "T-001", title: "Finalize BetterDose Homepage Redesign", project: "BetterDose Website", assignee: "Nebiyou Y.", priority: "Critical", status: "In Progress", due: "2026-07-12", tags: ["Design", "Frontend"] },
  { id: "T-002", title: "Implement Supabase RLS policies for invoices", project: "Admin Dashboard", assignee: "Nebiyou Y.", priority: "High", status: "In Progress", due: "2026-07-10", tags: ["Backend", "Security"] },
  { id: "T-003", title: "Set up Resend email templates for client onboarding", project: "Client Portal", assignee: "Fikir K.", priority: "High", status: "To Do", due: "2026-07-15", tags: ["Email", "Backend"] },
  { id: "T-004", title: "QA testing for CRM pipeline stages", project: "Admin Dashboard", assignee: "Sara M.", priority: "Medium", status: "In Review", due: "2026-07-08", tags: ["QA", "Testing"] },
  { id: "T-005", title: "Write API documentation for v2 endpoints", project: "BetterDose API", assignee: "Nebiyou Y.", priority: "Medium", status: "To Do", due: "2026-07-20", tags: ["Docs", "API"] },
  { id: "T-006", title: "Deploy production build to Vercel with env vars", project: "DevOps", assignee: "Nebiyou Y.", priority: "Critical", status: "Completed", due: "2026-07-05", tags: ["DevOps", "Deploy"] },
  { id: "T-007", title: "Design logo animation for splash screen", project: "Brand Identity", assignee: "Fikir K.", priority: "Low", status: "To Do", due: "2026-07-25", tags: ["Design", "Motion"] },
  { id: "T-008", title: "Integrate Stripe payment gateway for SaaS billing", project: "SaaS Platform", assignee: "Nebiyou Y.", priority: "High", status: "In Progress", due: "2026-07-18", tags: ["Payment", "Backend"] },
  { id: "T-009", title: "Optimize Lighthouse score to 95+ across all pages", project: "BetterDose Website", assignee: "Sara M.", priority: "Medium", status: "To Do", due: "2026-07-22", tags: ["Performance", "Frontend"] },
  { id: "T-010", title: "Client handoff meeting — TechFlow Inc.", project: "TechFlow Project", assignee: "Nebiyou Y.", priority: "High", status: "Completed", due: "2026-07-02", tags: ["Client", "Meeting"] },
  { id: "T-011", title: "Create GDPR-compliant privacy policy page", project: "Legal", assignee: "Fikir K.", priority: "High", status: "Completed", due: "2026-07-01", tags: ["Legal", "Compliance"] },
  { id: "T-012", title: "Fix mobile nav overflow on Safari iOS", project: "BetterDose Website", assignee: "Sara M.", priority: "Medium", status: "In Progress", due: "2026-07-09", tags: ["Bug", "Mobile"] },
  { id: "T-013", title: "Build onboarding flow for new team members", project: "HR & Admin", assignee: "Fikir K.", priority: "Low", status: "To Do", due: "2026-07-30", tags: ["HR", "Internal"] },
  { id: "T-014", title: "Set up automated invoice reminders via CRON", project: "Admin Dashboard", assignee: "Nebiyou Y.", priority: "Medium", status: "To Do", due: "2026-07-24", tags: ["Automation", "Backend"] },
  { id: "T-015", title: "Record product demo video for sales deck", project: "Marketing", assignee: "Fikir K.", priority: "High", status: "In Progress", due: "2026-07-14", tags: ["Video", "Sales"] },
];

const priorityStyles: Record<string, string> = {
  Critical: "text-red-400 bg-red-400/10 border-red-400/30",
  High: "text-orange-400 bg-orange-400/10 border-orange-400/30",
  Medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  Low: "text-green-400 bg-green-400/10 border-green-400/30",
};

const statusStyles: Record<string, string> = {
  "Completed": "text-green-400",
  "In Progress": "text-[#4f8ef7]",
  "In Review": "text-purple-400",
  "To Do": "text-[#556080]",
};

const statusIcons: Record<string, React.ReactNode> = {
  "Completed": <CheckCircle size={13} className="text-green-400" />,
  "In Progress": <Clock size={13} className="text-[#4f8ef7]" />,
  "In Review": <AlertTriangle size={13} className="text-purple-400" />,
  "To Do": <Circle size={13} className="text-[#556080]" />,
};

export default function TasksTab() {
  const [view, setView] = useState("List");
  const [priority, setPriority] = useState("All");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filtered = priority === "All" ? tasks : tasks.filter(t => t.priority === priority);
  const groups = ["To Do", "In Progress", "In Review", "Completed"];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-[#e8eaf2]">Task Manager</h2>
          <p className="text-xs text-[#8b92a9]">{tasks.length} tasks across {[...new Set(tasks.map(t => t.project))].length} projects</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View switcher */}
          <div className="flex items-center bg-[#151922] border border-[#252d3d] rounded-lg p-1">
            {VIEWS.map(v => (
              <button key={v} onClick={() => setView(v)} className={`text-[10px] px-2.5 py-1 rounded transition-colors font-semibold ${view === v ? "bg-[#1f2433] text-[#4f8ef7]" : "text-[#556080] hover:text-[#8b92a9]"}`}>{v}</button>
            ))}
          </div>
          {/* Priority filter dropdown */}
          <div className="relative">
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="btn btn-ghost text-xs flex items-center gap-2 border border-[#252d3d] px-3 py-2">
              <Filter size={12} /> {priority} <ChevronDown size={11} className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-10 bg-[#151922] border border-[#252d3d] rounded-xl shadow-xl z-50 min-w-[130px] overflow-hidden">
                {PRIORITIES.map(p => (
                  <button key={p} onClick={() => { setPriority(p); setDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${priority === p ? "text-[#4f8ef7] bg-[#4f8ef7]/10" : "text-[#8b92a9] hover:bg-[#1f2433] hover:text-[#e8eaf2]"}`}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="btn btn-primary text-xs py-2 px-3 flex items-center gap-1.5"><Plus size={12} /> New Task</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {groups.map(g => {
          const count = tasks.filter(t => t.status === g).length;
          return (
            <div key={g} className="bg-[#0f1117] border border-[#252d3d] rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-[#e8eaf2]">{count}</p>
              <p className={`text-[10px] font-semibold mt-0.5 ${statusStyles[g]}`}>{g}</p>
            </div>
          );
        })}
      </div>

      {/* Task List */}
      <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
        {filtered.map(t => (
          <div key={t.id} className="border border-[#252d3d] rounded-xl p-4 hover:border-[#3a4454] transition-colors bg-[#0f1117] cursor-pointer">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="mt-0.5 shrink-0">{statusIcons[t.status]}</div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#e8eaf2] truncate">{t.title}</p>
                  <p className="text-[10px] text-[#556080] mt-0.5">{t.project} · {t.assignee}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {t.tags.map(tag => (
                      <span key={tag} className="text-[9px] border border-[#252d3d] text-[#8b92a9] px-1.5 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                <span className={`text-[9px] font-bold uppercase tracking-wider border px-1.5 py-0.5 rounded-full ${priorityStyles[t.priority]}`}>{t.priority}</span>
                <div className="flex items-center gap-1 text-[10px] text-[#556080]">
                  <Calendar size={10} /> {t.due}
                </div>
                <span className="text-[9px] font-mono text-[#3a4454]">{t.id}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
