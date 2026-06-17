"use client";

import { motion } from "framer-motion";
import { Globe, Plug, Zap, Bot, MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const services = [
  {
    id: "web-development",
    icon: Globe,
    title: "Custom Web Development",
    summary: "Build responsive web applications using modern technologies.",
    detail:
      "We design and build full-stack web applications tailored to your requirements. This includes everything from simple informational sites to complex multi-user platforms with authentication, databases, and admin dashboards.",
    examples: ["Business management dashboards", "Customer portals", "Internal tools", "CRUD applications"],
    stack: ["React", "Next.js", "Node.js", "Python", "Django", "PostgreSQL", "MySQL"],
  },
  {
    id: "api-development",
    icon: Plug,
    title: "API Development",
    summary: "Design and implement APIs and backend systems.",
    detail:
      "We build RESTful and GraphQL APIs that connect your frontend applications, mobile apps, or third-party services. Clean API design, authentication, rate limiting, and documentation included.",
    examples: ["REST APIs for mobile apps", "Third-party service integrations", "Payment gateway connections", "Backend microservices"],
    stack: ["Node.js", "Express", "FastAPI", "Django REST", "PostgreSQL", "Redis"],
  },
  {
    id: "automation",
    icon: Zap,
    title: "Automation Solutions",
    summary: "Automate repetitive workflows and business processes.",
    detail:
      "We build scripts and software tools that automate time-consuming manual tasks. This includes data processing, file management, scheduled reports, web scraping, and workflow orchestration.",
    examples: ["Automated reporting", "Data import/export pipelines", "Scheduled tasks and cron jobs", "Workflow automation scripts"],
    stack: ["Python", "Bash", "Selenium", "Playwright", "Celery", "Apache Airflow"],
  },
  {
    id: "ai-integration",
    icon: Bot,
    title: "AI Integration",
    summary: "Integrate AI tools and services into existing workflows.",
    detail:
      "We integrate AI capabilities — including language models, document analysis, and intelligent search — into your existing software systems. This is about practical integration, not building AI from scratch.",
    examples: ["AI-assisted content processing", "Document summarization pipelines", "AI chatbot integration", "Intelligent data classification"],
    stack: ["OpenAI API", "LangChain", "Python", "Vector databases", "REST APIs"],
  },
  {
    id: "consulting",
    icon: MessageSquare,
    title: "Technical Consulting",
    summary: "Architecture reviews, project planning, and software guidance.",
    detail:
      "We provide technical guidance for founders and business owners who need software advice. This includes reviewing your existing codebase, planning a new project architecture, or helping you evaluate technology choices.",
    examples: ["Technology stack selection", "Code reviews", "Project scoping and estimation", "Architecture planning sessions"],
    stack: ["Varies by project"],
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-2xl mb-16"
          >
            <span className="section-label">Services</span>
            <h1 className="text-display mb-4">What We Can Build For You</h1>
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
