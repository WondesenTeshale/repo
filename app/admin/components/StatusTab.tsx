"use client";
import { useState } from "react";
import { Server, Shield, Wifi, HardDrive, RefreshCw, AlertTriangle, CheckCircle, ChevronDown, Activity } from "lucide-react";

const REFRESH_OPTIONS = ["Auto (30s)", "Auto (60s)", "Manual Only"];

const services = [
  { name: "Main Website", url: "betterdose.dev", status: "Operational", uptime: "99.98%", latency: "42ms", lastCheck: "12s ago", region: "London, UK" },
  { name: "Admin Dashboard", url: "betterdose.dev/admin", status: "Operational", uptime: "99.97%", latency: "48ms", lastCheck: "12s ago", region: "London, UK" },
  { name: "Supabase DB", url: "db.supabase.co", status: "Operational", uptime: "100%", latency: "18ms", lastCheck: "14s ago", region: "EU-West" },
  { name: "Supabase Storage", url: "storage.supabase.co", status: "Operational", uptime: "99.99%", latency: "31ms", lastCheck: "14s ago", region: "EU-West" },
  { name: "Vercel Edge CDN", url: "cdn.vercel-edge.com", status: "Operational", uptime: "99.99%", latency: "9ms", lastCheck: "8s ago", region: "Global" },
  { name: "Email API (Resend)", url: "api.resend.com", status: "Degraded", uptime: "98.41%", latency: "120ms", lastCheck: "22s ago", region: "US-East" },
  { name: "PDF Storage Bucket", url: "documents.betterdose.dev", status: "Operational", uptime: "100%", latency: "28ms", lastCheck: "12s ago", region: "EU-West" },
  { name: "Auth Service", url: "auth.supabase.co", status: "Operational", uptime: "99.98%", latency: "22ms", lastCheck: "14s ago", region: "EU-West" },
];

const serverMetrics = [
  { label: "CPU Usage", value: 24, unit: "%", warn: 80 },
  { label: "Memory", value: 58, unit: "%", warn: 85 },
  { label: "Disk I/O", value: 12, unit: "%", warn: 70 },
  { label: "Network Bandwidth", value: 34, unit: "%", warn: 75 },
];

const recentEvents = [
  { time: "07:42 AM", event: "Deployment #184 completed successfully", type: "success" },
  { time: "07:38 AM", event: "SSL certificate auto-renewed for betterdose.dev", type: "success" },
  { time: "06:15 AM", event: "Scheduled DB backup completed (2.4 GB)", type: "info" },
  { time: "05:00 AM", event: "CRON job: Invoice reminders sent (12 clients)", type: "info" },
  { time: "Yesterday", event: "Email API (Resend) experienced elevated latency", type: "warning" },
  { time: "Yesterday", event: "Deployment #183 rolled back — build failed", type: "error" },
  { time: "2 days ago", event: "Bandwidth spike detected — 2.8x normal traffic", type: "warning" },
  { time: "2 days ago", event: "DDoS mitigation triggered — 1,240 IPs blocked", type: "error" },
];

const eventColors: Record<string, string> = {
  success: "text-green-400 bg-green-400/10 border-green-400/20",
  info: "text-[#4f8ef7] bg-[#4f8ef7]/10 border-[#4f8ef7]/20",
  warning: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  error: "text-red-400 bg-red-400/10 border-red-400/20",
};

export default function StatusTab() {
  const [refresh, setRefresh] = useState("Auto (30s)");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const operational = services.filter(s => s.status === "Operational").length;
  const degraded = services.filter(s => s.status === "Degraded").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-[#e8eaf2]">System Status</h2>
          <div className="flex items-center gap-2 mt-1">
            <div className={`w-2 h-2 rounded-full animate-pulse ${degraded > 0 ? "bg-amber-400" : "bg-green-400"}`} />
            <p className="text-xs text-[#8b92a9]">
              {degraded > 0 ? `${degraded} service degraded` : "All systems operational"} · {operational}/{services.length} services healthy
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-ghost text-xs flex items-center gap-1.5 border border-[#252d3d] px-3 py-2">
            <RefreshCw size={11} /> Refresh Now
          </button>
          <div className="relative">
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="btn btn-ghost text-xs flex items-center gap-2 border border-[#252d3d] px-3 py-2">
              <Activity size={12} /> {refresh} <ChevronDown size={11} className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-10 bg-[#151922] border border-[#252d3d] rounded-xl shadow-xl z-50 min-w-[160px] overflow-hidden">
                {REFRESH_OPTIONS.map(r => (
                  <button key={r} onClick={() => { setRefresh(r); setDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${refresh === r ? "text-[#4f8ef7] bg-[#4f8ef7]/10" : "text-[#8b92a9] hover:bg-[#1f2433] hover:text-[#e8eaf2]"}`}>
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Server Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {serverMetrics.map(m => (
          <div key={m.label} className="bg-[#0f1117] border border-[#252d3d] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <Server size={13} className="text-[#556080]" />
              <span className={`text-xs font-bold ${m.value >= m.warn ? "text-red-400" : "text-green-400"}`}>{m.value}{m.unit}</span>
            </div>
            <div className="h-1.5 bg-[#1a2030] rounded-full overflow-hidden mb-2">
              <div className={`h-full rounded-full transition-all ${m.value >= m.warn ? "bg-red-400" : m.value >= m.warn * 0.7 ? "bg-amber-400" : "bg-green-400"}`} style={{ width: `${m.value}%` }} />
            </div>
            <p className="text-[10px] text-[#556080]">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Services Status */}
      <div className="bg-[#0f1117] border border-[#252d3d] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#252d3d] flex items-center justify-between">
          <h3 className="text-xs font-semibold text-[#e8eaf2]">Service Health</h3>
          <span className="text-[10px] text-[#556080]">Updated {new Date().toLocaleTimeString()}</span>
        </div>
        <div className="divide-y divide-[#1a2030] max-h-[40vh] overflow-y-auto">
          {services.map(s => (
            <div key={s.name} className="p-4 flex items-center justify-between gap-4 flex-wrap hover:bg-[#151922] transition-colors">
              <div className="flex items-center gap-3">
                {s.status === "Operational" ? <CheckCircle size={14} className="text-green-400 shrink-0" /> : <AlertTriangle size={14} className="text-amber-400 shrink-0" />}
                <div>
                  <p className="text-xs font-semibold text-[#e8eaf2]">{s.name}</p>
                  <p className="text-[10px] text-[#556080] font-mono">{s.url}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-[10px] text-[#556080] ml-auto">
                <div><span className="text-[#8b92a9]">{s.latency}</span><br /><span>Latency</span></div>
                <div><span className="text-[#8b92a9]">{s.uptime}</span><br /><span>Uptime</span></div>
                <div><span className="text-[#8b92a9]">{s.region}</span><br /><span>Region</span></div>
                <div><span className="text-[#8b92a9]">{s.lastCheck}</span><br /><span>Checked</span></div>
                <span className={`text-[9px] font-bold uppercase tracking-wider border px-1.5 py-0.5 rounded-full ${s.status === "Operational" ? "text-green-400 bg-green-400/10 border-green-400/30" : "text-amber-400 bg-amber-400/10 border-amber-400/30"}`}>{s.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Event Log */}
      <div className="bg-[#0f1117] border border-[#252d3d] rounded-xl p-5">
        <h3 className="text-xs font-semibold text-[#e8eaf2] mb-4">Recent System Events</h3>
        <div className="space-y-2 max-h-[30vh] overflow-y-auto">
          {recentEvents.map((e, i) => (
            <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${eventColors[e.type]}`}>
              <span className="text-[10px] font-mono shrink-0 mt-0.5 opacity-60">{e.time}</span>
              <p className="text-xs">{e.event}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
