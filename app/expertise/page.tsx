"use client";

import { motion } from "framer-motion";
import { Terminal, Database, Cpu, Layers } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const skillCategories = [
  {
    icon: Terminal,
    title: "Programming Languages",
    summary: "Strong foundation in script-based and compiled languages for backend and frontend engineering.",
    skills: [
      { name: "Python", exp: "Used extensively for web development, script automation, scraping, and data processing." },
      { name: "JavaScript / TypeScript", exp: "Core languages for building modern responsive web interfaces and Node.js backend services." },
      { name: "Java", exp: "Academic foundation, useful for object-oriented design patterns and backend processing." },
      { name: "C", exp: "Understanding of memory management and system-level operations." },
    ],
  },
  {
    icon: Layers,
    title: "Frameworks & Library Ecosystems",
    summary: "Hands-on experience with production-grade application frameworks.",
    skills: [
      { name: "Django", exp: "Primary backend web framework. Familiar with ORM, authentication system, and admin panel configurations." },
      { name: "React / Next.js", exp: "Used for building highly responsive, component-driven client interfaces with App Router." },
      { name: "Express / Node.js", exp: "High-performance asynchronous REST backend services." },
      { name: "FastAPI", exp: "Designing lightweight APIs with automated interactive docs." },
    ],
  },
  {
    icon: Database,
    title: "Databases & Storage Systems",
    summary: "Designing database structures, relationships, and queries to ensure data integrity.",
    skills: [
      { name: "PostgreSQL", exp: "Relational database used for transactional application data, indexing, and complex queries." },
      { name: "MySQL", exp: "Standard relational database systems for content and business management dashboards." },
      { name: "MongoDB", exp: "Document-oriented NoSQL database used for hierarchical data structures." },
      { name: "SQLite", exp: "Lightweight local storage used for development, testing, and small tools." },
    ],
  },
  {
    icon: Cpu,
    title: "Development Tools & Workflow Automation",
    summary: "System tools and infrastructure used to build, test, and run code.",
    skills: [
      { name: "Git & GitHub", exp: "Version control system, branches, pull request workflows, and codebase collaboration." },
      { name: "Docker", exp: "Containerizing backend code to run reliably across environments." },
      { name: "Bash & Linux Shell", exp: "Operating systems, simple scripting, environment configuration, and cron tasks." },
      { name: "Selenium & Playwright", exp: "Web browser automation for regression testing and data scraping." },
    ],
  },
];

export default function ExpertisePage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-14"
          >
            <span className="section-label">Technical Competencies</span>
            <h1 className="text-display mb-4">Technology Expertise</h1>
            <p className="text-subheading">
              A detailed breakdown of my programming languages, database systems, backend frameworks, and engineering tools.
            </p>
          </motion.div>

          <div className="space-y-10">
            {skillCategories.map((category, idx) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="card p-7"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-[#1f2433] border border-[#252d3d] flex items-center justify-center">
                      <Icon size={16} className="text-[#4f8ef7]" />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-[#e8eaf2]">{category.title}</h2>
                      <p className="text-xs text-[#556080] mt-0.5">{category.summary}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    {category.skills.map((skill, sIdx) => (
                      <div key={sIdx} className="p-4 rounded-lg bg-[#0f1117] border border-[#1a2030] hover:border-[#252d3d] transition-colors">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-sm font-semibold text-[#e8eaf2]">{skill.name}</span>
                          <span className="text-[10px] text-[#556080] font-mono">Verified Stack</span>
                        </div>
                        <p className="text-xs text-[#8b92a9] leading-relaxed">{skill.exp}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-12 card p-6 text-center">
            <h3 className="text-sm font-semibold text-[#e8eaf2] mb-2">Code Quality &amp; Development Practices</h3>
            <p className="text-xs text-[#8b92a9] max-w-2xl mx-auto leading-relaxed">
              I emphasize writing readable code accompanied by documentation and test suites. I employ structured version control, clear pull request logs, and local containerization to ensure all technical deliveries are ready for production deploy.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
