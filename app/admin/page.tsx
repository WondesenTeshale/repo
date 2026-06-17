"use client";
import { useState, useEffect, useCallback } from "react";
import { LogIn, LogOut, FolderGit, Users, Activity, HardDrive, Settings } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchProjects, fetchConfig, fetchTeamMembers, fetchActivityEntries, HASHED_USER, HASHED_PASS, Project, BusinessConfig, TeamMember, ActivityEntry } from "@/lib/db";
import ProjectsTab from "./components/ProjectsTab";
import TeamTab from "./components/TeamTab";
import ActivityTab from "./components/ActivityTab";
import MediaTab from "./components/MediaTab";
import SettingsTab from "./components/SettingsTab";

async function sha256(msg: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(msg));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

type Tab = "projects" | "team" | "activity" | "media" | "settings";

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "projects", label: "Projects", icon: <FolderGit size={14} /> },
  { key: "team", label: "Team", icon: <Users size={14} /> },
  { key: "activity", label: "Activity", icon: <Activity size={14} /> },
  { key: "media", label: "Media", icon: <HardDrive size={14} /> },
  { key: "settings", label: "Settings", icon: <Settings size={14} /> },
];

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("projects");

  const [projects, setProjects] = useState<Project[]>([]);
  const [config, setConfig] = useState<BusinessConfig | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    const [p, c, t, a] = await Promise.all([fetchProjects(), fetchConfig(), fetchTeamMembers(), fetchActivityEntries()]);
    setProjects(p); setConfig(c); setMembers(t); setEntries(a);
    setLoading(false);
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_auth");
    const savedToken = sessionStorage.getItem("admin_token");
    if (saved === "true" && savedToken) { setAuthed(true); setToken(savedToken); loadAll(); }
  }, [loadAll]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const hu = await sha256(username.trim());
    const hp = await sha256(password.trim());
    if (hu === HASHED_USER && hp === HASHED_PASS) {
      const t = `${hu}:${hp}`;
      setToken(t); setAuthed(true); setError("");
      sessionStorage.setItem("admin_auth", "true");
      sessionStorage.setItem("admin_token", t);
      loadAll();
    } else {
      setError("Invalid credentials.");
    }
  };

  const handleLogout = () => {
    setAuthed(false); setToken(""); setUsername(""); setPassword("");
    sessionStorage.removeItem("admin_auth"); sessionStorage.removeItem("admin_token");
  };

  if (!authed) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <section className="pt-40 pb-24 px-6 flex items-center justify-center">
          <div className="card p-8 w-full max-w-sm">
            <h1 className="text-heading mb-6">Admin Login</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#556080] mb-1 block">Username</label>
                <input className="input w-full" type="text" value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#556080] mb-1 block">Password</label>
                <input className="input w-full" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
              <button type="submit" className="btn btn-primary w-full justify-center"><LogIn size={14} /> Sign In</button>
            </form>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="pt-28 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="section-label">Admin</span>
              <h1 className="text-display">Dashboard</h1>
            </div>
            <button type="button" onClick={handleLogout} className="btn btn-ghost text-xs py-1.5 px-3"><LogOut size={13} /> Logout</button>
          </div>

          {/* Tab Nav */}
          <div className="flex gap-1 mb-8 flex-wrap border-b border-[#252d3d] pb-0">
            {TABS.map(t => (
              <button key={t.key} type="button" onClick={() => setTab(t.key)}
                className={`flex items-center gap-1.5 text-xs px-4 py-2.5 border-b-2 transition-colors -mb-px ${tab === t.key ? "border-[#4f8ef7] text-[#4f8ef7]" : "border-transparent text-[#556080] hover:text-[#8b92a9]"}`}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="text-sm text-[#556080]">Loading data from Supabase...</p>
          ) : (
            <div className="card p-8">
              {tab === "projects" && <ProjectsTab projects={projects} token={token} onRefresh={loadAll} />}
              {tab === "team" && <TeamTab members={members} token={token} onRefresh={loadAll} />}
              {tab === "activity" && <ActivityTab entries={entries} token={token} onRefresh={loadAll} />}
              {tab === "media" && <MediaTab token={token} />}
              {tab === "settings" && config && <SettingsTab config={config} token={token} onRefresh={loadAll} />}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
