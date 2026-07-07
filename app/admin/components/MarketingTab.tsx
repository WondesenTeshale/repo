"use client";
import { useState } from "react";
import { Megaphone, TrendingUp, Send, Clock, BarChart2, ChevronDown, Plus, Eye, MousePointer } from "lucide-react";

const FILTER_OPTIONS = ["All Campaigns", "Active", "Scheduled", "Completed", "Draft"];

const campaigns = [
  { id: "C-001", name: "Summer Outreach — Dev Services", type: "Email", status: "Active", sent: 2840, opens: 1240, clicks: 380, conversions: 28, startDate: "2026-06-15", budget: "$800", roi: "+340%" },
  { id: "C-002", name: "LinkedIn B2B Lead Gen", type: "Social", status: "Active", sent: null, opens: 18400, clicks: 920, conversions: 41, startDate: "2026-07-01", budget: "$1,200", roi: "+510%" },
  { id: "C-003", name: "Case Study Newsletter — Fintech", type: "Email", status: "Completed", sent: 5120, opens: 2340, clicks: 641, conversions: 52, startDate: "2026-05-10", budget: "$400", roi: "+720%" },
  { id: "C-004", name: "Retargeting Ad — Portfolio Visitors", type: "PPC", status: "Active", sent: null, opens: 8900, clicks: 1240, conversions: 37, startDate: "2026-06-28", budget: "$600", roi: "+280%" },
  { id: "C-005", name: "Q3 Product Launch Teaser", type: "Multi-channel", status: "Scheduled", sent: null, opens: null, clicks: null, conversions: null, startDate: "2026-07-20", budget: "$2,500", roi: "Pending" },
  { id: "C-006", name: "Annual Report Broadcast", type: "Email", status: "Draft", sent: null, opens: null, clicks: null, conversions: null, startDate: "—", budget: "$200", roi: "—" },
  { id: "C-007", name: "Google Search Ads — Enterprise SaaS", type: "PPC", status: "Active", sent: null, opens: 22100, clicks: 2840, conversions: 89, startDate: "2026-06-01", budget: "$3,200", roi: "+620%" },
  { id: "C-008", name: "Referral Partner Program Launch", type: "Multi-channel", status: "Completed", sent: 1200, opens: 760, clicks: 340, conversions: 18, startDate: "2026-04-20", budget: "$500", roi: "+390%" },
];

const statusColors: Record<string, string> = {
  Active: "text-green-400 bg-green-400/10 border-green-400/30",
  Scheduled: "text-[#4f8ef7] bg-[#4f8ef7]/10 border-[#4f8ef7]/30",
  Completed: "text-purple-400 bg-purple-400/10 border-purple-400/30",
  Draft: "text-[#556080] bg-[#556080]/10 border-[#556080]/30",
};

const kpis = [
  { label: "Active Campaigns", value: "4", change: "+2", up: true, icon: <Megaphone size={15} /> },
  { label: "Total Reach", value: "52,240", change: "+18.4%", up: true, icon: <Eye size={15} /> },
  { label: "Total Clicks", value: "6,365", change: "+31.2%", up: true, icon: <MousePointer size={15} /> },
  { label: "Avg. Conversion", value: "5.2%", change: "+0.8%", up: true, icon: <TrendingUp size={15} /> },
  { label: "Total Ad Spend", value: "$8,900", change: "+12.4%", up: false, icon: <BarChart2 size={15} /> },
  { label: "Avg. ROI", change: "+440%", value: "+440%", up: true, icon: <Send size={15} /> },
];

export default function MarketingTab() {
  const [filter, setFilter] = useState("All Campaigns");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filtered = filter === "All Campaigns" ? campaigns : campaigns.filter(c => c.status === filter.replace(" Campaigns", ""));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-[#e8eaf2]">Marketing Hub</h2>
          <p className="text-xs text-[#8b92a9]">Campaign performance, reach, and ROI tracking</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="btn btn-ghost text-xs flex items-center gap-2 border border-[#252d3d] px-3 py-2">
              <Megaphone size={12} /> {filter} <ChevronDown size={11} className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-10 bg-[#151922] border border-[#252d3d] rounded-xl shadow-xl z-50 min-w-[180px] overflow-hidden">
                {FILTER_OPTIONS.map(f => (
                  <button key={f} onClick={() => { setFilter(f); setDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${filter === f ? "text-[#4f8ef7] bg-[#4f8ef7]/10" : "text-[#8b92a9] hover:bg-[#1f2433] hover:text-[#e8eaf2]"}`}>
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="btn btn-primary text-xs py-2 px-3 flex items-center gap-1.5"><Plus size={12} /> New Campaign</button>
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

      {/* Campaigns Table */}
      <div className="bg-[#0f1117] border border-[#252d3d] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#252d3d]">
          <h3 className="text-xs font-semibold text-[#e8eaf2]">All Campaigns</h3>
        </div>
        <div className="max-h-[50vh] overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-[#0f1117]">
              <tr className="border-b border-[#252d3d] text-[#556080]">
                <th className="p-3 text-left font-medium">Campaign</th>
                <th className="p-3 text-left font-medium">Type</th>
                <th className="p-3 text-right font-medium">Reach</th>
                <th className="p-3 text-right font-medium">Clicks</th>
                <th className="p-3 text-right font-medium">Conv.</th>
                <th className="p-3 text-right font-medium">Budget</th>
                <th className="p-3 text-right font-medium">ROI</th>
                <th className="p-3 text-center font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="border-b border-[#1a2030] hover:bg-[#151922] cursor-pointer">
                  <td className="p-3">
                    <p className="text-[#e8eaf2] font-medium">{c.name}</p>
                    <p className="text-[9px] text-[#556080] font-mono">{c.id} · Started {c.startDate}</p>
                  </td>
                  <td className="p-3 text-[#8b92a9]">{c.type}</td>
                  <td className="p-3 text-right text-[#8b92a9]">{c.opens?.toLocaleString() ?? "—"}</td>
                  <td className="p-3 text-right text-[#8b92a9]">{c.clicks?.toLocaleString() ?? "—"}</td>
                  <td className="p-3 text-right text-[#8b92a9]">{c.conversions ?? "—"}</td>
                  <td className="p-3 text-right text-[#8b92a9]">{c.budget}</td>
                  <td className="p-3 text-right font-semibold text-green-400">{c.roi}</td>
                  <td className="p-3 text-center">
                    <span className={`text-[9px] font-bold uppercase tracking-wider border px-1.5 py-0.5 rounded-full ${statusColors[c.status]}`}>{c.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
