"use client";

import { motion } from "framer-motion";
import { Bug, Search, Smartphone, Globe, ShieldCheck, FileCheck2, Zap, Settings, BookOpen, Layers, ArrowRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const methodologies = [
  { icon: Bug, title: "Manual Testing", desc: "Rigorous human-led testing to identify edge cases, UI/UX issues, and logic flaws that automated scripts might miss." },
  { icon: Search, title: "Exploratory Testing", desc: "Unscripted, creative testing approaches to uncover hidden bugs by interacting with the application in unexpected ways." },
  { icon: Globe, title: "Website Testing", desc: "Comprehensive testing of responsive web applications across varying resolutions, network speeds, and operating systems." },
  { icon: Smartphone, title: "Mobile App Testing", desc: "Native and cross-platform mobile testing (iOS/Android) focusing on gestures, battery usage, and offline states." },
  { icon: ShieldCheck, title: "Regression Testing", desc: "Ensuring new code changes, feature additions, or bug fixes don't break existing functionality." },
  { icon: FileCheck2, title: "User Acceptance (UAT)", desc: "Validating the end-to-end user flow to ensure the software solves the actual business problem intended." },
  { icon: BookOpen, title: "Bug Reporting", desc: "Clear, reproducible, and highly detailed bug reports with steps, environment details, logs, and visual evidence." },
  { icon: Layers, title: "Cross-Browser", desc: "Verifying consistent layout and functionality across Chrome, Firefox, Safari, and Edge." },
  { icon: Zap, title: "API Testing", desc: "Testing backend endpoints for correct data formatting, error handling, rate limiting, and security." },
  { icon: Settings, title: "SaaS Product Testing", desc: "Multi-tenant architecture testing, role-based access control (RBAC) validation, and subscription flow testing." }
];

export default function QATestingPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-36 pb-24 px-6 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-[#4f8ef7]/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#1f2433]/40 rounded-full blur-[150px] -z-10 pointer-events-none" />

        <div className="max-w-5xl mx-auto">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-3xl mb-20"
          >
            <span className="section-label mb-4">Dedicated QA Engineering</span>
            <h1 className="text-display mb-6">Quality Assurance & Software Testing</h1>
            <p className="text-subheading mb-8 text-[#8b92a9] leading-relaxed">
              We bring rigorous, systematic quality assurance to software projects. From comprehensive manual regression testing to detailed bug documentation, we ensure that applications are stable, functional, and ready for production before they reach users.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/contact" className="btn btn-primary text-xs py-2 px-5">
                Discuss Testing Needs <ArrowRight size={13} />
              </Link>
              <Link href="/portfolio" className="btn btn-ghost text-xs py-2 px-5">
                View Testing Portfolio
              </Link>
            </div>
          </motion.div>

          {/* Highlights */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="grid md:grid-cols-3 gap-6 mb-24"
          >
            <div className="card p-8 border-l-2 border-l-[#4f8ef7]">
              <h3 className="font-semibold text-[#e8eaf2] text-sm mb-2">Platforms Covered</h3>
              <p className="text-xs text-[#8b92a9] leading-relaxed">
                Responsive Web Apps, iOS/Android Mobile Applications, REST/GraphQL APIs, Admin Dashboards, and complex SaaS platforms.
              </p>
            </div>
            <div className="card p-8 border-l-2 border-l-[#4f8ef7]/60">
              <h3 className="font-semibold text-[#e8eaf2] text-sm mb-2">Testing Artifacts</h3>
              <p className="text-xs text-[#8b92a9] leading-relaxed">
                Comprehensive test cases, detailed reproducible bug reports, video evidence, and post-testing quality sign-off documents.
              </p>
            </div>
            <div className="card p-8 border-l-2 border-l-[#4f8ef7]/30">
              <h3 className="font-semibold text-[#e8eaf2] text-sm mb-2">Issue Tracking</h3>
              <p className="text-xs text-[#8b92a9] leading-relaxed">
                Experience integrating directly with engineering teams using Jira, Linear, GitHub Issues, Trello, and custom bug trackers.
              </p>
            </div>
          </motion.div>

          {/* Methodologies */}
          <div className="mb-12">
            <h2 className="text-heading mb-10 text-center">Testing Methodologies</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {methodologies.map((method, idx) => (
                <motion.div
                  key={method.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  className="card p-6 flex flex-col items-start hover:border-[#4f8ef7]/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#1f2433] border border-[#252d3d] flex items-center justify-center text-[#4f8ef7] mb-4">
                    <method.icon size={18} />
                  </div>
                  <h3 className="text-sm font-semibold text-[#e8eaf2] mb-2">{method.title}</h3>
                  <p className="text-xs text-[#8b92a9] leading-relaxed">{method.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-24 p-8 card bg-gradient-to-br from-[#121620] to-[#151922] border-[#252d3d] text-center"
          >
             <h3 className="text-lg font-semibold text-[#e8eaf2] mb-3">Looking for a QA Partner?</h3>
             <p className="text-xs text-[#8b92a9] max-w-xl mx-auto mb-6">
               Whether you need a full regression test cycle before a major release, or exploratory testing to discover edge cases in a new feature, we can help ensure your software meets the highest quality standards.
             </p>
             <Link href="/contact" className="btn btn-primary text-xs py-2 px-6">
               Get in Touch
             </Link>
          </motion.div>

        </div>
      </section>
      <Footer />
    </main>
  );
}
