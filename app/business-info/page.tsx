"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Building2, Briefcase, FileText, CreditCard } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchConfig, BusinessConfig, INITIAL_CONFIG } from "@/lib/db";

export default function BusinessInfoPage() {
  const [config, setConfig] = useState<BusinessConfig>(INITIAL_CONFIG);

  useEffect(() => {
    fetchConfig().then(setConfig);
  }, []);

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
            <span className="section-label">Corporate Registry</span>
            <h1 className="text-display mb-4">Business Information</h1>
            <p className="text-subheading">
              Official registration, ownership, and operational details for {config.businessName}.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 items-start">
            
            {/* Core Details Table */}
            <div className="md:col-span-2 space-y-6">
              <div className="card p-6">
                <h2 className="text-base font-semibold text-[#e8eaf2] mb-4 flex items-center gap-2">
                  <Building2 size={16} className="text-[#4f8ef7]" />
                  Operational Details
                </h2>
                
                <div className="divide-y divide-[#252d3d] text-sm">
                  {[
                    { label: "Business Name", value: config.businessName },
                    { label: "Operating Name", value: config.businessName },
                    { label: "Owner / Director", value: config.ownerName },
                    { label: "Industry", value: "Software Development & Digital Services" },
                    { label: "Country of Registration", value: "United Kingdom" },
                    { label: "Operating Team Location", value: config.address },
                    { label: "Contact Email", value: config.email },
                    { label: "Contact Phone", value: config.phone },
                  ].map((row, idx) => (
                    <div key={idx} className="py-3.5 flex flex-col sm:flex-row justify-between gap-1">
                      <span className="text-[#8b92a9] font-medium">{row.label}</span>
                      <span className="text-[#e8eaf2] font-semibold text-right sm:max-w-xs">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment details section */}
              <div className="card p-6">
                <h3 className="text-base font-semibold text-[#e8eaf2] mb-4 flex items-center gap-2">
                  <CreditCard size={16} className="text-[#4f8ef7]" />
                  Payment Methods
                </h3>
                <p className="text-sm text-[#8b92a9] leading-relaxed">
                  International projects may be paid through Wise or PayPal depending on project requirements and client preference.
                </p>
              </div>

              {/* Service Offering Validation */}
              <div className="card p-6">
                <h3 className="text-base font-semibold text-[#e8eaf2] mb-4 flex items-center gap-2">
                  <Briefcase size={16} className="text-[#4f8ef7]" />
                  Services Offered
                </h3>
                <p className="text-xs text-[#8b92a9] mb-4">
                  {config.businessName} provides the following technical capabilities under direct service contracts and statement of work agreements:
                </p>
                <ul className="space-y-3.5 text-sm text-[#8b92a9]">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4f8ef7] mt-2 shrink-0" />
                    <div>
                      <strong className="text-[#e8eaf2] block">Custom Web Application Development</strong>
                      End-to-end design, database schemas, API connections, and responsive user interfaces.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4f8ef7] mt-2 shrink-0" />
                    <div>
                      <strong className="text-[#e8eaf2] block">API Design &amp; Integration</strong>
                      Building robust rest/graphql backends and connecting third-party platforms.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4f8ef7] mt-2 shrink-0" />
                    <div>
                      <strong className="text-[#e8eaf2] block">Workflow &amp; System Automation</strong>
                      Automated tasks, scheduled script processing, web scraping, and data synchronization.
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className="card p-6 bg-[#181c25]/50 border-[#252d3d]">
                <h3 className="text-sm font-semibold text-[#e8eaf2] mb-3 flex items-center gap-2">
                  <FileText size={14} className="text-[#4f8ef7]" />
                  Business Operations
                </h3>
                <p className="text-xs text-[#8b92a9] leading-relaxed mb-3">
                  We handle software contracts and client support globally, ensuring professional service delivery for all projects.
                </p>
                <p className="text-xs text-[#8b92a9] leading-relaxed">
                  For official inquiries, project proposals, or documentation requests, please reach out to our primary business email directly.
                </p>
              </div>

              <div className="card p-6">
                <h3 className="text-sm font-semibold text-[#e8eaf2] mb-3">Company Overview</h3>
                <p className="text-xs text-[#8b92a9] leading-relaxed">
                  {config.businessName} is registered as a business entity in the United Kingdom and conducts its software engineering operations out of Ethiopia.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
