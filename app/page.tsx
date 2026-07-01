"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
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
  CheckCircle2,
  GitBranch,
  Activity,
  CheckCircle,
  FileCode2,
  ShieldCheck,
  Blocks
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchProjects, fetchConfig, fetchTeamMembers, Project, BusinessConfig, TeamMember, INITIAL_CONFIG } from "@/lib/db";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.09, ease: "easeOut" as const },
  }),
};

function isVideo(url: string) {
  const ext = url.split('.').pop()?.split('?')[0]?.toLowerCase();
  return ext ? ["mp4", "webm", "ogg", "mov", "m4v"].includes(ext) : false;
}

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [config, setConfig] = useState<BusinessConfig>(INITIAL_CONFIG);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    fetchProjects().then(p => setProjects(p.slice(0, 6)));
    fetchConfig().then(setConfig);
    fetchTeamMembers().then(setTeamMembers);
  }, []);

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
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        {/* Abstract Hero Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f1117]/80 via-[#0f1117]/60 to-[#0f1117] z-10" />
          <Image src="/images/hero-bg.png" alt="Hero Background" fill className="object-cover opacity-50 mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} priority />
        </div>
        <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-[#4f8ef7]/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center md:text-left flex flex-col items-center md:items-start relative z-10">
          <motion.div initial="hidden" animate="show" className="max-w-3xl">
            <motion.div custom={0} variants={fadeUp} className="flex items-center gap-2 mb-6 justify-center md:justify-start">
              <span className="badge badge-green">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]" />
                {config.businessName} is open for development contracts
              </span>
            </motion.div>

            <motion.h1 custom={1} variants={fadeUp} className="text-display mb-6 leading-tight">
              Custom Software Development &amp; Automation Solutions
            </motion.h1>

            <motion.p custom={2} variants={fadeUp} className="text-subheading mb-10 max-w-2xl text-[#8b92a9] mx-auto md:mx-0">
              We design and engineer web applications, API integrations, and process automation workflows for business operators.
            </motion.p>

            <motion.div custom={3} variants={fadeUp} className="relative mt-8">
              <div className="flex flex-col items-center md:items-start gap-12 relative z-10">
                
                {/* Primary CTAs */}
                <div className="flex flex-wrap gap-4 justify-center md:justify-start relative">
                  <Link href="/contact" className="btn btn-primary px-6 py-2.5 relative">
                    Contact Us - Let&apos;s Build It For You
                    
                    {/* Connecting SVG Path (Desktop) */}
                    <svg className="hidden md:block absolute top-[100%] left-[50%] w-8 h-12 pointer-events-none -translate-x-1/2 overflow-visible" fill="none" viewBox="0 0 2 48">
                      <path d="M 1 0 L 1 48" stroke="#4f8ef7" strokeWidth="4" strokeDasharray="6 6" opacity="1" />
                      <circle cx="1" cy="48" r="5" fill="#4f8ef7" opacity="1" />
                    </svg>
                  </Link>
                  <Link href="/portfolio" className="btn btn-ghost px-6 py-2.5">
                    View Portfolio
                  </Link>
                </div>

                {/* Secondary QA CTA */}
                <div className="flex flex-col items-center md:items-start relative md:pl-[42px]">
                  <p className="text-xs text-[#8b92a9] mb-3 uppercase tracking-wider font-semibold flex items-center gap-2">
                    <ArrowRight size={20} className="hidden md:block text-[#4f8ef7]" strokeWidth={3} />
                    Already Built? Then Let&apos;s Test It
                  </p>
                  <Link href="/qa-testing" className="btn btn-ghost px-6 py-2.5 border border-[#4f8ef7]/20 hover:border-[#4f8ef7]/50 flex items-center gap-2 bg-[#121620]/50">
                    <ShieldCheck size={16} className="text-[#4f8ef7]" />
                    Explore QA & Testing Services
                  </Link>
                </div>

              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* ─── TRUST BAR ────────────────────────────────── */}
      <section className="py-6 px-6 border-y border-[#252d3d] bg-[#0f1117]/40">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center md:justify-between gap-x-8 gap-y-4 text-[11px] uppercase tracking-wider text-[#8b92a9] font-semibold">
          <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#34d399]"/> Full Stack Development</span>
          <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#34d399]"/> QA & Software Testing</span>
          <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#34d399]"/> Automation Solutions</span>
          <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#34d399]"/> WordPress Development</span>
          <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#34d399]"/> API Integrations</span>
          <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#34d399]"/> Ongoing Projects</span>
        </div>
      </section>

      {/* ─── WHAT WE DO ───────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <span className="section-label mb-4">What We Do</span>
          <h2 className="text-heading mb-10">Our Core Capabilities</h2>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="card border-t-2 border-t-[#4f8ef7] overflow-hidden flex flex-col">
              <div className="h-32 relative w-full border-b border-[#252d3d]">
                <div className="absolute inset-0 bg-gradient-to-t from-[#121620] to-transparent z-10" />
                <Image src="/images/software-dev.png" alt="Software Development" fill className="object-cover" />
              </div>
              <div className="p-8 flex-1">
                <div className="w-10 h-10 rounded-lg bg-[#1f2433] border border-[#252d3d] flex items-center justify-center mb-5 text-[#4f8ef7] relative z-20 -mt-12 shadow-lg">
                  <FileCode2 size={18} />
                </div>
                <h3 className="text-sm font-semibold text-[#e8eaf2] mb-3">Software Development</h3>
                <p className="text-xs text-[#8b92a9] leading-relaxed">Custom web applications, SaaS products, APIs, and business systems.</p>
              </div>
            </div>

            <div className="card border-t-2 border-t-[#34d399] overflow-hidden flex flex-col">
              <div className="h-32 relative w-full border-b border-[#252d3d]">
                <div className="absolute inset-0 bg-gradient-to-t from-[#121620] to-transparent z-10" />
                <Image src="/images/qa-testing.png" alt="QA Testing" fill className="object-cover" />
              </div>
              <div className="p-8 flex-1">
                <div className="w-10 h-10 rounded-lg bg-[#1f2433] border border-[#252d3d] flex items-center justify-center mb-5 text-[#34d399] relative z-20 -mt-12 shadow-lg">
                  <ShieldCheck size={18} />
                </div>
                <h3 className="text-sm font-semibold text-[#e8eaf2] mb-3">Quality Assurance & Testing</h3>
                <p className="text-xs text-[#8b92a9] leading-relaxed">Manual testing, bug reporting, regression testing, and user acceptance testing.</p>
              </div>
            </div>

            <div className="card border-t-2 border-t-[#fbbf24] overflow-hidden flex flex-col">
              <div className="h-32 relative w-full border-b border-[#252d3d]">
                <div className="absolute inset-0 bg-gradient-to-t from-[#121620] to-transparent z-10" />
                <Image src="/images/automation.png" alt="Automation" fill className="object-cover" />
              </div>
              <div className="p-8 flex-1">
                <div className="w-10 h-10 rounded-lg bg-[#1f2433] border border-[#252d3d] flex items-center justify-center mb-5 text-[#fbbf24] relative z-20 -mt-12 shadow-lg">
                  <Zap size={18} />
                </div>
                <h3 className="text-sm font-semibold text-[#e8eaf2] mb-3">Automation</h3>
                <p className="text-xs text-[#8b92a9] leading-relaxed">Workflow automation, browser automation, and business process optimization.</p>
              </div>
            </div>

            <div className="card border-t-2 border-t-[#818cf8] overflow-hidden flex flex-col">
              <div className="h-32 relative w-full border-b border-[#252d3d]">
                <div className="absolute inset-0 bg-gradient-to-t from-[#121620] to-transparent z-10" />
                <Image src="/images/wordpress.png" alt="WordPress Solutions" fill className="object-cover" />
              </div>
              <div className="p-8 flex-1">
                <div className="w-10 h-10 rounded-lg bg-[#1f2433] border border-[#252d3d] flex items-center justify-center mb-5 text-[#818cf8] relative z-20 -mt-12 shadow-lg">
                  <Globe size={18} />
                </div>
                <h3 className="text-sm font-semibold text-[#e8eaf2] mb-3">WordPress Solutions</h3>
                <p className="text-xs text-[#8b92a9] leading-relaxed">Website development, maintenance, optimization, and support.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURED WORK ────────────────────────────── */}
      <section className="py-24 px-6 bg-[#0a0c10] border-t border-[#252d3d]">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <span className="section-label mb-4">Portfolio</span>
              <h2 className="text-heading">Featured Work</h2>
            </div>
            <Link href="/portfolio" className="text-xs text-[#4f8ef7] hover:underline font-medium flex items-center gap-1.5">
              View all projects <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => (
              <div key={project.id} className="card flex flex-col justify-between overflow-hidden group">
                {project.screenshots && project.screenshots[0] ? (
                  isVideo(project.screenshots[0]) ? (
                    <video src={project.screenshots[0]} className="w-full h-40 object-cover border-b border-[#252d3d] group-hover:scale-105 transition-transform duration-500" muted playsInline autoPlay loop />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={project.screenshots[0]} alt={project.name} className="w-full h-40 object-cover border-b border-[#252d3d] group-hover:scale-105 transition-transform duration-500" />
                  )
                ) : (
                  <div className="w-full h-40 bg-[#121620] border-b border-[#252d3d] flex items-center justify-center text-[#252d3d]">
                    <Globe size={32} />
                  </div>
                )}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="font-semibold text-[#e8eaf2] text-sm leading-snug">{project.name}</h3>
                    <span className="badge badge-green shrink-0 text-[9px] px-1.5 py-0.5">{project.status}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-5 flex-1">
                    {project.technologiesUsed.slice(0, 4).map((t) => (
                      <span key={t} className="skill-tag text-[9px]">{t}</span>
                    ))}
                    {project.technologiesUsed.length > 4 && <span className="skill-tag text-[9px]">+{project.technologiesUsed.length - 4}</span>}
                  </div>
                  <Link href={`/portfolio/${project.id}`} className="text-xs text-[#4f8ef7] hover:underline flex items-center gap-1.5 pt-4 border-t border-[#1a2030] w-full">
                    View Details <ArrowRight size={11} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MEET THE TEAM ────────────────────────────── */}
      <section className="py-24 px-6 border-t border-[#252d3d]">
        <div className="max-w-5xl mx-auto">
          <span className="section-label mb-4">Our People</span>
          <h2 className="text-heading mb-10">Meet The Team</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {teamMembers.map(member => (
              <div key={member.id} className="card p-6 flex flex-col items-center text-center">
                {member.profilePhotoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={member.profilePhotoUrl} alt={member.name} className="w-16 h-16 rounded-full object-cover border-2 border-[#252d3d] mb-4" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[#1f2433] border-2 border-[#252d3d] flex items-center justify-center text-[#4f8ef7] font-bold text-xl mb-4">
                    {member.name[0]}
                  </div>
                )}
                <h3 className="text-sm font-semibold text-[#e8eaf2]">{member.name}</h3>
                <p className="text-[11px] text-[#4f8ef7] mb-4">{member.role}</p>
                <div className="flex flex-wrap justify-center gap-1 mb-5">
                  {member.skills.slice(0, 4).map(s => <span key={s} className="skill-tag text-[9px]">{s}</span>)}
                </div>
                {member.github && (
                  <a href={member.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[11px] text-[#8b92a9] hover:text-[#e8eaf2] transition-colors mt-auto pt-4 border-t border-[#1a2030] w-full justify-center">
                    <GitBranch size={12} /> {member.github.replace("https://github.com/", "@")}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BEHIND THE CODE & ACTIVITY ─────────────────────── */}
      <section className="py-24 px-6 bg-[#0a0c10] border-t border-[#252d3d] relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="section-label mb-4">Active Operations</span>
              <h2 className="text-heading mb-6">Behind The Code</h2>
              <p className="text-xs text-[#8b92a9] leading-relaxed mb-8 max-w-sm">
                Our studio operates on a continuous integration model, driven by team collaboration. We believe great software comes from diverse teams working closely together.
              </p>
              <div className="relative rounded-2xl overflow-hidden border border-[#252d3d] shadow-2xl">
                <Image src="/images/betterdose.jpeg" alt="Team Collaboration" width={800} height={450} className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-4 left-4 right-4 bg-[#0f1117]/80 backdrop-blur-md border border-[#252d3d] rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-[#e8eaf2]">Studio Sessions</p>
                    <p className="text-[10px] text-[#8b92a9]">{config.address}</p>
                  </div>
                  <div className="flex -space-x-2">
                    {teamMembers.slice(0,3).map(m => (
                      <div key={m.id} className="w-6 h-6 rounded-full bg-[#1f2433] border border-[#252d3d] flex items-center justify-center text-[8px] font-bold text-[#e8eaf2]">
                        {m.name[0]}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="card p-8 space-y-4 bg-[#121620]">
              <h3 className="text-sm font-semibold text-[#e8eaf2] mb-4">Recent Milestones</h3>
              {[
                "New QA testing project added",
                "React dashboard deployment",
                "API integration completed",
                "University research project updated",
                "Automation workflow released"
              ].map((activity, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle size={14} className="text-[#4f8ef7] shrink-0" />
                  <span className="text-xs text-[#e8eaf2] font-medium">{activity}</span>
                </div>
              ))}
              <div className="pt-4 mt-2 border-t border-[#1a2030]">
                <Link href="/activity" className="text-xs text-[#556080] hover:text-[#e8eaf2] flex items-center gap-1.5 transition-colors">
                  <Activity size={12} /> View complete activity log
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TECHNOLOGIES ─────────────────────────────── */}
      <section className="py-24 px-6 border-t border-[#252d3d]">
        <div className="max-w-5xl mx-auto text-center">
          <span className="section-label mb-4 mx-auto">Tech Stack</span>
          <h2 className="text-heading mb-10">Technologies</h2>
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {[
              "Next.js", "React", "TypeScript", "Python", "FastAPI", 
              "Node.js", "PostgreSQL", "Supabase", "Docker", "WordPress",
              "PHP", "Laravel"
            ].map((tech) => (
              <span key={tech} className="px-4 py-2 rounded-full border border-[#252d3d] bg-[#121620] text-xs font-semibold text-[#e8eaf2] hover:border-[#4f8ef7] hover:text-[#4f8ef7] transition-all cursor-default">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY WORK WITH BETTERDOSE ─────────────────── */}
      <section className="py-24 px-6 bg-[#0a0c10] border-t border-[#252d3d]">
        <div className="max-w-5xl mx-auto">
          <span className="section-label mb-4 text-center mx-auto block">Advantages</span>
          <h2 className="text-heading mb-12 text-center">Why Work With BetterDose</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card p-8">
              <h3 className="text-sm font-semibold text-[#e8eaf2] mb-3">Transparent Development</h3>
              <p className="text-xs text-[#8b92a9] leading-relaxed">Regular communication and project updates.</p>
            </div>
            <div className="card p-8">
              <h3 className="text-sm font-semibold text-[#e8eaf2] mb-3">Technical Expertise</h3>
              <p className="text-xs text-[#8b92a9] leading-relaxed">Full-stack development, testing, and automation experience.</p>
            </div>
            <div className="card p-8">
              <h3 className="text-sm font-semibold text-[#e8eaf2] mb-3">Flexible Engagement</h3>
              <p className="text-xs text-[#8b92a9] leading-relaxed">Project-based, ongoing support, and consulting arrangements.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CALL TO ACTION ───────────────────────────── */}
      <section className="py-32 px-6 border-t border-[#252d3d] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#4f8ef7]/5 pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#e8eaf2] mb-6 tracking-tight">Ready to Discuss Your Project?</h2>
          <p className="text-sm text-[#8b92a9] leading-relaxed mb-10 max-w-xl mx-auto">
            Whether you need a web application, QA testing, automation, or technical consulting, our team is ready to help.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact" className="btn btn-primary px-8 py-3 text-sm">
              Contact Us
            </Link>
            <Link href="/portfolio" className="btn btn-ghost px-8 py-3 text-sm">
              View Portfolio
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

