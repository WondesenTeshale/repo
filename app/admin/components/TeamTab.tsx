"use client";
import { useState } from "react";
import { Plus, Edit2, Trash2, Save, X, Upload } from "lucide-react";
import { TeamMember, newTeamMember, apiUpsertTeamMember, apiDeleteTeamMember, apiUploadFile, rowToTeamMember } from "@/lib/db";

interface Props { members: TeamMember[]; token: string; onRefresh: () => void; }

export default function TeamTab({ members, token, onRefresh }: Props) {
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const startNew = () => setEditing({ ...newTeamMember(), id: crypto.randomUUID() });
  const startEdit = (m: TeamMember) => setEditing({ ...m });
  const cancel = () => setEditing(null);
  const set = (k: keyof TeamMember, v: unknown) => setEditing(e => e ? { ...e, [k]: v } : e);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    await apiUpsertTeamMember(editing, token);
    setSaving(false);
    setEditing(null);
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    await apiDeleteTeamMember(id, token);
    onRefresh();
  };

  const handlePhotoUpload = async (files: FileList | null) => {
    if (!files || !editing) return;
    setUploading(true);
    const r = await apiUploadFile(files[0], "team-photos", token);
    if (r) set("profilePhotoUrl", r.url);
    setUploading(false);
  };

  if (editing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-semibold text-[#e8eaf2]">{editing.name || "New Team Member"}</h2>
          <button type="button" onClick={cancel} className="btn btn-ghost text-xs py-1.5 px-3"><X size={13} /> Cancel</button>
        </div>
        {editing.profilePhotoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={editing.profilePhotoUrl} alt="profile" className="w-20 h-20 rounded-full object-cover border border-[#252d3d]" />
        )}
        <label className="btn btn-ghost text-xs py-1.5 px-3 cursor-pointer inline-flex items-center gap-1.5">
          <Upload size={13} /> {uploading ? "Uploading..." : "Upload Photo"}
          <input type="file" accept="image/*" className="hidden" onChange={e => handlePhotoUpload(e.target.files)} disabled={uploading} />
        </label>
        <div className="grid sm:grid-cols-2 gap-4">
          {([
            ["Name", "name"], ["Role", "role"], ["University Email", "uniEmail"],
            ["Professional Email", "profEmail"], ["GitHub URL", "github"], ["LinkedIn URL", "linkedin"],
          ] as [string, keyof TeamMember][]).map(([label, key]) => (
            <div key={key}>
              <label className="text-[10px] uppercase tracking-widest text-[#556080] mb-1 block">{label}</label>
              <input type="text" value={(editing[key] as string) ?? ""} onChange={e => set(key, e.target.value)} className="input w-full" />
            </div>
          ))}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-[#556080] mb-1 block">Display Order</label>
            <input type="number" value={editing.displayOrder} onChange={e => set("displayOrder", Number(e.target.value))} className="input w-full" />
          </div>
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-[#556080] mb-1 block">Bio</label>
          <textarea rows={3} value={editing.bio} onChange={e => set("bio", e.target.value)} className="input w-full resize-none" />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-[#556080] mb-1 block">Skills (comma separated)</label>
          <input type="text" value={editing.skills.join(", ")} onChange={e => set("skills", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} className="input w-full" />
        </div>
        <button type="button" onClick={handleSave} disabled={saving} className="btn btn-primary w-full justify-center">
          <Save size={14} /> {saving ? "Saving..." : "Save Member"}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-semibold text-[#e8eaf2]">Team Members ({members.length})</h2>
        <button type="button" onClick={startNew} className="btn btn-primary text-xs py-1.5 px-3"><Plus size={13} /> Add Member</button>
      </div>
      <div className="space-y-3">
        {members.map(m => (
          <div key={m.id} className="card p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {m.profilePhotoUrl
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={m.profilePhotoUrl} alt={m.name} className="w-10 h-10 rounded-full object-cover" />
                : <div className="w-10 h-10 rounded-full bg-[#1f2433] border border-[#252d3d] flex items-center justify-center text-xs font-bold text-[#4f8ef7]">{m.name[0]}</div>
              }
              <div>
                <p className="text-sm font-medium text-[#e8eaf2]">{m.name}</p>
                <p className="text-[10px] text-[#556080]">{m.role}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => startEdit(m)} className="btn btn-ghost text-xs py-1 px-2"><Edit2 size={12} /></button>
              <button type="button" onClick={() => handleDelete(m.id)} className="btn btn-ghost text-xs py-1 px-2 text-red-400"><Trash2 size={12} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
