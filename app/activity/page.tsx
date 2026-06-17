import { fetchActivityEntries } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Activity, GitCommit, Clock, Layers } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Activity — BetterDose", description: "Recent development activity from the BetterDose team." };

const statusColor: Record<string, string> = {
  Shipped: "bg-[#34d399]/10 text-[#34d399] border-[#34d399]/20",
  Delivered: "bg-[#34d399]/10 text-[#34d399] border-[#34d399]/20",
  Deployed: "bg-[#4f8ef7]/10 text-[#4f8ef7] border-[#4f8ef7]/20",
  Live: "bg-[#4f8ef7]/10 text-[#4f8ef7] border-[#4f8ef7]/20",
  Completed: "bg-[#8b92a9]/10 text-[#8b92a9] border-[#8b92a9]/20",
};

export default async function ActivityPage() {
  const entries = await fetchActivityEntries();

  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <span className="section-label">Business Activity</span>
          <h1 className="text-display mb-5">Recent Development Activity</h1>
          <p className="text-subheading mb-14">
            BetterDose is an actively operating software development business. This page documents recent project completions, shipped features, and ongoing development work.
          </p>

          <h2 className="text-xs font-bold uppercase tracking-widest text-[#556080] mb-6 flex items-center gap-2">
            <Activity size={14} /> Recent Builds &amp; Deliveries
          </h2>

          <div className="relative border-l border-[#252d3d] ml-3 flex flex-col gap-0">
            {entries.map((build, i) => (
              <div key={build.id} className="relative pl-8 pb-8">
                <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-[#252d3d] border-2 border-[#4f8ef7]" />
                <div className="card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-[#e8eaf2]">{build.projectName}</h3>
                        <span className={`text-[9px] font-bold uppercase tracking-wider border px-1.5 py-0.5 rounded-full ${statusColor[build.status] ?? "bg-[#8b92a9]/10 text-[#8b92a9] border-[#8b92a9]/20"}`}>
                          {build.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-[#556080]">
                        <Layers size={10} /><span>{build.entryType}</span>
                        <span>·</span>
                        <Clock size={10} /><span>{build.dateLabel}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-[#8b92a9] leading-relaxed mb-3">{build.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {build.tech.map(t => <span key={t} className="skill-tag text-[9px] py-0.5 px-1.5">{t}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
