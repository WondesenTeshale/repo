"use client";
import { useState, useEffect, useCallback } from "react";
import { LogIn, LogOut, FolderGit, Users, Activity, HardDrive, Mail, Settings, PhoneCall } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchProjects, fetchAllProjects, fetchConfig, fetchTeamMembers, fetchActivityEntries, HASHED_USER, HASHED_PASS, Project, BusinessConfig, TeamMember, ActivityEntry } from "@/lib/db";
import ProjectsTab from "./components/ProjectsTab";
import TeamTab from "./components/TeamTab";
import ActivityTab from "./components/ActivityTab";
import MediaTab from "./components/MediaTab";
import SettingsTab from "./components/SettingsTab";
import MessagesTab from "./components/MessagesTab";
import CRMTab from "./components/CRMTab";

async function sha256(msg: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(msg));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

type Tab = "projects" | "team" | "activity" | "media" | "messages" | "crm" | "settings";

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "projects", label: "Projects", icon: <FolderGit size={14} /> },
  { key: "team", label: "Team", icon: <Users size={14} /> },
  { key: "activity", label: "Activity", icon: <Activity size={14} /> },
  { key: "media", label: "Media", icon: <HardDrive size={14} /> },
  { key: "messages", label: "Messages", icon: <Mail size={14} /> },
  { key: "crm", label: "CRM", icon: <PhoneCall size={14} /> },
  { key: "settings", label: "Settings", icon: <Settings size={14} /> },
];

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("projects");
  const [forgotClicked, setForgotClicked] = useState(false);

  const [projects, setProjects] = useState<Project[]>([]);
  const [config, setConfig] = useState<BusinessConfig | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    const [p, c, t, a] = await Promise.all([fetchAllProjects(), fetchConfig(), fetchTeamMembers(), fetchActivityEntries()]);
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
      <main className="min-h-screen flex">
        <Navbar />
        {/* Left panel — full-bleed cinematic background */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <img
            src="/images/admin-login-bg.png"
            alt="Admin Portal"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Dark overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f1117]/30 via-transparent to-[#0f1117]/60" />
          {/* Animated floating glow orbs */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#4f8ef7]/10 blur-[80px] animate-pulse" style={{ animationDuration: '3s' }} />
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-[#818cf8]/10 blur-[60px] animate-pulse" style={{ animationDuration: '5s' }} />
          {/* Branding overlay */}
          <div className="relative z-10 flex flex-col justify-end p-12 w-full">
            <div className="mb-3">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#4f8ef7] font-semibold">BetterDose Studio</span>
            </div>
            <h2 className="text-3xl font-bold text-white leading-tight mb-3">
              Secure<br />Admin Portal
            </h2>
            <p className="text-sm text-[#8b92a9] max-w-xs leading-relaxed">
              Authorized personnel only. All access attempts are logged and monitored.
            </p>
            {/* Security badges */}
            <div className="flex items-center gap-3 mt-6">
              <div className="flex items-center gap-1.5 bg-[#0f1117]/60 backdrop-blur-sm border border-[#252d3d] rounded-full px-3 py-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
                <span className="text-[10px] text-[#8b92a9] font-medium">SHA-256 Secured</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#0f1117]/60 backdrop-blur-sm border border-[#252d3d] rounded-full px-3 py-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#4f8ef7]" />
                <span className="text-[10px] text-[#8b92a9] font-medium">Session Encrypted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel — Login form */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center min-h-screen bg-[#0f1117] relative px-8 py-16">
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#4f8ef7]/5 blur-[100px] pointer-events-none" />

          <div className="w-full max-w-sm relative z-10">
            {/* Logo mark */}
            <div className="flex items-center gap-2.5 mb-10">
              <div className="w-8 h-8 rounded-lg bg-[#4f8ef7]/15 border border-[#4f8ef7]/30 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4f8ef7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
                </svg>
              </div>
              <span className="font-semibold text-[#e8eaf2] text-sm tracking-tight">BetterDose</span>
            </div>

            {forgotClicked ? (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-[#e8eaf2] mb-2">Reset Password</h1>
                  <p className="text-sm text-[#8b92a9] leading-relaxed">
                    Administrative credentials must be reset manually by the core team for security.
                  </p>
                </div>

                <div className="bg-[#121620] border border-[#3a4460] rounded-xl p-5 space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4f8ef7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <p className="text-[10px] text-[#4f8ef7] uppercase tracking-widest font-semibold">Contact Address</p>
                  </div>
                  <p className="text-xs text-[#8b92a9]">Send a password reset request to:</p>
                  <a href="mailto:admin@betterdose.dev" className="text-sm text-[#4f8ef7] hover:text-[#6ba3f9] font-semibold block transition-colors">
                    admin@betterdose.dev
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => setForgotClicked(false)}
                  className="btn btn-ghost w-full justify-center"
                >
                  ← Back to Sign In
                </button>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-[#e8eaf2] mb-1">Welcome back</h1>
                  <p className="text-sm text-[#556080]">Sign in to access your dashboard</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-[#556080] mb-2 block font-semibold">Username</label>
                    <input
                      className="input w-full"
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      autoComplete="username"
                      placeholder="Enter your username"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-[10px] uppercase tracking-widest text-[#556080] block font-semibold">Password</label>
                      <button
                        type="button"
                        onClick={() => setForgotClicked(true)}
                        className="text-[10px] text-[#4f8ef7] hover:text-[#6ba3f9] bg-transparent border-0 cursor-pointer p-0 transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <input
                      className="input w-full"
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                      <p className="text-xs text-red-400">{error}</p>
                    </div>
                  )}

                  <button type="submit" className="btn btn-primary w-full justify-center mt-2">
                    <LogIn size={14} /> Sign In to Dashboard
                  </button>
                </form>

                <p className="text-center text-[10px] text-[#3a4460] mt-8">
                  Access restricted to authorized team members only.
                </p>
              </>
            )}
          </div>
        </div>
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
              {tab === "messages" && <MessagesTab token={token} />}
              {tab === "crm" && <CRMTab token={token} />}
              {tab === "settings" && config && <SettingsTab config={config} token={token} onRefresh={loadAll} />}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
