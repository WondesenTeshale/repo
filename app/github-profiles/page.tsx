"use client";

import { motion } from "framer-motion";
import { GitBranch, FolderGit, FileCode, CheckCircle, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const contributors = [
  {
    name: "Nebiyu Muluadam",
    githubUrl: "https://github.com/nebiyu-m",
    repos: [
      { name: "inventory-management-system", desc: "Full-stack Django & PostgreSQL application for item catalogs and order records.", lang: "Python" },
      { name: "student-management-portal", desc: "React + Express portal with JWT auth cookies and MongoDB schemas.", lang: "TypeScript" },
      { name: "compiler-parser-lab", desc: "Academic Lex/Yacc parser generating AST structures for custom code expressions.", lang: "C" }
    ]
  },
  {
    name: "Eyob Mulugeta",
    githubUrl: "https://github.com/eyobcode",
    repos: [
      { name: "api-gateway-service", desc: "Proxy system featuring request caching, routing aggregates, and Redis store.", lang: "JavaScript" },
      { name: "data-scraping-suite", desc: "Python scheduling scripts fetching and normalizing bulk external logs.", lang: "Python" }
    ]
  },
  {
    name: "Abel Tadesse",
    githubUrl: "https://github.com/abel-tadesse",
    repos: [
      { name: "react-component-library", desc: "Reusable UI component library built with React, TypeScript, and Tailwind CSS.", lang: "TypeScript" },
      { name: "cross-platform-dashboard", desc: "Responsive admin dashboard template supporting desktop and mobile breakpoints.", lang: "TypeScript" },
      { name: "node-rest-boilerplate", desc: "Node.js REST API starter with JWT auth, route validation, and Postgres integration.", lang: "JavaScript" }
    ]
  }
];

export default function GitHubProfilesPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-12"
          >
            <span className="section-label">Code Integrity</span>
            <h1 className="text-display mb-4">GitHub Profiles</h1>
            <p className="text-subheading">
              Verifiable source repositories and contributions from the BetterDose development team.
            </p>
          </motion.div>

          <div className="space-y-10">
            {contributors.map((c, idx) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="card p-6"
              >
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#252d3d]">
                  <div>
                    <h2 className="text-base font-semibold text-[#e8eaf2]">{c.name}</h2>
                    <a
                      href={c.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#4f8ef7] hover:underline font-mono inline-flex items-center gap-1 mt-1"
                    >
                      {c.githubUrl.replace("https://", "")}
                      <ExternalLink size={10} />
                    </a>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-[#1f2433] border border-[#252d3d] flex items-center justify-center">
                    <GitBranch size={15} className="text-[#4f8ef7]" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#556080] mb-3">
                    Featured Repositories
                  </h3>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    {c.repos.map((repo) => (
                      <div key={repo.name} className="p-4 rounded-lg bg-[#0f1117] border border-[#252d3d] flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-semibold text-[#e8eaf2] flex items-center gap-1.5 mb-1">
                            <FolderGit size={12} className="text-[#556080]" />
                            {repo.name}
                          </h4>
                          <p className="text-[11px] text-[#8b92a9] leading-relaxed mb-3">
                            {repo.desc}
                          </p>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-[#161c27] text-[10px]">
                          <span className="flex items-center gap-1 text-[#8b92a9]">
                            <FileCode size={10} />
                            {repo.lang}
                          </span>
                          <span className="text-[#34d399] font-semibold flex items-center gap-0.5">
                            <CheckCircle size={9} /> Verifiable
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
