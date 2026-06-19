"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, ExternalLink, Send, CheckCircle2, FileUp, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchConfig, BusinessConfig, apiSubmitContactMessage, INITIAL_CONFIG } from "@/lib/db";

export default function ContactPage() {
  const [config, setConfig] = useState<BusinessConfig>(INITIAL_CONFIG);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    projectType: "",
    projectGoal: "",
    projectStage: "",
    budgetPreference: "",
    estimatedBudget: "",
    desiredTimeline: "",
    message: ""
  });
  
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchConfig().then(setConfig);
  }, []);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.email.trim()) {
      errs.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = "Please enter a valid email address";
    }
    if (!formData.projectType) errs.projectType = "Required";
    if (!formData.projectGoal) errs.projectGoal = "Required";
    if (!formData.projectStage) errs.projectStage = "Required";
    if (!formData.budgetPreference) errs.budgetPreference = "Required";
    if (formData.budgetPreference === "fixed" && !formData.estimatedBudget.trim()) errs.estimatedBudget = "Required";
    if (!formData.desiredTimeline) errs.desiredTimeline = "Required";
    if (!formData.message.trim()) errs.message = "Project Description is required";
    
    setErrors(errs);
    
    // Auto-scroll to first error (simple implementation)
    if (Object.keys(errs).length > 0) {
      setTimeout(() => {
        const errorEl = document.querySelector('.border-red-500\\/50, .text-red-400');
        if (errorEl) errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
    
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const validFiles = selectedFiles.filter(f => f.size <= 10 * 1024 * 1024);
      if (validFiles.length < selectedFiles.length) {
        alert("Some files were skipped because they exceed the 10MB limit.");
      }
      setFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    // 1. Upload files
    let uploadedUrls: string[] = [];
    if (files.length > 0) {
      const uploadData = new FormData();
      files.forEach(f => uploadData.append("files", f));
      
      try {
        const res = await fetch("/api/public-upload", { method: "POST", body: uploadData });
        if (res.ok) {
          const json = await res.json();
          uploadedUrls = json.urls;
        } else {
          setErrors({ submit: "Failed to upload files. Please try again." });
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("Upload error", err);
        setErrors({ submit: "Server error during file upload." });
        setLoading(false);
        return;
      }
    }

    // 2. Format message
    const formattedMessage = `
Company: ${formData.company || "N/A"}
Project Type: ${formData.projectType}
Project Goal: ${formData.projectGoal}
Project Stage: ${formData.projectStage}
Budget: ${formData.budgetPreference === "fixed" ? formData.estimatedBudget : "Needs Quote"}
Timeline: ${formData.desiredTimeline}
${uploadedUrls.length > 0 ? `\nAttachments:\n${uploadedUrls.map(url => `- ${url}`).join("\n")}\n` : ""}
--------------------------------------------------
Project Description:
${formData.message}
    `.trim();

    const payload = {
      name: formData.name,
      email: formData.email,
      subject: `Inquiry: ${formData.projectType}`,
      message: formattedMessage
    };

    const result = await apiSubmitContactMessage(payload);
    setLoading(false);

    if (result) {
      setSubmitted(true);
      setFormData({
        name: "", company: "", email: "", projectType: "", projectGoal: "",
        projectStage: "", budgetPreference: "", estimatedBudget: "", desiredTimeline: "", message: ""
      });
      setFiles([]);
    } else {
      setErrors({ submit: "Failed to send message. Please try again later." });
    }
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="pt-36 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <span className="section-label">Contact BetterDose</span>
          <h1 className="text-display mb-4">Let&apos;s Build Something Great Together</h1>
          <p className="text-subheading mb-14 max-w-3xl">
            Whether you&apos;re looking for a software development team, QA testers, automation specialists, or technical consulting, we&apos;d love to hear about your project. Our team works with startups, businesses, organizations, and student-led initiatives to design, develop, test, and maintain software solutions.
            <br /><br />
            <span className="text-[#e8eaf2] font-semibold">Response Time:</span> Usually within 24 hours
          </p>
          
          <div className="grid md:grid-cols-12 gap-8 items-start">
            {/* Info Cards (Left - 5 cols) */}
            <div className="md:col-span-5 space-y-6">
              {/* Direct Contacts */}
              <div className="card p-7 space-y-6">
                <h2 className="text-sm font-semibold text-[#e8eaf2]">Direct Contacts</h2>
                {[
                  { icon: <Mail size={15} />, label: "Email", value: config.email, href: `mailto:${config.email}` },
                  { icon: <Phone size={15} />, label: "Phone", value: config.phone, href: `tel:${config.phone}` },
                  ...(config.phone2 ? [{ icon: <Phone size={15} />, label: "Phone 2", value: config.phone2, href: `tel:${config.phone2}` }] : []),
                  ...(config.phone3 ? [{ icon: <Phone size={15} />, label: "Phone 3", value: config.phone3, href: `tel:${config.phone3}` }] : []),
                  { icon: <MapPin size={15} />, label: "Location", value: config.address, href: undefined },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-lg bg-[#1f2433] border border-[#252d3d] flex items-center justify-center text-[#4f8ef7] shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[10px] text-[#556080] uppercase tracking-wider font-semibold">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-xs text-[#e8eaf2] hover:text-[#4f8ef7] transition-colors break-all">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-xs text-[#e8eaf2]">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Online Profiles */}
              <div className="card p-7 space-y-4">
                <h2 className="text-sm font-semibold text-[#e8eaf2]">Online Profiles</h2>
                <div className="flex flex-col gap-1">
                  {[
                    { label: "GitHub — Nebiyu M.", url: config.githubNebiyu },
                    { label: "GitHub — Eyob M.", url: config.githubEyob },
                    { label: "GitHub — Abel T.", url: config.githubAbel },
                    { label: "LinkedIn — Nebiyu M.", url: config.linkedInNebiyu },
                    { label: "LinkedIn — Eyob M.", url: config.linkedInEyob },
                    { label: "LinkedIn — Abel T.", url: config.linkedInAbel },
                  ].filter(l => l.url).map(link => (
                    <a 
                      key={link.label} 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between py-2.5 border-b border-[#1a2030] text-xs text-[#8b92a9] hover:text-[#4f8ef7] transition-colors"
                    >
                      <span>{link.label}</span> 
                      <ExternalLink size={12} className="shrink-0 ml-2" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Form (Right - 7 cols) */}
            <div className="md:col-span-7 space-y-6">
              
              <div className="card p-8">
                <AnimatePresence mode="wait">
                  {!submitted ? (
                    <motion.form 
                      key="contact-form"
                      onSubmit={handleSubmit} 
                      className="space-y-6"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div>
                        <h2 className="text-sm font-semibold text-[#e8eaf2] mb-1">Send Us a Message</h2>
                        <p className="text-xs text-[#8b92a9] leading-relaxed">
                          Let&apos;s discuss your project. The more information you provide, the more accurately we can estimate scope, timeline, and cost.
                        </p>
                      </div>
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        {/* Name */}
                        <div>
                          <label className="text-[10px] uppercase tracking-widest text-[#556080] mb-1.5 block font-semibold">Full Name *</label>
                          <input 
                            type="text" 
                            value={formData.name} 
                            onChange={e => handleChange("name", e.target.value)} 
                            className={`input w-full ${errors.name ? "border-red-500/50 focus:border-red-500" : ""}`}
                            placeholder="e.g. Sarah Johnson"
                          />
                          {errors.name && <span className="text-[10px] text-red-400 mt-1 block">{errors.name}</span>}
                        </div>
                        {/* Company */}
                        <div>
                          <label className="text-[10px] uppercase tracking-widest text-[#556080] mb-1.5 block font-semibold">Company / Organization</label>
                          <input 
                            type="text" 
                            value={formData.company} 
                            onChange={e => handleChange("company", e.target.value)} 
                            className="input w-full"
                            placeholder="e.g. Acme Technologies"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="text-[10px] uppercase tracking-widest text-[#556080] mb-1.5 block font-semibold">Email Address *</label>
                        <input 
                          type="email" 
                          value={formData.email} 
                          onChange={e => handleChange("email", e.target.value)} 
                          className={`input w-full ${errors.email ? "border-red-500/50 focus:border-red-500" : ""}`}
                          placeholder="e.g. sarah@company.com"
                        />
                        {errors.email && <span className="text-[10px] text-red-400 mt-1 block">{errors.email}</span>}
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4 border-t border-[#252d3d] pt-6">
                        {/* Project Type */}
                        <div>
                          <label className="text-[10px] uppercase tracking-widest text-[#556080] mb-1.5 block font-semibold">Project Type *</label>
                          <select 
                            value={formData.projectType} 
                            onChange={e => handleChange("projectType", e.target.value)} 
                            className={`input w-full appearance-none bg-transparent ${errors.projectType ? "border-red-500/50 focus:border-red-500" : ""}`}
                          >
                            <option value="" disabled className="bg-[#121620]">Select a type...</option>
                            {["Website", "Web Application", "SaaS Platform", "Mobile App", "QA & Testing", "Automation", "WordPress", "API Development", "Other"].map(opt => (
                              <option key={opt} value={opt} className="bg-[#121620]">{opt}</option>
                            ))}
                          </select>
                          {errors.projectType && <span className="text-[10px] text-red-400 mt-1 block">{errors.projectType}</span>}
                        </div>

                        {/* Project Stage */}
                        <div>
                          <label className="text-[10px] uppercase tracking-widest text-[#556080] mb-1.5 block font-semibold">Project Stage *</label>
                          <select 
                            value={formData.projectStage} 
                            onChange={e => handleChange("projectStage", e.target.value)} 
                            className={`input w-full appearance-none bg-transparent ${errors.projectStage ? "border-red-500/50 focus:border-red-500" : ""}`}
                          >
                            <option value="" disabled className="bg-[#121620]">Select a stage...</option>
                            {["Just an Idea", "Planning", "Design Ready", "In Development", "Existing Product Needs Improvements"].map(opt => (
                              <option key={opt} value={opt} className="bg-[#121620]">{opt}</option>
                            ))}
                          </select>
                          {errors.projectStage && <span className="text-[10px] text-red-400 mt-1 block">{errors.projectStage}</span>}
                        </div>
                      </div>

                      {/* Project Goal */}
                      <div>
                        <label className="text-[10px] uppercase tracking-widest text-[#556080] mb-1.5 block font-semibold">Project Goal *</label>
                        <select 
                          value={formData.projectGoal} 
                          onChange={e => handleChange("projectGoal", e.target.value)} 
                          className={`input w-full appearance-none bg-transparent ${errors.projectGoal ? "border-red-500/50 focus:border-red-500" : ""}`}
                        >
                          <option value="" disabled className="bg-[#121620]">What are you trying to achieve?</option>
                          {["Launch a SaaS platform", "Automate business operations", "Improve an existing application", "Build an MVP", "Test a mobile app", "Other"].map(opt => (
                            <option key={opt} value={opt} className="bg-[#121620]">{opt}</option>
                          ))}
                        </select>
                        <p className="text-[10px] text-[#556080] mt-1.5">E.g. Launch a SaaS platform, Automate business operations, etc.</p>
                        {errors.projectGoal && <span className="text-[10px] text-red-400 mt-1 block">{errors.projectGoal}</span>}
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4 border-t border-[#252d3d] pt-6 items-start">
                        {/* Budget */}
                        <div>
                          <label className="text-[10px] uppercase tracking-widest text-[#556080] mb-3 block font-semibold">Budget Preference *</label>
                          <div className="space-y-2 mb-3">
                            <label className="flex items-center gap-2 text-xs text-[#c8cde0] cursor-pointer">
                              <input type="radio" name="budget" value="fixed" checked={formData.budgetPreference === "fixed"} onChange={(e) => handleChange("budgetPreference", e.target.value)} className="accent-[#4f8ef7]" />
                              I have a fixed budget
                            </label>
                            <label className="flex items-center gap-2 text-xs text-[#c8cde0] cursor-pointer">
                              <input type="radio" name="budget" value="quote" checked={formData.budgetPreference === "quote"} onChange={(e) => handleChange("budgetPreference", e.target.value)} className="accent-[#4f8ef7]" />
                              I need a quote
                            </label>
                          </div>
                          {errors.budgetPreference && <span className="text-[10px] text-red-400 mt-1 block mb-3">{errors.budgetPreference}</span>}
                          
                          {formData.budgetPreference === "fixed" && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="overflow-hidden">
                              <label className="text-[10px] uppercase tracking-widest text-[#556080] mb-1.5 block font-semibold">Estimated Budget *</label>
                              <input type="text" value={formData.estimatedBudget} onChange={e => handleChange("estimatedBudget", e.target.value)} className={`input w-full ${errors.estimatedBudget ? "border-red-500/50" : ""}`} placeholder="e.g. $5,000" />
                              {errors.estimatedBudget && <span className="text-[10px] text-red-400 mt-1 block">{errors.estimatedBudget}</span>}
                            </motion.div>
                          )}
                          {formData.budgetPreference === "quote" && (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-[#4f8ef7] bg-[#4f8ef7]/10 p-2 rounded border border-[#4f8ef7]/20">
                              Tell us about your requirements below and we&apos;ll provide an estimate.
                            </motion.p>
                          )}
                        </div>

                        {/* Desired Timeline */}
                        <div>
                          <label className="text-[10px] uppercase tracking-widest text-[#556080] mb-1.5 block font-semibold">Desired Timeline *</label>
                          <select 
                            value={formData.desiredTimeline} 
                            onChange={e => handleChange("desiredTimeline", e.target.value)} 
                            className={`input w-full appearance-none bg-transparent ${errors.desiredTimeline ? "border-red-500/50 focus:border-red-500" : ""}`}
                          >
                            <option value="" disabled className="bg-[#121620]">Select timeline...</option>
                            {["Immediately", "Within 1 Month", "Within 3 Months", "Flexible"].map(opt => (
                              <option key={opt} value={opt} className="bg-[#121620]">{opt}</option>
                            ))}
                          </select>
                          {errors.desiredTimeline && <span className="text-[10px] text-red-400 mt-1 block">{errors.desiredTimeline}</span>}
                        </div>
                      </div>

                      {/* Message */}
                      <div className="border-t border-[#252d3d] pt-6">
                        <label className="text-[10px] uppercase tracking-widest text-[#556080] mb-1.5 block font-semibold">Project Description *</label>
                        <p className="text-[10px] text-[#8b92a9] mb-3 leading-relaxed">
                          Tell us: <br/>
                          • What problem you&apos;re trying to solve <br/>
                          • Key features you need <br/>
                          • Existing website/app links (if any) <br/>
                          • Preferred technologies (optional)
                        </p>
                        <textarea 
                          rows={8}
                          value={formData.message} 
                          onChange={e => handleChange("message", e.target.value)} 
                          className={`input w-full resize-none ${errors.message ? "border-red-500/50 focus:border-red-500" : ""}`}
                          placeholder="Type your project description here..."
                        />
                        {errors.message && <span className="text-[10px] text-red-400 mt-1 block">{errors.message}</span>}
                      </div>

                      {/* Attachments */}
                      <div className="bg-[#121620]/50 border border-dashed border-[#252d3d] rounded-xl p-6 text-center hover:border-[#4f8ef7]/40 transition-colors">
                        <FileUp className="mx-auto text-[#556080] mb-3" size={24} />
                        <h4 className="text-sm font-medium text-[#e8eaf2] mb-1">Additional Files</h4>
                        <p className="text-[10px] text-[#8b92a9] mb-4">Upload screenshots, specifications, mockups, PDFs, or requirement documents (Max 10MB each).</p>
                        <input 
                          type="file" 
                          multiple 
                          className="hidden" 
                          ref={fileInputRef} 
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
                        />
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="btn btn-ghost text-xs py-1.5 px-4 bg-[#1f2433]">
                          Choose Files
                        </button>

                        {files.length > 0 && (
                          <div className="mt-4 flex flex-col gap-2 text-left max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                            {files.map((file, idx) => (
                              <div key={idx} className="flex items-center justify-between text-xs bg-[#1f2433] border border-[#252d3d] rounded p-2">
                                <span className="text-[#c8cde0] truncate pr-4">{file.name}</span>
                                <button type="button" onClick={() => removeFile(idx)} className="text-[#8b92a9] hover:text-red-400 transition-colors">
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {errors.submit && <p className="text-xs text-red-400 mt-2 text-center">{errors.submit}</p>}

                      {/* Submit Button */}
                      <div className="pt-4">
                        <button 
                          type="submit" 
                          disabled={loading}
                          className="btn btn-primary w-full justify-center py-3 cursor-pointer"
                        >
                          {loading ? (
                            <span className="flex items-center gap-2">
                              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Processing & Sending...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <Send size={15} /> Send Project Inquiry
                            </span>
                          )}
                        </button>
                      </div>
                    </motion.form>
                  ) : (
                    <motion.div 
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="text-center py-12 flex flex-col items-center justify-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-[#4f8ef7]/10 border border-[#4f8ef7]/20 flex items-center justify-center text-[#4f8ef7] mb-6">
                        <CheckCircle2 size={32} />
                      </div>
                      <h3 className="font-semibold text-lg text-[#e8eaf2] mb-3">Project Inquiry Sent!</h3>
                      <p className="text-xs text-[#8b92a9] leading-relaxed max-w-sm mb-8">
                        Thank you for reaching out to us. Your project details and attachments have been securely saved to our system, and our engineering team will review them within 24 hours.
                      </p>
                      <button 
                        onClick={() => setSubmitted(false)}
                        className="btn btn-ghost text-xs py-2 px-5"
                      >
                        Submit Another Inquiry
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
