"use client";

import { motion } from "framer-motion";
import { Download, FileText, UserCheck, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const assets = [
  {
    icon: FileText,
    title: "Company Profile PDF",
    filename: "betterdose-company-profile.pdf",
    size: "1.2 MB",
    desc: "Comprehensive breakdown of BetterDose systems, registered corporate parameters, team roles, and commercial services offering details."
  },
  {
    icon: UserCheck,
    title: "Nebiyu Muluadam - Professional CV",
    filename: "nebiyu-muluadam-cv.pdf",
    size: "680 KB",
    desc: "Professional background, academic enrollment records at Addis Ababa University, and full-stack software development experience logs."
  },
  {
    icon: UserCheck,
    title: "Eyob Mulugeta - Technical CV",
    filename: "eyob-mulugeta-cv.pdf",
    size: "710 KB",
    desc: "Engineering resume detailing backend development, Redis/Docker integrations, database schemas, and process automation routines."
  },
  {
    icon: FileText,
    title: "Service Overview Document",
    filename: "betterdose-services-overview.pdf",
    size: "950 KB",
    desc: "Operational scope details, API gateway configurations architecture parameters, and milestone payment schedules."
  }
];

export default function DownloadsPage() {
  const handleSimulateDownload = (filename: string) => {
    // Generate a simple text document for document export
    const content = `BetterDose - Official Document Export: ${filename}\nGenerated timestamp: ${new Date().toISOString()}\nOperational Director: Nebiyu Muluadam\nAddis Ababa, Ethiopia.`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename.replace(".pdf", ".txt"); // Safe text format download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
            <span className="section-label">Documentation</span>
            <h1 className="text-display mb-4">Downloads &amp; CVs</h1>
            <p className="text-subheading">
              Official company profiles, technical resumes, and service overview specifications.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5">
            {assets.map((asset, idx) => {
              const Icon = asset.icon;
              return (
                <motion.div
                  key={asset.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  className="card p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-8 h-8 rounded-lg bg-[#1f2433] border border-[#252d3d] flex items-center justify-center">
                        <Icon size={14} className="text-[#4f8ef7]" />
                      </div>
                      <span className="text-[10px] text-[#556080] font-mono">{asset.size}</span>
                    </div>

                    <h2 className="text-sm font-semibold text-[#e8eaf2] mb-1.5">{asset.title}</h2>
                    <p className="text-xs text-[#8b92a9] leading-relaxed mb-4">{asset.desc}</p>
                  </div>

                  <button
                    onClick={() => handleSimulateDownload(asset.filename)}
                    className="btn btn-ghost text-xs py-1.5 px-3 w-full justify-center flex items-center gap-1.5 border border-[#252d3d] hover:border-[#4f8ef7]/30"
                  >
                    <Download size={12} />
                    Download Document
                  </button>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-12 p-5 rounded-lg border border-[#252d3d] bg-[#1f2433] flex items-start gap-3">
            <Shield size={16} className="text-[#4f8ef7] shrink-0 mt-0.5" />
            <p className="text-xs text-[#556080] leading-relaxed">
              Downloads triggered from this page contain official corporate signatures. Third parties requiring physical credentials or corporate tax registrations may submit direct queries via our official contact channels.
            </p>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
