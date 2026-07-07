"use client";
import { useState } from "react";
import { DollarSign, TrendingUp, AlertCircle, CheckCircle, Clock, ChevronDown, Download } from "lucide-react";

const PERIODS = ["Q1 2026", "Q2 2026", "Q3 2026", "FY 2025"];

const expenses = [
  { category: "Software & SaaS", amount: 2840, budget: 3000, items: ["Vercel Pro $20/mo", "Supabase $25/mo", "Linear $8/mo", "Figma $15/mo", "Loom $12/mo", "GitHub $4/mo", "Zoom $15/mo"] },
  { category: "Contractor Payments", amount: 18400, budget: 20000, items: ["UI/UX Designer", "Backend Developer", "QA Engineer", "DevOps Consultant"] },
  { category: "Marketing & Ads", amount: 4320, budget: 5000, items: ["Google Ads $2,100", "LinkedIn Ads $1,200", "Facebook $600", "Content Creation $420"] },
  { category: "Infrastructure", amount: 1240, budget: 1500, items: ["Cloud Hosting", "CDN Services", "Email Provider", "Monitoring"] },
  { category: "Legal & Compliance", amount: 3600, budget: 4000, items: ["Company Registration", "GDPR Audit", "Contract Templates", "IP Filing"] },
  { category: "Office & Admin", amount: 890, budget: 1000, items: ["Coworking Space", "Stationery", "Courier", "Subscriptions"] },
];

const revenueMonths = [
  { month: "Jan", revenue: 12400, target: 10000 },
  { month: "Feb", revenue: 15800, target: 12000 },
  { month: "Mar", revenue: 18200, target: 15000 },
  { month: "Apr", revenue: 14900, target: 16000 },
  { month: "May", revenue: 22100, target: 18000 },
  { month: "Jun", revenue: 26800, target: 22000 },
];

const kpis = [
  { label: "Total Revenue", value: "$110,200", change: "+24.8%", up: true },
  { label: "Net Profit", value: "$68,940", change: "+18.2%", up: true },
  { label: "Total Expenses", value: "$31,290", change: "-4.1%", up: false },
  { label: "Outstanding", value: "$14,600", change: "-8.3%", up: false },
  { label: "Profit Margin", value: "62.6%", change: "+3.4%", up: true },
  { label: "MRR", value: "$18,367", change: "+12.1%", up: true },
];

export default function FinanceTab() {
  const [period, setPeriod] = useState("Q2 2026");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const maxRevenue = Math.max(...revenueMonths.map(m => Math.max(m.revenue, m.target)));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-[#e8eaf2]">Finance Overview</h2>
          <p className="text-xs text-[#8b92a9]">Revenue, expenses and profit analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-ghost text-xs flex items-center gap-1.5 border border-[#252d3d] px-3 py-2">
            <Download size={12} /> Export Report
          </button>
          <div className="relative">
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="btn btn-ghost text-xs flex items-center gap-2 border border-[#252d3d] px-3 py-2">
              <DollarSign size={13} /> {period} <ChevronDown size={12} className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-10 bg-[#151922] border border-[#252d3d] rounded-xl shadow-xl z-50 min-w-[140px] overflow-hidden">
                {PERIODS.map(p => (
                  <button key={p} onClick={() => { setPeriod(p); setDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${period === p ? "text-[#4f8ef7] bg-[#4f8ef7]/10" : "text-[#8b92a9] hover:bg-[#1f2433] hover:text-[#e8eaf2]"}`}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {kpis.map(k => (
          <div key={k.label} className="bg-[#0f1117] border border-[#252d3d] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign size={14} className="text-[#556080]" />
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${k.up ? "text-green-400 bg-green-400/10" : "text-red-400 bg-red-400/10"}`}>{k.change}</span>
            </div>
            <p className="text-lg font-bold text-[#e8eaf2]">{k.value}</p>
            <p className="text-[10px] text-[#556080] mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart (visual bars) */}
      <div className="bg-[#0f1117] border border-[#252d3d] rounded-xl p-5">
        <h3 className="text-xs font-semibold text-[#e8eaf2] mb-5">Monthly Revenue vs. Target</h3>
        <div className="flex items-end gap-3 h-32">
          {revenueMonths.map(m => (
            <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex gap-0.5 items-end" style={{ height: "100px" }}>
                <div className="flex-1 rounded-t-sm bg-[#4f8ef7]" style={{ height: `${(m.revenue / maxRevenue) * 100}%` }} title={`Revenue: $${m.revenue.toLocaleString()}`} />
                <div className="flex-1 rounded-t-sm bg-[#252d3d]" style={{ height: `${(m.target / maxRevenue) * 100}%` }} title={`Target: $${m.target.toLocaleString()}`} />
              </div>
              <span className="text-[9px] text-[#556080]">{m.month}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-[#4f8ef7]" /><span className="text-[10px] text-[#556080]">Revenue</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-[#252d3d]" /><span className="text-[10px] text-[#556080]">Target</span></div>
        </div>
      </div>

      {/* Expenses */}
      <div className="bg-[#0f1117] border border-[#252d3d] rounded-xl p-5">
        <h3 className="text-xs font-semibold text-[#e8eaf2] mb-4">Expense Breakdown</h3>
        <div className="space-y-2 max-h-[50vh] overflow-y-auto">
          {expenses.map(e => {
            const pct = (e.amount / e.budget * 100);
            const isOver = pct > 90;
            return (
              <div key={e.category} className="border border-[#1a2030] rounded-lg overflow-hidden">
                <button onClick={() => setExpanded(expanded === e.category ? null : e.category)}
                  className="w-full p-3 flex items-center justify-between hover:bg-[#151922] transition-colors">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {isOver ? <AlertCircle size={13} className="text-amber-400 shrink-0" /> : <CheckCircle size={13} className="text-green-400 shrink-0" />}
                    <span className="text-xs text-[#e8eaf2] font-medium">{e.category}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-20 h-1.5 bg-[#1a2030] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${isOver ? "bg-amber-400" : "bg-green-400"}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-[#e8eaf2] w-16 text-right">${e.amount.toLocaleString()}</span>
                    <span className="text-[9px] text-[#556080] w-20 text-right">of ${e.budget.toLocaleString()}</span>
                    <ChevronDown size={12} className={`text-[#556080] transition-transform ${expanded === e.category ? "rotate-180" : ""}`} />
                  </div>
                </button>
                {expanded === e.category && (
                  <div className="border-t border-[#1a2030] px-4 py-3 bg-[#0a0c10]">
                    <div className="flex flex-wrap gap-2">
                      {e.items.map((item, i) => (
                        <span key={i} className="text-[10px] bg-[#151922] border border-[#252d3d] text-[#8b92a9] px-2 py-1 rounded-full">{item}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
