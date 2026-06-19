"use client";

import { motion } from "framer-motion";
import { Globe, Plug, Zap, Bot, MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const services = [
  {
    id: "development",
    icon: Globe,
    title: "Development",
    summary: "Full Stack, Frontend, Backend, and API Development.",
    detail: "We build highly scalable web applications and backend systems using industry-standard technologies like React, Next.js, Node.js, and PostgreSQL. From robust APIs to complex user interfaces.",
    examples: ["Full Stack Development", "Frontend Development", "Backend Development", "API Development"],
    stack: ["React", "Next.js", "Node.js", "Python", "SQL"],
  },
  {
    id: "qa-testing",
    icon: Bot, // Just using an existing imported icon, we can use ShieldCheck or Bug if imported, but let's stick to what's likely imported or add an import later. Actually, wait. I need to make sure the icon is imported. Let's use Plug.
    title: "Quality Assurance",
    summary: "Comprehensive software testing to ensure stability and quality.",
    detail: "We rigorously test applications before they hit production, verifying logic flows, UI consistency, and edge cases across varying devices.",
    examples: ["Manual Testing", "Regression Testing", "UAT Testing", "Mobile App Testing", "Website Testing"],
    stack: ["Jest", "Cypress", "Playwright", "Postman", "Selenium"],
  },
  {
    id: "automation",
    icon: Zap,
    title: "Automation",
    summary: "Automate repetitive workflows and business processes.",
    detail: "We engineer scripts and software tools that automate time-consuming manual tasks, data scraping, and file processing.",
    examples: ["Business Automation", "Workflow Automation", "Browser Automation"],
    stack: ["Python", "Selenium", "Playwright", "Bash"],
  },
  {
    id: "ai",
    icon: Bot,
    title: "AI & Machine Learning",
    summary: "Integrate intelligent features into existing software.",
    detail: "We implement machine learning models and AI integrations to create smarter workflows and predictive data pipelines.",
    examples: ["AI Integrations", "Machine Learning Projects", "Model Training Pipelines"],
    stack: ["OpenAI API", "Python", "TensorFlow / PyTorch concepts"],
  },
  {
    id: "content-media",
    icon: MessageSquare,
    title: "Content & Media",
    summary: "Motion graphics and cinematic animation systems.",
    detail: "We build programmatic motion graphics architectures for rendering professional, cinematic overlays and geographic visualizations.",
    examples: ["Motion Graphics Systems", "Map Animation Systems"],
    stack: ["Remotion", "React", "Three.js", "CesiumJS"],
  },
  {
    id: "wordpress",
    icon: Globe,
    title: "WordPress",
    summary: "Custom theme and plugin development for content sites.",
    detail: "We manage, develop, and optimize WordPress installations for content-heavy businesses.",
    examples: ["Site Development", "Site Management", "Custom Plugin Development"],
    stack: ["PHP", "MySQL", "WordPress API"],
  },
  {
    id: "performance-optimization",
    icon: Zap,
    title: "Performance Optimization",
    summary: "Speed up existing software and database layers.",
    detail: "We review existing codebases and database architectures to identify and fix performance bottlenecks.",
    examples: ["Database Indexing", "Asset Optimization", "Caching Strategies"],
    stack: ["Redis", "PostgreSQL", "CDN Configuration"],
  }
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* ─── HERO BANNER ─────────────────────────────── */}
      <section className="relative pt-32 pb-0 overflow-hidden">
        <div className="relative h-64 md:h-80 w-full">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f1117]/50 via-transparent to-[#0f1117] z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f1117]/60 via-transparent to-[#0f1117]/60 z-10" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/services-hero.png" alt="BetterDose Services" className="w-full h-full object-cover object-center" />
          <div className="absolute bottom-10 left-6 md:left-12 z-20 max-w-5xl">
            <span className="section-label">Services</span>
            <h1 className="text-display mt-1">What We Can Build For You</h1>
          </div>
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-2xl pt-10 pb-10 border-b border-[#252d3d] mb-14"
          >
            <p className="text-subheading">
              BetterDose works with businesses and individuals on software projects that have a clear purpose.
              Here&apos;s what we specialize in.
            </p>
          </motion.div>

          {/* Service blocks */}
          <div className="flex flex-col gap-8">
            {services.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <motion.div
                  key={svc.id}
                  id={svc.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="card p-8"
                >
                  <div className="grid md:grid-cols-3 gap-8">
                    {/* Left: header + summary */}
                    <div className="md:col-span-1">
                      <div className="w-10 h-10 rounded-lg bg-[#1f2433] border border-[#252d3d] flex items-center justify-center mb-4">
                        <Icon size={18} className="text-[#4f8ef7]" />
                      </div>
                      <h2 className="text-lg font-semibold text-[#e8eaf2] mb-2">{svc.title}</h2>
                      <p className="text-sm text-[#8b92a9]">{svc.summary}</p>
                    </div>

                    {/* Right: detail */}
                    <div className="md:col-span-2 flex flex-col gap-5">
                      <p className="text-sm text-[#8b92a9] leading-relaxed">{svc.detail}</p>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-[#556080] mb-2.5">
                          Examples
                        </p>
                        <ul className="flex flex-col gap-1.5">
                          {svc.examples.map((ex) => (
                            <li key={ex} className="flex items-center gap-2 text-sm text-[#8b92a9]">
                              <span className="w-1 h-1 rounded-full bg-[#4f8ef7] shrink-0" />
                              {ex}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {svc.stack.map((t) => (
                          <span key={t} className="skill-tag">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mt-14 card p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
          >
            <div>
              <h3 className="font-semibold text-[#e8eaf2] mb-1">Not sure if your project is a good fit?</h3>
              <p className="text-sm text-[#8b92a9]">
                Send us a brief description and we&apos;ll give you an honest answer.
              </p>
            </div>
            <Link href="/contact" className="btn btn-primary shrink-0">
              Get In Touch
              <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
