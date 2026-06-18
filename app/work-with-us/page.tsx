"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Code2, 
  GraduationCap, 
  Users, 
  Handshake,
  CheckCircle2, 
  Send, 
  Sparkles, 
  Briefcase, 
  Cpu, 
  BookOpen, 
  FolderIcon,
  ArrowRight
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { apiSubmitContactMessage } from "@/lib/db";

export default function WorkWithUsPage() {
  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    githubProfile: "",
    portfolioWebsite: "",
    skills: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = "Full Name is required";
    if (!formData.email.trim()) {
      errs.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = "Please enter a valid email address";
    }
    if (!formData.skills.trim()) errs.skills = "Please list a few key skills";
    if (!formData.message.trim()) errs.message = "Please enter a short message about yourself";
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (key: string, val: string) => {
    setFormData(prev => ({ ...prev, [key]: val }));
    if (errors[key]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    
    // Combine fields into the standard contact message format
    const fullMessage = `GitHub: ${formData.githubProfile || "N/A"}\nPortfolio: ${formData.portfolioWebsite || "N/A"}\nSkills: ${formData.skills}\n\nMessage:\n${formData.message}`;
    
    const result = await apiSubmitContactMessage({
      name: formData.fullName,
      email: formData.email,
      subject: "Work With Us Application",
      message: fullMessage
    });
    
    setLoading(false);

    if (result) {
      setSubmitted(true);
      setFormData({
        fullName: "",
        email: "",
        githubProfile: "",
        portfolioWebsite: "",
        skills: "",
        message: ""
      });
    } else {
      setErrors({ submit: "Failed to submit application. Please try again later." });
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-36 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <span className="section-label mx-auto mb-4">Join Our Journey</span>
            <h1 className="text-display mb-6">Work With BetterDose</h1>
            <p className="text-subheading max-w-2xl mx-auto mb-10">
              We&apos;re always interested in connecting with developers, designers, students, and project collaborators who are passionate about building software.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button 
                onClick={() => scrollToSection("application-form")}
                className="btn btn-primary text-xs py-2 px-5 cursor-pointer"
              >
                Submit Interest <ArrowRight size={13} />
              </button>
              <button 
                onClick={() => scrollToSection("opportunities")}
                className="btn btn-ghost text-xs py-2 px-5 cursor-pointer"
              >
                Opportunities
              </button>
              <a 
                href="/contact"
                className="btn btn-ghost text-xs py-2 px-5 border border-[#252d3d]"
              >
                Contact Team
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Opportunities Section */}
      <section id="opportunities" className="py-16 px-6 scroll-mt-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="section-label mx-auto">Collaborations</span>
            <h2 className="text-heading mt-2">Open Pathways</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Software Developers */}
            <motion.div 
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.38 }}
              className="card p-7 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-[#4f8ef7]/10 border border-[#4f8ef7]/20 flex items-center justify-center text-[#4f8ef7]">
                    <Code2 size={16} />
                  </div>
                  <h3 className="font-semibold text-[#e8eaf2] text-sm">Software Developers</h3>
                </div>
                <p className="text-xs text-[#8b92a9] leading-relaxed mb-5">
                  Looking for skilled frontend, backend, and full-stack developers who love writing clean code, designing robust APIs, and optimizing database layers.
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#556080] block mb-2 font-semibold">Primary Tech Stack</span>
                <div className="flex flex-wrap gap-1.5">
                  {["React", "Next.js", "Node.js", "Python", "PostgreSQL"].map(skill => (
                    <span key={skill} className="skill-tag text-[10px]">{skill}</span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* University Collaboration */}
            <motion.div 
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.38, delay: 0.05 }}
              className="card p-7 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-[#4f8ef7]/10 border border-[#4f8ef7]/20 flex items-center justify-center text-[#4f8ef7]">
                    <GraduationCap size={16} />
                  </div>
                  <h3 className="font-semibold text-[#e8eaf2] text-sm">University Collaboration</h3>
                </div>
                <p className="text-xs text-[#8b92a9] leading-relaxed mb-5">
                  As our engineering core is associated with Addis Ababa University (AAU), we occasionally collaborate with students on academic, research, and production-grade software development projects.
                </p>
              </div>
              <div className="text-[11px] text-[#4f8ef7] font-semibold flex items-center gap-1">
                AAU Engineering Program Partner
              </div>
            </motion.div>

            {/* Internship Program */}
            <motion.div 
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.38, delay: 0.1 }}
              className="card p-7 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-[#4f8ef7]/10 border border-[#4f8ef7]/20 flex items-center justify-center text-[#4f8ef7]">
                    <Users size={16} />
                  </div>
                  <h3 className="font-semibold text-[#e8eaf2] text-sm">Internship Program</h3>
                </div>
                <p className="text-xs text-[#8b92a9] leading-relaxed mb-5">
                  We look to nurture engineering talent. Even if we do not have immediate active openings, internship applications are continuously reviewed based on ongoing project cycles and mentor availability.
                </p>
              </div>
              <div className="text-[11px] text-[#556080] italic">
                Reviewed per project availability
              </div>
            </motion.div>

            {/* Project Collaboration */}
            <motion.div 
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.38, delay: 0.15 }}
              className="card p-7 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-[#4f8ef7]/10 border border-[#4f8ef7]/20 flex items-center justify-center text-[#4f8ef7]">
                    <Handshake size={16} />
                  </div>
                  <h3 className="font-semibold text-[#e8eaf2] text-sm">Project Collaboration</h3>
                </div>
                <p className="text-xs text-[#8b92a9] leading-relaxed mb-5">
                  We welcome collaboration with independent developers, startup founders, technical researchers, and organizations requiring bespoke software engineering solutions.
                </p>
              </div>
              <div className="text-[11px] text-[#4f8ef7] font-semibold flex items-center gap-1">
                Open to partnerships
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Join BetterDose */}
      <section className="py-16 px-6 bg-[#121620]/30 border-y border-[#1a2030]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="section-label mx-auto">Benefits</span>
            <h2 className="text-heading mt-2">Why Join BetterDose</h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { icon: Briefcase, title: "Real Software Projects", desc: "Contribute to actual, production-ready software systems shipped to clients." },
              { icon: Cpu, title: "Collaborative Devs", desc: "Work closely in an environment focused on sharing knowledge and clean architectures." },
              { icon: BookOpen, title: "Modern Tech", desc: "Gain hands-on experience using industry-standard tech stacks and modern tools." },
              { icon: FolderIcon, title: "Portfolio-Building", desc: "Build stellar, verifiable proof-of-work to jumpstart your career." }
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="card p-5 text-center flex flex-col items-center"
              >
                <div className="w-8 h-8 rounded-lg bg-[#1f2433] border border-[#252d3d] flex items-center justify-center text-[#4f8ef7] mb-3">
                  <item.icon size={15} />
                </div>
                <h4 className="text-xs font-semibold text-[#e8eaf2] mb-1.5">{item.title}</h4>
                <p className="text-[11px] text-[#8b92a9] leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="application-form" className="py-20 px-6 scroll-mt-24">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-label mx-auto">Application</span>
            <h2 className="text-heading mt-2">Submit Your Interest</h2>
            <p className="text-xs text-[#8b92a9] mt-2">Fill out the details below, and our core engineering team will contact you.</p>
          </div>

          <div className="card p-8 relative overflow-hidden">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form 
                  key="form"
                  onSubmit={handleSubmit} 
                  className="space-y-4"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Full Name */}
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-[#556080] mb-1 block font-semibold">Full Name *</label>
                    <input 
                      type="text" 
                      value={formData.fullName} 
                      onChange={e => handleChange("fullName", e.target.value)} 
                      className={`input w-full ${errors.fullName ? "border-red-500/50 focus:border-red-500" : ""}`}
                      placeholder="e.g. Nebiyu Muluadam"
                    />
                    {errors.fullName && <span className="text-[10px] text-red-400 mt-1 block">{errors.fullName}</span>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-[#556080] mb-1 block font-semibold">Email Address *</label>
                    <input 
                      type="email" 
                      value={formData.email} 
                      onChange={e => handleChange("email", e.target.value)} 
                      className={`input w-full ${errors.email ? "border-red-500/50 focus:border-red-500" : ""}`}
                      placeholder="e.g. name@domain.com"
                    />
                    {errors.email && <span className="text-[10px] text-red-400 mt-1 block">{errors.email}</span>}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* GitHub */}
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-[#556080] mb-1 block font-semibold font-mono">GitHub Profile</label>
                      <input 
                        type="url" 
                        value={formData.githubProfile} 
                        onChange={e => handleChange("githubProfile", e.target.value)} 
                        className="input w-full"
                        placeholder="https://github.com/username"
                      />
                    </div>

                    {/* Portfolio */}
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-[#556080] mb-1 block font-semibold">Portfolio Website</label>
                      <input 
                        type="url" 
                        value={formData.portfolioWebsite} 
                        onChange={e => handleChange("portfolioWebsite", e.target.value)} 
                        className="input w-full"
                        placeholder="https://myportfolio.com"
                      />
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-[#556080] mb-1 block font-semibold">Skills & Technologies *</label>
                    <input 
                      type="text" 
                      value={formData.skills} 
                      onChange={e => handleChange("skills", e.target.value)} 
                      className={`input w-full ${errors.skills ? "border-red-500/50 focus:border-red-500" : ""}`}
                      placeholder="e.g. React, Next.js, Node.js, Python"
                    />
                    {errors.skills && <span className="text-[10px] text-red-400 mt-1 block">{errors.skills}</span>}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-[#556080] mb-1 block font-semibold">Tell us about yourself *</label>
                    <textarea 
                      rows={4}
                      value={formData.message} 
                      onChange={e => handleChange("message", e.target.value)} 
                      className={`input w-full resize-none ${errors.message ? "border-red-500/50 focus:border-red-500" : ""}`}
                      placeholder="Share a bit about your experiences, goals, and why you'd like to collaborate with BetterDose..."
                    />
                    {errors.message && <span className="text-[10px] text-red-400 mt-1 block">{errors.message}</span>}
                  </div>

                  {errors.submit && <p className="text-xs text-red-400 mt-2">{errors.submit}</p>}

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="btn btn-primary w-full justify-center mt-2"
                  >
                    {loading ? (
                      <span className="flex items-center gap-1.5">
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Submitting Interest...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <Send size={13} /> Submit Application
                      </span>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-center py-8 flex flex-col items-center justify-center"
                >
                  <div className="w-14 h-14 rounded-full bg-[#4f8ef7]/10 border border-[#4f8ef7]/20 flex items-center justify-center text-[#4f8ef7] mb-5">
                    <CheckCircle2 size={28} />
                  </div>
                  <h3 className="font-semibold text-lg text-[#e8eaf2] mb-2">Application Received!</h3>
                  <p className="text-xs text-[#8b92a9] leading-relaxed max-w-sm mb-6">
                    Thank you for your interest in working with BetterDose. Our engineering team has received your details and will review your profile shortly.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="btn btn-ghost text-xs py-1.5 px-4"
                  >
                    Submit Another Response
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
