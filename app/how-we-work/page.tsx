"use client";

import { motion } from "framer-motion";
import { MessageSquare, FileText, CheckSquare, Layers, ShieldCheck, Truck, CreditCard } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const steps = [
  {
    icon: MessageSquare,
    title: "1. Client Inquiry",
    desc: "Clients contact us via our secure contact portal or email detailing the scope of their requirements. We respond with initial validation within 24 to 48 business hours."
  },
  {
    icon: FileText,
    title: "2. Requirements Gathering",
    desc: "We conduct detailed reviews to identify target features, system inputs/outputs, database entities, and integrations. This ensures both parties understand the technical boundary limits."
  },
  {
    icon: CheckSquare,
    title: "3. Proposal & Spec Sheet",
    desc: "We submit a comprehensive technical proposal including data schemas, system components, milestones, and budget estimates. Work starts only after signing standard contract specifications."
  },
  {
    icon: Layers,
    title: "4. Development Phase",
    desc: "All source code is committed to Git repository structures with clear log records. We provide regular milestone updates and build testable prototypes for client preview."
  },
  {
    icon: ShieldCheck,
    title: "5. Rigorous Testing",
    desc: "We write unit tests, verify rate-limiting rules, perform security integration tests, and check API payload outputs to ensure durability and prevent runtime errors."
  },
  {
    icon: Truck,
    title: "6. Production Delivery",
    desc: "We deploy the application to hosting environments (e.g. Vercel, AWS, or local physical servers) and deliver compiled builds, database structures, and developer documentation."
  },
  {
    icon: CreditCard,
    title: "7. Secure Payment",
    desc: "Invoice tracking aligns strictly with agreed milestones. We support international wire transfers, Wise, or PayPal. No payments are requested outside of formal invoices."
  }
];

export default function HowWeWorkPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-12 text-center"
          >
            <span className="section-label">Our Process</span>
            <h1 className="text-display mt-2 mb-4">How We Work</h1>
            <p className="text-subheading max-w-xl mx-auto">
              Our structured software development process ensures operational transparency, clear deliverables, and robust system quality.
            </p>
          </motion.div>

          <div className="space-y-6 max-w-3xl mx-auto">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  className="card p-6 flex flex-col sm:flex-row gap-5 items-start"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#1f2433] border border-[#252d3d] flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-[#4f8ef7]" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-[#e8eaf2] mb-1.5">{step.title}</h2>
                    <p className="text-xs text-[#8b92a9] leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
