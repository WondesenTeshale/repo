"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicyPage() {
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
            <h1 className="text-display mb-4">Privacy Policy</h1>
            <p className="text-subheading text-xs">
              Last updated: June 12, 2026. Governing Jurisdiction: Ethiopia.
            </p>
          </motion.div>

          <div className="card p-8 space-y-6 text-sm text-[#8b92a9] leading-relaxed">
            
            <div>
              <h2 className="text-[#e8eaf2] font-semibold text-base mb-2">1. Overview</h2>
              <p>
                This Privacy Policy describes how John Software Engineering Services (&quot;the Business&quot;) collects, uses, and protects client and visitor information when you visit our website or engage us for software development services.
              </p>
            </div>

            <div>
              <h2 className="text-[#e8eaf2] font-semibold text-base mb-2">2. Information Collection</h2>
              <p className="mb-2">
                We only collect information directly provided by you. This includes:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Name, email address, and message details provided through our professional contact form.</li>
                <li>Communication history, specification sheets, and project agreements.</li>
                <li>System environment information voluntarily provided during service configuration.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-[#e8eaf2] font-semibold text-base mb-2">3. Use of Information</h2>
              <p className="mb-2">
                All collected information is used strictly to:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Respond to inquiries, provide quotes, and establish project agreements.</li>
                <li>Conduct code debugging, database deployments, and program configurations.</li>
                <li>Verify client identity to process professional service payments securely.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-[#e8eaf2] font-semibold text-base mb-2">4. Data Security &amp; Retention</h2>
              <p>
                We execute standard technical and operational measures to guard against unauthorized access, alterations, or destruction of stored data. Personal data is retained only for the duration required to complete project specifications, satisfy financial record keeping, or as demanded by commercial laws in Ethiopia.
              </p>
            </div>

            <div>
              <h2 className="text-[#e8eaf2] font-semibold text-base mb-2">5. Third-Party Disclosures</h2>
              <p>
                We do not sell, rent, or lease personal identifiers to marketing firms. We do not distribute database files, source code, or email logs unless explicitly authorized in writing by the contracting client, or where required to comply with court subpoenas and law enforcement directives.
              </p>
            </div>

            <div>
              <h2 className="text-[#e8eaf2] font-semibold text-base mb-2">6. Contact &amp; Inquiries</h2>
              <p>
                For questions regarding data practices, file access requests, or deletion queries, please contact John at:{" "}
                <strong className="text-[#e8eaf2]">contact@johnsoftware.dev</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
