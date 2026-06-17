"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const steps = [
  {
    number: "01",
    title: "Initial Discussion",
    desc: "You describe what you're trying to build. I ask questions to understand the scope, goals, and any constraints. This is usually a short message exchange or a call.",
    note: "Free — no obligation",
  },
  {
    number: "02",
    title: "Requirements Gathering",
    desc: "We define the specific requirements clearly: what features are needed, what they should do, and what success looks like. This becomes the reference point for the whole project.",
    note: "Written document agreed by both sides",
  },
  {
    number: "03",
    title: "Development",
    desc: "I build the software according to the agreed requirements. I provide progress updates at regular intervals so you know where things stand.",
    note: "Regular check-ins throughout",
  },
  {
    number: "04",
    title: "Testing",
    desc: "I test the software against the agreed requirements. You also test it and raise anything that doesn't work as expected or needs adjustment.",
    note: "Client review included",
  },
  {
    number: "05",
    title: "Delivery",
    desc: "The final deliverable is handed over — whether that's source code, a deployed application, or both. I provide documentation for anything that needs it.",
    note: "Full handover + documentation",
  },
  {
    number: "06",
    title: "Ongoing Support",
    desc: "After delivery, I'm available for follow-up questions, bug fixes, or additional work. This is discussed and agreed based on the project.",
    note: "Terms agreed per project",
  },
];

const projectTypes = [
  "Web Applications",
  "Internal Business Tools",
  "Automation Systems",
  "API Development & Integration",
  "Software Consulting & Architecture",
];

export default function WorkWithMePage() {
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
            <span className="section-label">Work With Me</span>
            <h1 className="text-display mb-4">How Projects Work</h1>
            <p className="text-subheading">
              A straightforward process from initial discussion to delivered software.
              No jargon, no unnecessary complexity.
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="mb-20">
            <div className="flex flex-col gap-8">
              {steps.map((step, i) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="timeline-item"
                >
                  <div className="timeline-dot" />
                  <div className="card p-6">
                    <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-[#4f8ef7]">{step.number}</span>
                        <h3 className="font-semibold text-[#e8eaf2]">{step.title}</h3>
                      </div>
                      <span className="badge badge-gray">{step.note}</span>
                    </div>
                    <p className="text-sm text-[#8b92a9] leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Project types */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="divider mb-10" />
            <div className="grid md:grid-cols-2 gap-10 items-start">
              <div>
                <h2 className="text-heading mb-5">Project Types I Accept</h2>
                <ul className="flex flex-col gap-3">
                  {projectTypes.map((type) => (
                    <li key={type} className="flex items-center gap-3 text-[#8b92a9]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4f8ef7] shrink-0" />
                      <span className="text-sm">{type}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-4">
                <div className="card p-6">
                  <h3 className="font-semibold text-[#e8eaf2] mb-2">Engagement Types</h3>
                  <div className="flex flex-col gap-2.5">
                    {["Freelance Projects", "Consulting (hourly)", "Long-Term Contracts"].map((t) => (
                      <div key={t} className="flex items-center gap-2 text-sm text-[#8b92a9]">
                        <span className="w-1 h-1 rounded-full bg-[#4f8ef7]" />
                        {t}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card p-6">
                  <h3 className="font-semibold text-[#e8eaf2] mb-2">What I Need From You</h3>
                  <div className="flex flex-col gap-2.5">
                    {[
                      "A clear description of the problem you're solving",
                      "Your timeline and budget expectations",
                      "Availability for questions during development",
                      "Timely feedback on deliverables",
                    ].map((t) => (
                      <div key={t} className="flex items-start gap-2 text-sm text-[#8b92a9]">
                        <span className="w-1 h-1 rounded-full bg-[#4f8ef7] mt-2 shrink-0" />
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Honest note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mt-14 card p-8 border-l-2 border-[#4f8ef7]"
          >
            <h3 className="font-semibold text-[#e8eaf2] mb-3">A note on honesty</h3>
            <p className="text-sm text-[#8b92a9] leading-relaxed">
              I will only take on work that I believe I can complete successfully. If your project
              requires skills or tools outside my current experience, I&apos;ll tell you directly rather
              than taking on something I can&apos;t deliver. Good outcomes depend on honest conversations from the start.
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mt-10 text-center"
          >
            <Link href="/contact" className="btn btn-primary">
              Start the Conversation
              <ArrowRight size={15} />
            </Link>
          </motion.div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
