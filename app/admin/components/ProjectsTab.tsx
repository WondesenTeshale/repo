"use client";
import { useState } from "react";
import { Plus, Edit2, Trash2, Save, X, Upload } from "lucide-react";
import { Project, newProject, apiUpsertProject, apiDeleteProject, apiUploadFile, rowToProject } from "@/lib/db";

interface Props { projects: Project[]; token: string; onRefresh: () => void; }

const EMPTY = newProject();

export default function ProjectsTab({ projects, token, onRefresh }: Props) {
  const [editing, setEditing] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const startNew = () => setEditing({ ...EMPTY, id: crypto.randomUUID() });
  const startEdit = (p: Project) => setEditing({ ...p });
  const cancel = () => setEditing(null);

  const set = (k: keyof Project, v: unknown) => setEditing(e => e ? { ...e, [k]: v } : e);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    await apiUpsertProject(editing, token);
    setSaving(false);
    setEditing(null);
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    await apiDeleteProject(id, token);
    onRefresh();
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || !editing) return;
    setUploading(true);
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const r = await apiUploadFile(file, "portfolio-images", token);
      if (r) urls.push(r.url);
    }
    set("screenshots", [...(editing.screenshots ?? []), ...urls]);
    setUploading(false);
  };

  const removeScreenshot = (url: string) =>
    setEditing(e => e ? { ...e, screenshots: e.screenshots.filter(s => s !== url) } : e);

  if (editing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-semibold text-[#e8eaf2]">{editing.name || "New Project"}</h2>
          <button type="button" onClick={cancel} className="btn btn-ghost text-xs py-1.5 px-3"><X size={13} /> Cancel</button>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            ["Project Name", "name", "text"],
            ["Display Order", "displayOrder", "number"],
            ["GitHub Repository", "githubRepository", "text"],
            ["Live Demo URL", "liveDemo", "text"],
            ["Start Date", "projectStartDate", "date"],
            ["End Date", "projectEndDate", "date"],
            ["Status", "status", "text"],
            ["Client Type", "clientType", "text"],
          ].map(([label, key, type]) => (
            <div key={key}>
              <label className="text-[10px] uppercase tracking-widest text-[#556080] mb-1 block">{label}</label>
              <input type={type} value={(editing as never)[key] ?? ""} onChange={e => set(key as keyof Project, type === "number" ? parseInt(e.target.value) || 0 : e.target.value)} className="input w-full" />
            </div>
          ))}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-[#556080] mb-1 block">Category</label>
            <select value={editing.category} onChange={e => set("category", e.target.value)} className="input w-full">
              <option value="completed">Completed</option>
              <option value="ongoing">Ongoing</option>
              <option value="university">University</option>
              <option value="qa-testing">QA & Testing</option>
            </select>
          </div>
        </div>
        {([
          ["What Problem Was Solved (Description)", "description"],
          ["Features (one per line)", "features"],
          ["Team Members (comma separated)", "teamMembers"],
          ["Technologies Used (comma separated)", "technologiesUsed"],
          ["Technical Architecture", "technicalArchitecture"],
          ["Project Outcome", "projectOutcome"],
          ["Project Challenges", "projectChallenges"],
          ["Notes", "notes"],
        ] as [string, string][]).map(([label, key]) => (
          <div key={key}>
            <label className="text-[10px] uppercase tracking-widest text-[#556080] mb-1 block">{label}</label>
            <textarea
              rows={3}
              className="input w-full resize-none"
              value={Array.isArray((editing as never)[key]) ? ((editing as never)[key] as string[]).join(key === "features" ? "\n" : ", ") : (editing as never)[key] ?? ""}
              onChange={e => {
                const val = e.target.value;
                if (key === "features") set(key as keyof Project, val.split("\n").filter(Boolean));
                else if (key === "teamMembers" || key === "technologiesUsed") set(key as keyof Project, val.split(",").map(s => s.trim()).filter(Boolean));
                else set(key as keyof Project, val);
              }}
            />
          </div>
        ))}
        <div>
          <label className="text-[10px] uppercase tracking-widest text-[#556080] mb-2 block">Screenshots</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {editing.screenshots.map(url => (
              <div key={url} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="screenshot" className="h-20 w-28 object-cover rounded border border-[#252d3d]" />
                <button type="button" onClick={() => removeScreenshot(url)} className="absolute top-1 right-1 bg-red-500 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"><X size={10} /></button>
              </div>
            ))}
          </div>
          <label className="btn btn-ghost text-xs py-1.5 px-3 cursor-pointer inline-flex items-center gap-1.5">
            <Upload size={13} /> {uploading ? "Uploading..." : "Upload Screenshots"}
            <input type="file" multiple accept="image/*" className="hidden" onChange={e => handleImageUpload(e.target.files)} disabled={uploading} />
          </label>
        </div>
        <button type="button" onClick={handleSave} disabled={saving} className="btn btn-primary w-full justify-center">
          <Save size={14} /> {saving ? "Saving..." : "Save Project"}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-semibold text-[#e8eaf2]">Projects ({projects.length})</h2>
        <button type="button" onClick={startNew} className="btn btn-primary text-xs py-1.5 px-3"><Plus size={13} /> Add Project</button>
      </div>
      <div className="space-y-3">
        {projects.map(p => (
          <div key={p.id} className="card p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[#e8eaf2]">{p.name}</p>
              <p className="text-[10px] text-[#556080] mt-0.5">{p.category} · {p.status}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => startEdit(p)} className="btn btn-ghost text-xs py-1 px-2"><Edit2 size={12} /></button>
              <button type="button" onClick={() => handleDelete(p.id)} className="btn btn-ghost text-xs py-1 px-2 text-red-400"><Trash2 size={12} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
