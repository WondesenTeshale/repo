import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, Lightbulb, FileText, Code2, FlaskConical, PackageCheck, Headphones } from "lucide-react";

export const metadata = {
  title: "How We Work — BetterDose",
  description: "A transparent look at how BetterDose takes a project from first contact to final delivery and ongoing support.",
};

const stages = [
  { icon: Search, number: "01", title: "Inquiry", subtitle: "First Contact", description: "You reach out via the contact form or Work With Us page. We review your request within 24 hours and respond with initial thoughts and any clarifying questions.", color: "#4f8ef7" },
  { icon: Lightbulb, number: "02", title: "Discovery", subtitle: "Understanding Your Needs", description: "We schedule a discovery session to understand your goals, technical constraints, existing infrastructure, and success criteria. This informs our proposal.", color: "#818cf8" },
  { icon: FileText, number: "03", title: "Proposal", subtitle: "Scope & Agreement", description: "We deliver a clear written proposal covering project scope, timeline, tech stack, and pricing. Once agreed, work begins. No hidden costs or scope creep.", color: "#a78bfa" },
  { icon: Code2, number: "04", title: "Development", subtitle: "Building Your Product", description: "Our team gets to work in structured sprints. You receive regular progress updates and can review work at each milestone before we move forward.", color: "#f59e0b" },
  { icon: FlaskConical, number: "05", title: "QA & Testing", subtitle: "Quality Assurance", description: "Every deliverable goes through rigorous QA — functional testing, edge case coverage, performance checks, and cross-device/browser validation before release.", color: "#06b6d4" },
  { icon: PackageCheck, number: "06", title: "Delivery", subtitle: "Handover & Launch", description: "We deploy to your environment, hand over all documentation, credentials, and source code. A walkthrough session ensures you are fully in control of what was built.", color: "#34d399" },
  { icon: Headphones, number: "07", title: "Support", subtitle: "Post-Launch Care", description: "Post-delivery support covers bug fixes, small improvements, and guidance as you grow — because long-term relationships matter.", color: "#f87171" },
];

export default function HowWeWorkPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16">
            <span className="section-label">Process</span>
            <h1 className="text-display mb-4">How We Work</h1>
            <p className="text-subheading max-w-2xl">
              From your first message to ongoing support — a transparent, structured process that keeps you informed and in control at every stage.
            </p>
          </div>

          <div className="space-y-4">
            {stages.map((stage) => {
              const Icon = stage.icon;
              return (
                <div key={stage.number} className="card p-6 flex items-start gap-5 group hover:border-[#4f8ef7]/20 transition-all hover:-translate-y-0.5 duration-200">
                  <div className="w-12 h-12 rounded-full border-2 flex items-center justify-center shrink-0" style={{ borderColor: stage.color }}>
                    <Icon size={18} style={{ color: stage.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <span className="text-[10px] font-mono font-bold" style={{ color: stage.color }}>{stage.number}</span>
                      <h2 className="text-sm font-bold text-[#e8eaf2]">{stage.title}</h2>
                      <span className="text-[10px] text-[#556080]">— {stage.subtitle}</span>
                    </div>
                    <p className="text-xs text-[#8b92a9] leading-relaxed">{stage.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-14 card p-8 text-center">
            <h2 className="text-base font-semibold text-[#e8eaf2] mb-2">Ready to start a project?</h2>
            <p className="text-sm text-[#8b92a9] mb-5">The first step is a conversation. Tell us what you are building and we will take it from there.</p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <a href="/contact" className="btn btn-primary text-sm px-6 py-2.5 inline-flex items-center gap-2">Contact Us</a>
              <a href="/work-with-us" className="btn btn-ghost text-sm px-6 py-2.5 inline-flex items-center gap-2">Work With Us</a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
