"use client";
import { useState } from "react";
import { Save, Lock } from "lucide-react";
import { BusinessConfig, LOCKED_IDENTITY, apiSaveConfig } from "@/lib/db";

interface Props { config: BusinessConfig; token: string; onRefresh: () => void; }

export default function SettingsTab({ config, token, onRefresh }: Props) {
  const [form, setForm] = useState(config);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (k: keyof BusinessConfig, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    await apiSaveConfig(form, token);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-[#e8eaf2] mb-1">Business Settings</h2>
        <p className="text-xs text-[#556080]">Edit contact and social links. Legal identity is locked.</p>
      </div>

      {/* Locked identity fields */}
      <div className="p-4 rounded-lg bg-[#0f1117] border border-[#252d3d]/60">
        <div className="flex items-center gap-1.5 mb-3">
          <Lock size={12} className="text-[#556080]" />
          <span className="text-[10px] uppercase tracking-widest text-[#556080] font-bold">Locked Identity — Read Only</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {([
            ["Business Name", LOCKED_IDENTITY.businessName],
            ["Owner / Director", LOCKED_IDENTITY.ownerName],
            ["UK Registration No.", LOCKED_IDENTITY.ukRegistryNumber],
            ["Operating Address", LOCKED_IDENTITY.address],
          ] as [string, string][]).map(([label, val]) => (
            <div key={label}>
              <p className="text-[10px] text-[#556080] mb-0.5">{label}</p>
              <p className="text-xs text-[#8b92a9] font-mono">{val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Editable fields */}
      <div className="grid sm:grid-cols-2 gap-4">
        {([
          ["Contact Email", "email"],
          ["Phone Number 1", "phone"],
          ["Phone Number 2", "phone2"],
          ["Phone Number 3", "phone3"],
          ["LinkedIn — Nebiyu", "linkedInNebiyu"],
          ["GitHub — Nebiyu", "githubNebiyu"],
          ["LinkedIn — Eyob", "linkedInEyob"],
          ["GitHub — Eyob", "githubEyob"],
          ["LinkedIn — Abel", "linkedInAbel"],
          ["GitHub — Abel", "githubAbel"],
        ] as [string, keyof BusinessConfig][]).map(([label, key]) => (
          <div key={key}>
            <label className="text-[10px] uppercase tracking-widest text-[#556080] mb-1 block">{label}</label>
            <input type="text" value={(form[key] as string) ?? ""} onChange={e => set(key, e.target.value)} className="input w-full" />
          </div>
        ))}
      </div>

      <button type="button" onClick={handleSave} disabled={saving} className="btn btn-primary">
        <Save size={14} /> {saving ? "Saving..." : saved ? "Saved!" : "Save Settings"}
      </button>
    </div>
  );
}
