"use client";
import { useState } from "react";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { ActivityEntry, newActivityEntry, apiUpsertActivity, apiDeleteActivity } from "@/lib/db";

interface Props { entries: ActivityEntry[]; token: string; onRefresh: () => void; }

const TYPES = ["Feature", "Delivery", "Deployment", "Repository Update", "Upgrade", "Internal", "Academic"] as const;
const STATUSES = ["Shipped", "Delivered", "Deployed", "Live", "Completed", "In Development"];

export default function ActivityTab({ entries, token, onRefresh }: Props) {
  const [editing, setEditing] = useState<ActivityEntry | null>(null);
  const [saving, setSaving] = useState(false);

  const startNew = () => setEditing({ ...newActivityEntry(), id: crypto.randomUUID() });
  const startEdit = (e: ActivityEntry) => setEditing({ ...e });
  const cancel = () => setEditing(null);
  const set = (k: keyof ActivityEntry, v: unknown) => setEditing(e => e ? { ...e, [k]: v } : e);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    await apiUpsertActivity(editing, token);
    setSaving(false);
    setEditing(null);
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    await apiDeleteActivity(id, token);
    onRefresh();
  };

  const statusColors: Record<string, string> = {
    Shipped: "text-[#34d399]", Delivered: "text-[#34d399]",
    Deployed: "text-[#4f8ef7]", Live: "text-[#4f8ef7]",
    Completed: "text-[#8b92a9]", "In Development": "text-yellow-400",
  };

  if (editing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-semibold text-[#e8eaf2]">{editing.projectName || "New Activity Entry"}</h2>
          <button type="button" onClick={cancel} className="btn btn-ghost text-xs py-1.5 px-3"><X size={13} /> Cancel</button>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-[#556080] mb-1 block">Project Name</label>
            <input type="text" value={editing.projectName} onChange={e => set("projectName", e.target.value)} className="input w-full" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-[#556080] mb-1 block">Date Label (e.g. June 2025)</label>
            <input type="text" value={editing.dateLabel} onChange={e => set("dateLabel", e.target.value)} className="input w-full" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-[#556080] mb-1 block">Entry Type</label>
            <select value={editing.entryType} onChange={e => set("entryType", e.target.value)} className="input w-full">
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-[#556080] mb-1 block">Status</label>
            <select value={editing.status} onChange={e => set("status", e.target.value)} className="input w-full">
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-[#556080] mb-1 block">Display Order</label>
            <input type="number" value={editing.displayOrder} onChange={e => set("displayOrder", parseInt(e.target.value) || 0)} className="input w-full" />
          </div>
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-[#556080] mb-1 block">Description</label>
          <textarea rows={3} value={editing.description} onChange={e => set("description", e.target.value)} className="input w-full resize-none" />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-[#556080] mb-1 block">Tech Stack (comma separated)</label>
          <input type="text" value={editing.tech.join(", ")} onChange={e => set("tech", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} className="input w-full" />
        </div>
        <button type="button" onClick={handleSave} disabled={saving} className="btn btn-primary w-full justify-center">
          <Save size={14} /> {saving ? "Saving..." : "Save Entry"}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-semibold text-[#e8eaf2]">Activity Timeline ({entries.length})</h2>
        <button type="button" onClick={startNew} className="btn btn-primary text-xs py-1.5 px-3"><Plus size={13} /> Add Entry</button>
      </div>
      <div className="space-y-3">
        {entries.map(e => (
          <div key={e.id} className="card p-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[#e8eaf2]">{e.projectName}</p>
              <p className="text-[10px] text-[#556080] mt-0.5">{e.entryType} · {e.dateLabel} · Order: {e.displayOrder}</p>
              <span className={`text-[9px] font-bold ${statusColors[e.status] ?? ""}`}>{e.status}</span>
            </div>
            <div className="flex gap-2 shrink-0">
              <button type="button" onClick={() => startEdit(e)} className="btn btn-ghost text-xs py-1 px-2"><Edit2 size={12} /></button>
              <button type="button" onClick={() => handleDelete(e.id)} className="btn btn-ghost text-xs py-1 px-2 text-red-400"><Trash2 size={12} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
