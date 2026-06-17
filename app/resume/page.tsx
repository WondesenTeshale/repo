"use client";

import { motion } from "framer-motion";
import { Download, Mail, Phone, MapPin, Globe, FileText, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ResumePage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-24 px-6 print:pt-6 print:pb-6 print:px-0">
        <div className="max-w-4xl mx-auto">
          
          {/* Header block (Hidden in print if desired, but good for interactive web) */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10 print:hidden">
            <div>
              <span className="section-label">Professional Credentials</span>
              <h1 className="text-display mb-2">Resume / CV</h1>
              <p className="text-sm text-[#8b92a9]">
                View or download a printable PDF copy of my technical experience and credentials.
              </p>
            </div>
            
            <button
              onClick={handlePrint}
              className="btn btn-primary text-sm shrink-0"
              aria-label="Download or Print CV"
            >
              <Download size={14} />
              Print / Save as PDF
            </button>
          </div>

          {/* CV Sheet */}
          <div className="card p-8 sm:p-12 print:border-none print:bg-transparent print:p-0 bg-[#181c25] border border-[#252d3d] text-sm text-[#8b92a9] leading-relaxed space-y-8">
            
            {/* Header: Name & Contact */}
            <div className="border-b border-[#252d3d] pb-6 flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#e8eaf2] print:text-black">John</h2>
                <p className="text-base text-[#4f8ef7] font-medium mt-1">Software Engineer &amp; Developer</p>
              </div>

              <div className="space-y-1 text-xs text-[#8b92a9] print:text-black">
                <div className="flex items-center gap-2">
                  <Mail size={12} className="text-[#4f8ef7]" />
                  <span>contact@johnsoftware.dev</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={12} className="text-[#4f8ef7]" />
                  <span>Addis Ababa, Ethiopia</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={12} className="text-[#4f8ef7]" />
                  <span>www.johnsoftware.dev</span>
                </div>
              </div>
            </div>

            {/* Profile Summary */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#e8eaf2] print:text-black border-b border-[#252d3d] pb-2 mb-3">
                Professional Profile
              </h3>
              <p>
                Software engineering student and developer based in Ethiopia. Hands-on experience designing and deploying responsive web applications, relational databases, backend APIs, and task automation systems. Focus on writing clean, readable code with technical documentation. Committed to clear communication and realistic project estimations.
              </p>
            </div>

            {/* Technical Skills */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#e8eaf2] print:text-black border-b border-[#252d3d] pb-2 mb-3">
                Technical Skills
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <strong className="text-[#e8eaf2] print:text-black block mb-1">Languages</strong>
                  Python, JavaScript, TypeScript, Java, C, SQL, HTML/CSS
                </div>
                <div>
                  <strong className="text-[#e8eaf2] print:text-black block mb-1">Frameworks</strong>
                  Django, Next.js, React, Node.js, Express, FastAPI
                </div>
                <div>
                  <strong className="text-[#e8eaf2] print:text-black block mb-1">Databases &amp; Tools</strong>
                  PostgreSQL, MongoDB, MySQL, Docker, Git, Linux / Bash
                </div>
              </div>
            </div>

            {/* Academic Credentials */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#e8eaf2] print:text-black border-b border-[#252d3d] pb-2 mb-3">
                Education
              </h3>
              <div className="flex flex-col sm:flex-row justify-between gap-1 mb-2">
                <div>
                  <strong className="text-[#e8eaf2] print:text-black">Bachelor of Science in Software Engineering</strong>
                  <div className="text-xs">University Department of Software Engineering · Ethiopia</div>
                </div>
                <div className="text-xs font-semibold text-[#e8eaf2] print:text-black shrink-0 sm:text-right">
                  Currently Enrolled
                </div>
              </div>
              <p className="text-xs">
                Core coursework: Data Structures &amp; Algorithms, Object-Oriented Programming, Database Management Systems, Software Architecture &amp; Design, Software Engineering Principles.
              </p>
            </div>

            {/* Key Software Projects */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#e8eaf2] print:text-black border-b border-[#252d3d] pb-2 mb-3">
                Key Engineering Projects
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-start gap-3">
                    <strong className="text-[#e8eaf2] print:text-black text-sm">Inventory Management System</strong>
                    <span className="text-xs font-mono">Django, PostgreSQL</span>
                  </div>
                  <p className="text-xs mt-1">
                    Developed a robust multi-user web application to track warehouse stock, sales invoices, and vendor catalogs. Implemented secure role-based authentication and visual charts to monitor inventory trends.
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-start gap-3">
                    <strong className="text-[#e8eaf2] print:text-black text-sm">Student Record Platform</strong>
                    <span className="text-xs font-mono">React, Node.js, Express, MongoDB</span>
                  </div>
                  <p className="text-xs mt-1">
                    Created an administrative portal for course enrollment, grade logging, and student records retrieval. Optimized search queries to handle database indexing across records.
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-start gap-3">
                    <strong className="text-[#e8eaf2] print:text-black text-sm">Data Script &amp; Web Scraping Suite</strong>
                    <span className="text-xs font-mono">Python, Playwright, Pandas</span>
                  </div>
                  <p className="text-xs mt-1">
                    Programmed scheduled execution scripts that fetch, clean, and process external web data into exportable tables. Configured automated notification alerts for workflow failures.
                  </p>
                </div>
              </div>
            </div>

            {/* Professional Ethics */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#e8eaf2] print:text-black border-b border-[#252d3d] pb-2 mb-3">
                Professional &amp; Operational Code
              </h3>
              <ul className="list-disc pl-5 text-xs space-y-1.5">
                <li>I do not accept projects that exceed my technology stack or current expertise.</li>
                <li>All source code is committed to Git repository structures with written logs.</li>
                <li>I communicate clearly regarding project timelines, scope limits, and code structures.</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
