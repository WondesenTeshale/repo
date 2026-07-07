"use client";
import { useState } from "react";
import { TrendingUp, TrendingDown, BarChart2, Globe, Users, Eye, ChevronDown } from "lucide-react";

const FILTERS = ["Last 7 Days", "Last 30 Days", "Last 90 Days", "This Year"];

const trafficSources = [
  { source: "Organic Search", visits: 12840, change: +18.4, color: "#4f8ef7" },
  { source: "Direct", visits: 7320, change: +5.2, color: "#818cf8" },
  { source: "Referral", visits: 4910, change: -2.1, color: "#34d399" },
  { source: "Social Media", visits: 3670, change: +31.7, color: "#fb923c" },
  { source: "Email Campaign", visits: 2140, change: +9.8, color: "#a78bfa" },
  { source: "Paid Ads", visits: 1880, change: -5.4, color: "#f472b6" },
];

const topPages = [
  { page: "/", title: "Home", views: 18420, avgTime: "2m 34s", bounceRate: "38%" },
  { page: "/services", title: "Services", views: 9340, avgTime: "3m 12s", bounceRate: "28%" },
  { page: "/portfolio", title: "Portfolio", views: 7810, avgTime: "4m 55s", bounceRate: "22%" },
  { page: "/contact", title: "Contact", views: 5230, avgTime: "1m 48s", bounceRate: "42%" },
  { page: "/about", title: "About Us", views: 4120, avgTime: "2m 10s", bounceRate: "35%" },
  { page: "/pricing", title: "Pricing", views: 3870, avgTime: "3m 40s", bounceRate: "31%" },
  { page: "/blog", title: "Blog", views: 2940, avgTime: "5m 20s", bounceRate: "19%" },
  { page: "/case-studies", title: "Case Studies", views: 2180, avgTime: "6m 02s", bounceRate: "17%" },
];

const geoData = [
  { country: "United Kingdom", flag: "🇬🇧", sessions: 8420, percent: 29.1 },
  { country: "United States", flag: "🇺🇸", sessions: 6310, percent: 21.8 },
  { country: "Ethiopia", flag: "🇪🇹", sessions: 4870, percent: 16.8 },
  { country: "Canada", flag: "🇨🇦", sessions: 2340, percent: 8.1 },
  { country: "Germany", flag: "🇩🇪", sessions: 1920, percent: 6.6 },
  { country: "Australia", flag: "🇦🇺", sessions: 1540, percent: 5.3 },
  { country: "UAE", flag: "🇦🇪", sessions: 1220, percent: 4.2 },
  { country: "Netherlands", flag: "🇳🇱", sessions: 980, percent: 3.4 },
];

const kpis = [
  { label: "Total Sessions", value: "28,940", change: "+14.2%", up: true, icon: <Globe size={16} /> },
  { label: "Unique Visitors", value: "21,380", change: "+9.7%", up: true, icon: <Users size={16} /> },
  { label: "Page Views", value: "94,210", change: "+22.1%", up: true, icon: <Eye size={16} /> },
  { label: "Avg. Session Duration", value: "3m 24s", change: "+0:18", up: true, icon: <BarChart2 size={16} /> },
  { label: "Bounce Rate", value: "32.4%", change: "-3.8%", up: false, icon: <TrendingDown size={16} /> },
  { label: "Conversion Rate", value: "4.7%", change: "+1.2%", up: true, icon: <TrendingUp size={16} /> },
];

export default function AnalyticsTab() {
  const [filter, setFilter] = useState("Last 30 Days");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-[#e8eaf2]">Website Analytics</h2>
          <p className="text-xs text-[#8b92a9]">Traffic, performance and engagement metrics</p>
        </div>
        <div className="relative">
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="btn btn-ghost text-xs flex items-center gap-2 border border-[#252d3d] px-3 py-2">
            <BarChart2 size={13} /> {filter} <ChevronDown size={12} className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 top-10 bg-[#151922] border border-[#252d3d] rounded-xl shadow-xl z-50 min-w-[160px] overflow-hidden">
              {FILTERS.map(f => (
                <button key={f} onClick={() => { setFilter(f); setDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${filter === f ? "text-[#4f8ef7] bg-[#4f8ef7]/10" : "text-[#8b92a9] hover:bg-[#1f2433] hover:text-[#e8eaf2]"}`}>
                  {f}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {kpis.map(k => (
          <div key={k.label} className="bg-[#0f1117] border border-[#252d3d] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#556080]">{k.icon}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${k.up ? "text-green-400 bg-green-400/10" : "text-red-400 bg-red-400/10"}`}>{k.change}</span>
            </div>
            <p className="text-lg font-bold text-[#e8eaf2]">{k.value}</p>
            <p className="text-[10px] text-[#556080] mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <div className="bg-[#0f1117] border border-[#252d3d] rounded-xl p-5">
          <h3 className="text-xs font-semibold text-[#e8eaf2] mb-4">Traffic Sources</h3>
          <div className="space-y-3">
            {trafficSources.map(s => {
              const total = trafficSources.reduce((a, b) => a + b.visits, 0);
              const pct = (s.visits / total * 100).toFixed(1);
              return (
                <div key={s.source}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[#8b92a9]">{s.source}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[#e8eaf2] font-semibold">{s.visits.toLocaleString()}</span>
                      <span className={`text-[10px] ${s.change > 0 ? "text-green-400" : "text-red-400"}`}>{s.change > 0 ? "+" : ""}{s.change}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-[#1a2030] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: s.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Geo */}
        <div className="bg-[#0f1117] border border-[#252d3d] rounded-xl p-5">
          <h3 className="text-xs font-semibold text-[#e8eaf2] mb-4">Top Countries</h3>
          <div className="space-y-2.5">
            {geoData.map(g => (
              <div key={g.country} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-base">{g.flag}</span>
                  <span className="text-[#8b92a9]">{g.country}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-1.5 bg-[#1a2030] rounded-full overflow-hidden">
                    <div className="h-full bg-[#4f8ef7] rounded-full" style={{ width: `${g.percent}%` }} />
                  </div>
                  <span className="text-[#e8eaf2] font-semibold w-12 text-right">{g.sessions.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Pages */}
      <div className="bg-[#0f1117] border border-[#252d3d] rounded-xl p-5">
        <h3 className="text-xs font-semibold text-[#e8eaf2] mb-4">Top Pages</h3>
        <div className="max-h-[50vh] overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-[#0f1117]">
              <tr className="border-b border-[#252d3d] text-[#556080]">
                <th className="pb-2 text-left font-medium">Page</th>
                <th className="pb-2 text-right font-medium">Views</th>
                <th className="pb-2 text-right font-medium">Avg. Time</th>
                <th className="pb-2 text-right font-medium">Bounce</th>
              </tr>
            </thead>
            <tbody>
              {topPages.map(p => (
                <tr key={p.page} className="border-b border-[#1a2030] hover:bg-[#151922]">
                  <td className="py-2.5">
                    <p className="text-[#e8eaf2] font-medium">{p.title}</p>
                    <p className="text-[9px] text-[#556080] font-mono">{p.page}</p>
                  </td>
                  <td className="py-2.5 text-right text-[#8b92a9]">{p.views.toLocaleString()}</td>
                  <td className="py-2.5 text-right text-[#8b92a9]">{p.avgTime}</td>
                  <td className="py-2.5 text-right text-[#8b92a9]">{p.bounceRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
