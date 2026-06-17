"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Globe,
  Plug,
  Zap,
  Bot,
  MessageSquare,
  MapPin,
  Code2,
  ChevronRight,
  CreditCard,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchProjects, fetchConfig, Project, BusinessConfig, INITIAL_CONFIG } from "@/lib/db";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.09, ease: "easeOut" as const },
  }),
};

const services = [
  { icon: Globe, title: "Web Application Development", desc: "Responsive, full-stack web applications built for real-world use." },
  { icon: Plug, title: "API Development", desc: "Backend APIs and system integrations for your existing platforms." },
  { icon: Zap, title: "Software Automation", desc: "Automating repetitive workflows and business processes." },
  { icon: Bot, title: "AI Integrations", desc: "Connecting AI tools and services into your existing software." },
  { icon: MessageSquare, title: "Technical Consulting", desc: "Architecture reviews, project planning, and software guidance." },
];

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [config, setConfig] = useState<BusinessConfig>(INITIAL_CONFIG);

  useEffect(() => {
    fetchProjects().then(p => setProjects(p.slice(0, 3)));
    fetchConfig().then(setConfig);
  }, []);

  // Schema.org structured JSON-LD for local business validation
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": config.businessName,
    "image": `https://${config.businessName.toLowerCase()}.website/favicon.ico`,
    "description": `${config.businessName} is a software development and digital services studio operated by ${config.ownerName} and Eyob Mulugeta, registered in the UK with operational team in Ethiopia.`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Addis Ababa",
      "addressCountry": "ET"
    },
    "founder": {
      "@type": "Person",
      "name": config.ownerName
    },
    "knowsAbout": ["Web Development", "API Design", "Automation Systems", "PostgreSQL", "Django", "Next.js"]
  };

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      {/* ─── HERO ─────────────────────────────────────── */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            animate="show"
            className="max-w-2xl"
          >
            {/* Availability */}
            <motion.div
              custom={0}
              variants={fadeUp}
              className="flex items-center gap-2 mb-6"
            >
              <span className="badge badge-green">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]" />
                {config.businessName} is open for development contracts
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              custom={1}
              variants={fadeUp}
              className="text-display mb-5"
            >
              Custom Software Development &amp; Automation Solutions
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              custom={2}
              variants={fadeUp}
              className="text-subheading mb-8 max-w-xl"
            >
              We design and engineer web applications, API integrations,
              and process automation workflows for business operators.
            </motion.p>

            {/* CTAs */}
            <motion.div
              custom={3}
              variants={fadeUp}
              className="flex flex-wrap gap-3"
            >
              <Link href="/portfolio" className="btn btn-primary">
                View Portfolio
                <ArrowRight size={15} />
              </Link>
              <Link href="/contact" className="btn btn-ghost">
                Contact Us - Let&apos;s Build It For You
              </Link>
            </motion.div>

            {/* Location */}
            <motion.div
              custom={4}
              variants={fadeUp}
              className="flex items-center gap-1.5 mt-8 text-sm text-[#556080]"
            >
              <MapPin size={14} />
              {config.address} · Operating Office
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── INTRODUCTION ─────────────────────────────── */}
      <section className="py-16 px-6 border-t border-[#252d3d]">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-5 gap-10 items-start">
            <div className="md:col-span-3">
              <span className="section-label">Operations Summary</span>
              <h2 className="text-heading mb-4">
                Genuine Engineering Teams Delivering Quality Software
              </h2>
              <p className="mb-4 text-[#8b92a9]">
                {config.businessName} is a software development and digital services studio led by {config.ownerName} and Eyob Mulugeta. We build tailored software platforms, robust database configurations, and automation routines for international businesses.
              </p>
              <p className="text-[#8b92a9]">
                Our business is registered in the United Kingdom, and our core engineering team resides and operates from {config.address}.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 mt-6 text-sm text-[#4f8ef7] hover:text-[#6ba3f9] transition-colors font-medium"
              >
                Meet the team members <ChevronRight size={14} />
              </Link>
            </div>

            <div className="md:col-span-2 flex flex-col gap-3">
              {[
                { label: "Director / Owner", value: config.ownerName },
                { label: "Senior Developer", value: "Eyob Mulugeta" },
                { label: "Registration Country", value: "United Kingdom" },
                { label: "Operating Location", value: config.address },
                { label: "Core Industries", value: "Digital Services & Code" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex justify-between items-center py-3 border-b border-[#252d3d]"
                >
                  <span className="text-sm text-[#556080]">{item.label}</span>
                  <span className="text-sm text-[#c8cde0] font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SERVICES PREVIEW ─────────────────────────── */}
      <section className="py-20 px-6 border-t border-[#252d3d]">
        <div className="max-w-5xl mx-auto">
          <span className="section-label">Services</span>
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <h2 className="text-heading">Technical Capabilities</h2>
            <Link
              href="/services"
              className="text-sm text-[#4f8ef7] hover:text-[#6ba3f9] transition-colors font-medium flex items-center gap-1.5"
            >
              All services <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((svc) => (
              <div
                key={svc.title}
                className="card p-6 group"
              >
                <div className="w-9 h-9 rounded-lg bg-[#1f2433] border border-[#252d3d] flex items-center justify-center mb-4 group-hover:border-[#4f8ef7]/30 transition-colors">
                  <svc.icon size={17} className="text-[#8b92a9] group-hover:text-[#4f8ef7] transition-colors" />
                </div>
                <h3 className="text-sm font-semibold text-[#e8eaf2] mb-2">{svc.title}</h3>
                <p className="text-sm text-[#8b92a9] leading-relaxed">{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── RECENT WORK SECTION ──────────────────────── */}
      <section className="py-20 px-6 border-t border-[#252d3d]">
        <div className="max-w-5xl mx-auto">
          <span className="section-label">Recent Work</span>
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <h2 className="text-heading">Project Implementations</h2>
            <Link
              href="/portfolio"
              className="text-sm text-[#4f8ef7] hover:text-[#6ba3f9] transition-colors font-medium flex items-center gap-1.5"
            >
              All projects <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {projects.map((project) => (
              <div
                key={project.id}
                className="card p-7 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-semibold text-[#e8eaf2] text-sm">
                      <Link href={`/portfolio/${project.id}`} className="hover:text-[#4f8ef7] transition-colors">
                        {project.name}
                      </Link>
                    </h3>
                    <span className="badge badge-green shrink-0 text-[10px]">{project.status}</span>
                  </div>
                  <p className="text-xs text-[#8b92a9] leading-relaxed mb-4">{project.description}</p>
                </div>
                
                <div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.technologiesUsed.map((t) => (
                      <span key={t} className="skill-tag text-[9px]">{t}</span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-[#1a2030] flex justify-between items-center text-[10px]">
                    <span className="text-[#556080]">Click to view details</span>
                    <Link href={`/portfolio/${project.id}`} className="text-[#4f8ef7] hover:underline flex items-center gap-1">
                      Details <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PAYMENT TERMS SECTION ────────────────────── */}
      <section className="py-16 px-6 border-t border-[#252d3d]">
        <div className="max-w-5xl mx-auto">
          <div className="card p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#1f2433] border border-[#252d3d] flex items-center justify-center shrink-0">
                <CreditCard size={18} className="text-[#4f8ef7]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#e8eaf2] mb-1">Payment Options</h3>
                <p className="text-xs text-[#8b92a9] leading-relaxed max-w-xl">
                  International projects may be paid through Wise or PayPal depending on project requirements and client preference. {config.businessName} establishes standard Statements of Work (SOW) alongside invoice tracking for operational transparency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── DIRECT CTA ────────────────────────────────── */}
      <section className="py-20 px-6 border-t border-[#252d3d]">
        <div className="max-w-5xl mx-auto">
          <div className="card p-10 text-center">
            <Code2 size={28} className="text-[#4f8ef7] mx-auto mb-5" />
            <h2 className="text-heading mb-3">Project Inquiries</h2>
            <p className="text-[#8b92a9] max-w-md mx-auto mb-7 text-xs leading-relaxed">
              If your business requires a custom application dashboard, third-party API configurations, or automation routines, send us your technical parameters.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/contact" className="btn btn-primary">
                Contact Office
                <ArrowRight size={15} />
              </Link>
              <Link href="/business-info" className="btn btn-ghost">
                Business Information
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
