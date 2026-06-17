import { fetchProjects, fetchConfig } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Portfolio — BetterDose", description: "Software projects built by the BetterDose development team." };

export default async function PortfolioPage() {
  const [projects, config] = await Promise.all([fetchProjects(), fetchConfig()]);

  const completed = projects.filter(p => p.category === "completed");
  const ongoing = projects.filter(p => p.category === "ongoing");
  const university = projects.filter(p => p.category === "university");

  const Section = ({ title, items }: { title: string; items: typeof projects }) => items.length === 0 ? null : (
    <div className="mb-14">
      <h2 className="text-xs font-bold uppercase tracking-widest text-[#556080] mb-5">{title}</h2>
      <div className="grid md:grid-cols-2 gap-5">
        {items.map(p => (
          <div key={p.id} className="card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-semibold text-[#e8eaf2] text-sm">
                  <Link href={`/portfolio/${p.id}`} className="hover:text-[#4f8ef7] transition-colors">{p.name}</Link>
                </h3>
                <span className="badge badge-green shrink-0 text-[10px]">{p.status}</span>
              </div>
              <p className="text-xs text-[#8b92a9] leading-relaxed mb-4">{p.description}</p>
              {p.screenshots[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.screenshots[0]} alt={p.name} className="w-full h-36 object-cover rounded-lg border border-[#252d3d] mb-4" />
              )}
            </div>
            <div>
              <div className="flex flex-wrap gap-1 mb-4">
                {p.technologiesUsed.map(t => <span key={t} className="skill-tag text-[9px]">{t}</span>)}
              </div>
              <div className="pt-3 border-t border-[#1a2030] flex justify-between items-center text-[10px]">
                <span className="text-[#556080]">{p.teamMembers.join(", ")}</span>
                <Link href={`/portfolio/${p.id}`} className="text-[#4f8ef7] hover:underline flex items-center gap-1">
                  Details <ArrowRight size={11} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <span className="section-label">Our Work</span>
          <h1 className="text-display mb-4">Project Portfolio</h1>
          <p className="text-subheading mb-14">Software systems and applications built by {config.businessName}.</p>
          <Section title="Completed Projects" items={completed} />
          <Section title="Ongoing Projects" items={ongoing} />
          <Section title="Academic Projects" items={university} />
        </div>
      </section>
      <Footer />
    </main>
  );
}
