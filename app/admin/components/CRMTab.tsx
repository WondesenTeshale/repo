"use client";
import { useState, useEffect, useCallback } from "react";
import { Trash2, ChevronDown, MessageSquare, Mail, Building2, Clock, RefreshCw } from "lucide-react";
import { Lead, fetchLeads, apiUpdateLead, apiDeleteLead } from "@/lib/db";

interface Props { token: string; }

const STATUSES = ["New", "Discovery", "Proposal Sent", "Development", "Testing", "Completed"];

const statusColors: Record<string, string> = {
  "New": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Discovery": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "Proposal Sent": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "Development": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "Testing": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "Completed": "bg-green-500/20 text-green-400 border-green-500/30",
};

const PIPELINE = ["New", "Discovery", "Proposal Sent", "Development", "Testing", "Completed"];

export default function CRMTab({ token }: Props) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("All");
  const [revealedEmails, setRevealedEmails] = useState<Set<string>>(new Set());

  const toggleEmail = (id: string) => {
    setRevealedEmails(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const maskEmail = (email: string) => {
    if (!email) return "";
    const parts = email.split("@");
    if (parts.length !== 2) return email;
    return `****@${parts[1]}`;
  };

  const load = useCallback(async () => {
    setLoading(true);
    const data = await fetchLeads(token);
    setLeads(data);
    setLoading(false);
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: string, status: string) => {
    setSaving(id);
    await apiUpdateLead(id, { status }, token);
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    setSaving(null);
  };

  const saveNotes = async (id: string) => {
    setSaving(id);
    await apiUpdateLead(id, { notes: editingNotes[id] ?? "" }, token);
    setLeads(prev => prev.map(l => l.id === id ? { ...l, notes: editingNotes[id] ?? l.notes } : l));
    setSaving(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this lead permanently?")) return;
    await apiDeleteLead(id, token);
    setLeads(prev => prev.filter(l => l.id !== id));
  };

  const filtered = filter === "All" ? leads : leads.filter(l => l.status === filter);
  const counts = STATUSES.reduce((acc, s) => ({ ...acc, [s]: leads.filter(l => l.status === s).length }), {} as Record<string, number>);

  if (loading) return <p className="text-sm text-[#556080]">Loading CRM data...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-sm font-semibold text-[#e8eaf2]">CRM Pipeline ({leads.length} leads)</h2>
          <p className="text-[10px] text-[#556080] mt-0.5">All contact form and enquiry submissions</p>
        </div>
        <button onClick={load} className="btn btn-ghost text-xs py-1.5 px-3 flex items-center gap-1.5">
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {/* Pipeline summary bar */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-6">
        {PIPELINE.map(s => (
          <button key={s} onClick={() => setFilter(filter === s ? "All" : s)}
            className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${filter === s ? "border-[#4f8ef7]/60 bg-[#4f8ef7]/10" : "border-[#252d3d] bg-[#0f1117] hover:border-[#252d3d]/80"}`}>
            <div className={`text-lg font-bold ${filter === s ? "text-[#4f8ef7]" : "text-[#e8eaf2]"}`}>{counts[s] ?? 0}</div>
            <div className="text-[9px] text-[#556080] uppercase tracking-widest mt-0.5 leading-tight">{s}</div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-[#556080]">
          <MessageSquare size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No leads with status &quot;{filter}&quot;</p>
        </div>
      )}

      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {filtered.map(lead => (
          <div key={lead.id} className="card border border-[#252d3d] overflow-hidden">
            {/* Lead header */}
            <div className="p-4 flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[10px] font-mono text-[#4f8ef7] font-bold">#{lead.leadNumber ?? "—"}</span>
                  <span className={`text-[9px] font-bold uppercase tracking-wider border px-1.5 py-0.5 rounded-full ${statusColors[lead.status] ?? "bg-[#8b92a9]/10 text-[#8b92a9] border-[#8b92a9]/20"}`}>
                    {lead.status}
                  </span>
                  <span className="text-[9px] text-[#556080]">{lead.source}</span>
                </div>
                <p className="text-sm font-semibold text-[#e8eaf2] truncate">{lead.name}</p>
                <div className="flex items-center gap-3 text-[10px] text-[#556080] mt-0.5 flex-wrap">
                  <button onClick={() => toggleEmail(lead.id)} className="flex items-center gap-1 hover:text-[#4f8ef7] transition-colors text-left">
                    <Mail size={9} />
                    {revealedEmails.has(lead.id) ? lead.email : maskEmail(lead.email)}
                  </button>
                  {lead.company && <span className="flex items-center gap-1"><Building2 size={9} />{lead.company}</span>}
                  <span className="flex items-center gap-1"><Clock size={9} />{new Date(lead.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
                {lead.subject && <p className="text-[11px] text-[#8b92a9] mt-1 italic">&ldquo;{lead.subject}&rdquo;</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => setExpanded(expanded === lead.id ? null : lead.id)}
                  className="btn btn-ghost text-xs py-1 px-2 flex items-center gap-1">
                  <ChevronDown size={12} className={`transition-transform ${expanded === lead.id ? "rotate-180" : ""}`} />
                </button>
                <button onClick={() => handleDelete(lead.id)} className="btn btn-ghost text-xs py-1 px-2 text-red-400">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>

            {/* Expanded section */}
            {expanded === lead.id && (
              <div className="border-t border-[#252d3d] p-4 space-y-4 bg-[#0a0c10]">
                {/* Message */}
                {lead.message && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#556080] mb-1">Message</p>
                    <p className="text-xs text-[#8b92a9] leading-relaxed bg-[#0f1117] rounded-lg p-3 border border-[#1a2030]">{lead.message}</p>
                  </div>
                )}

                {/* Pipeline status */}
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#556080] mb-2">Pipeline Stage</p>
                  <div className="flex flex-wrap gap-1.5">
                    {STATUSES.map(s => (
                      <button key={s} onClick={() => updateStatus(lead.id, s)} disabled={saving === lead.id}
                        className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${lead.status === s ? `${statusColors[s]} font-bold` : "border-[#252d3d] text-[#556080] hover:border-[#4f8ef7]/30"}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#556080] mb-1">Internal Notes</p>
                  <textarea
                    rows={3}
                    className="input w-full resize-none text-xs"
                    placeholder="Add internal notes about this lead..."
                    defaultValue={lead.notes}
                    onChange={e => setEditingNotes(prev => ({ ...prev, [lead.id]: e.target.value }))}
                  />
                  <button onClick={() => saveNotes(lead.id)} disabled={saving === lead.id}
                    className="btn btn-primary text-xs py-1 px-3 mt-2">
                    {saving === lead.id ? "Saving..." : "Save Notes"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
