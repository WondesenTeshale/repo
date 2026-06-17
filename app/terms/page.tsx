"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-10"
          >
            <span className="section-label">Legal Document</span>
            <h1 className="text-display mb-4">Terms of Service</h1>
            <p className="text-subheading text-xs">
              Last updated: June 12, 2026. Governing Jurisdiction: Ethiopia.
            </p>
          </motion.div>

          <div className="card p-8 space-y-6 text-sm text-[#8b92a9] leading-relaxed">
            
            <div>
              <h2 className="text-[#e8eaf2] font-semibold text-base mb-2">1. Agreement to Terms</h2>
              <p>
                By accessing this website or engaging John Software Engineering Services (&quot;the Business&quot;) to perform custom software engineering, API designs, or automation development, you agree to comply with and be bound by these Terms of Service.
              </p>
            </div>

            <div>
              <h2 className="text-[#e8eaf2] font-semibold text-base mb-2">2. Scope of Services</h2>
              <p>
                We build customized software products according to specifications defined in a separate Statement of Work (SOW) or Project Agreement. We do not guarantee continuous operational support unless explicitly agreed in writing within a formal maintenance contract.
              </p>
            </div>

            <div>
              <h2 className="text-[#e8eaf2] font-semibold text-base mb-2">3. Payments &amp; Deliverables</h2>
              <p>
                Payment milestones, budgets, and delivery schedules are agreed upon prior to initiating development. Invoices are issued upon completing milestone requirements. Payment terms are strictly outlined in individual project contracts. Ownership of custom source code is transferred to the client upon full payment of the agreed project balance.
              </p>
            </div>

            <div>
              <h2 className="text-[#e8eaf2] font-semibold text-base mb-2">4. Intellectual Property</h2>
              <p>
                Any proprietary tools, baseline libraries, or pre-existing scripts owned by the Business before project commencement remain the sole property of the Business. The client is granted a non-exclusive, perpetual license to use such elements if they are embedded within the delivered custom software system.
              </p>
            </div>

            <div>
              <h2 className="text-[#e8eaf2] font-semibold text-base mb-2">5. Limitation of Liability</h2>
              <p>
                The Business is not liable for operational downtime, server failures, security breaches, database loss, or loss of profits resulting from deployment, configuration, or usage of the custom software code. The software is provided &quot;as is&quot; without warranties of any kind.
              </p>
            </div>

            <div>
              <h2 className="text-[#e8eaf2] font-semibold text-base mb-2">6. Governing Law</h2>
              <p>
                These terms, and any actions arising from technical engagements, are governed by the laws and commercial regulations of Ethiopia. Any disputes will be subject to the exclusive jurisdiction of the competent courts in Addis Ababa, Ethiopia.
              </p>
            </div>

            <div>
              <h2 className="text-[#e8eaf2] font-semibold text-base mb-2">7. Updates to Terms</h2>
              <p>
                We reserve the right to alter these terms as legal regulations and operational practices change. Clients with active projects will be notified in writing of any material revisions to payment or service definitions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
