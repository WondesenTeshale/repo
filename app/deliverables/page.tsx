"use client";

import { motion } from "framer-motion";
import { Package, Code2, Globe, Zap, Database, GitBranch, Server, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const deliverables = [
  {
    icon: Globe,
    title: "Web Applications",
    description: "Fully functional, browser-based applications with frontend UI, backend logic, and database integration. Delivered as a working, deployed product.",
    includes: [
      "Frontend (React / Next.js / HTML)",
      "Backend API (Django / Node.js / FastAPI)",
      "Database schema and migrations",
      "User authentication system",
      "Admin or management dashboard",
      "Responsive design for mobile & desktop",
    ],
  },
  {
    icon: Server,
    title: "REST APIs",
    description: "Documented, tested backend APIs ready for integration with web apps, mobile apps, or third-party services.",
    includes: [
      "API endpoint documentation (Swagger / Postman collection)",
      "Authentication (JWT or API Key)",
      "Rate limiting and error handling",
      "Database integration",
      "Deployment on cloud server (DigitalOcean / Railway / AWS)",
    ],
  },
  {
    icon: Zap,
    title: "Automation Systems",
    description: "Scripts and pipelines that automate repeatable business tasks, reducing manual effort and improving operational accuracy.",
    includes: [
      "Scheduled job scripts (Cron / Celery)",
      "Data processing and transformation pipelines",
      "File generation (PDF reports, CSV exports)",
      "Email/notification automation",
      "Monitoring and logging",
    ],
  },
  {
    icon: Code2,
    title: "Source Code",
    description: "All source code is delivered in a version-controlled Git repository, with clear documentation and structure.",
    includes: [
      "Full repository access (GitHub / GitLab)",
      "Code documentation and inline comments",
      "Environment configuration files",
      "Dependency list (requirements.txt / package.json)",
      "README with setup instructions",
    ],
  },
  {
    icon: Database,
    title: "Database Design",
    description: "Relational database schemas designed for the specific data requirements of each project.",
    includes: [
      "Entity-relationship (ER) diagram",
      "SQL migration scripts",
      "Seed data for initial setup",
      "Indexing for query performance",
      "Backup and restore procedures",
    ],
  },
  {
    icon: Server,
    title: "Deployment Setup",
    description: "The delivered software is deployed to a live server or cloud environment and handed over with access credentials.",
    includes: [
      "Cloud server or platform deployment",
      "Domain configuration (if applicable)",
      "SSL / HTTPS certificate setup",
      "Environment variables configuration",
      "Basic monitoring setup",
    ],
  },
  {
    icon: FileText,
    title: "Project Documentation",
    description: "Written documentation to ensure the client can operate, maintain, and extend the delivered software.",
    includes: [
      "Technical specification document",
      "User guide / admin manual",
      "API reference documentation",
      "Deployment and maintenance guide",
      "Handover meeting or walkthrough call",
    ],
  },
  {
    icon: GitBranch,
    title: "Post-Delivery Support",
    description: "A defined period of bug-fix support after final delivery at no additional cost.",
    includes: [
      "14–30 days of post-delivery bug fixes",
      "Clarification and guidance on delivered features",
      "Minor adjustments within agreed scope",
    ],
  },
];

export default function DeliverablesPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-2xl mb-14"
          >
            <span className="section-label">Deliverables</span>
            <h1 className="text-display mb-5">What Clients Receive</h1>
            <p className="text-subheading">
              Every software project BetterDose completes results in tangible, working deliverables transferred to the client. This page outlines what is included in a standard software development engagement.
            </p>
          </motion.div>

          {/* Deliverables grid */}
          <div className="grid sm:grid-cols-2 gap-5">
            {deliverables.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.38, delay: i * 0.05 }}
                className="card p-7"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-[#1f2433] border border-[#252d3d] flex items-center justify-center shrink-0">
                    <item.icon size={17} className="text-[#4f8ef7]" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#e8eaf2]">{item.title}</h3>
                </div>

                <p className="text-xs text-[#8b92a9] leading-relaxed mb-4">{item.description}</p>

                <ul className="space-y-2">
                  {item.includes.map((line) => (
                    <li key={line} className="flex items-start gap-2 text-xs text-[#556080]">
                      <span className="w-1 h-1 rounded-full bg-[#4f8ef7] mt-1.5 shrink-0" />
                      {line}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Handover note */}
          <div className="card p-7 mt-10">
            <div className="flex items-center gap-3 mb-3">
              <Package size={16} className="text-[#4f8ef7]" />
              <h3 className="text-sm font-semibold text-[#e8eaf2]">Ownership Transfer</h3>
            </div>
            <p className="text-xs text-[#8b92a9] leading-relaxed">
              Upon final payment, full ownership of the delivered software, source code, and associated assets is transferred to the client. BetterDose retains no claim over client-commissioned work. Clients receive access to all repositories, deployment environments, and documentation at the point of handover.
            </p>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
