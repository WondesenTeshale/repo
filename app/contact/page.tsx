"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, ExternalLink, Send, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchConfig, BusinessConfig, apiSubmitContactMessage, INITIAL_CONFIG } from "@/lib/db";

export default function ContactPage() {
  const [config, setConfig] = useState<BusinessConfig>(INITIAL_CONFIG);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    if (!formData.message.trim()) errs.message = "Message is required";
    
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
    const result = await apiSubmitContactMessage(formData);
    setLoading(false);

    if (result) {
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } else {
      setErrors({ submit: "Failed to send message. Please try again later." });
    }
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="pt-36 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <span className="section-label">Get In Touch</span>
          <h1 className="text-display mb-4">Contact Us</h1>
          <p className="text-subheading mb-14 max-w-2xl">
            Reach out to discuss a project, request a quote, or ask about our services. Our engineering team responds within 24 hours.
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
            <div className="md:col-span-7">
              <div className="card p-8">
                <AnimatePresence mode="wait">
                  {!submitted ? (
                    <motion.form 
                      key="contact-form"
                      onSubmit={handleSubmit} 
                      className="space-y-4"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h2 className="text-sm font-semibold text-[#e8eaf2] mb-2">Send Us a Message</h2>
                      
                      {/* Name */}
                      <div>
                        <label className="text-[10px] uppercase tracking-widest text-[#556080] mb-1.5 block font-semibold">Your Name *</label>
                        <input 
                          type="text" 
                          value={formData.name} 
                          onChange={e => handleChange("name", e.target.value)} 
                          className={`input w-full ${errors.name ? "border-red-500/50 focus:border-red-500" : ""}`}
                          placeholder="e.g. Abel Tadesse"
                        />
                        {errors.name && <span className="text-[10px] text-red-400 mt-1 block">{errors.name}</span>}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="text-[10px] uppercase tracking-widest text-[#556080] mb-1.5 block font-semibold">Email Address *</label>
                        <input 
                          type="email" 
                          value={formData.email} 
                          onChange={e => handleChange("email", e.target.value)} 
                          className={`input w-full ${errors.email ? "border-red-500/50 focus:border-red-500" : ""}`}
                          placeholder="e.g. abel@domain.com"
                        />
                        {errors.email && <span className="text-[10px] text-red-400 mt-1 block">{errors.email}</span>}
                      </div>

                      {/* Subject */}
                      <div>
                        <label className="text-[10px] uppercase tracking-widest text-[#556080] mb-1.5 block font-semibold font-mono">Subject</label>
                        <input 
                          type="text" 
                          value={formData.subject} 
                          onChange={e => handleChange("subject", e.target.value)} 
                          className="input w-full"
                          placeholder="e.g. Project Inquiry"
                        />
                      </div>

                      {/* Message */}
                      <div>
                        <label className="text-[10px] uppercase tracking-widest text-[#556080] mb-1.5 block font-semibold">Your Message *</label>
                        <textarea 
                          rows={5}
                          value={formData.message} 
                          onChange={e => handleChange("message", e.target.value)} 
                          className={`input w-full resize-none ${errors.message ? "border-red-500/50 focus:border-red-500" : ""}`}
                          placeholder="Type your message details here..."
                        />
                        {errors.message && <span className="text-[10px] text-red-400 mt-1 block">{errors.message}</span>}
                      </div>

                      {errors.submit && <p className="text-xs text-red-400 mt-2">{errors.submit}</p>}

                      {/* Submit Button */}
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="btn btn-primary w-full justify-center mt-2 cursor-pointer"
                      >
                        {loading ? (
                          <span className="flex items-center gap-1.5">
                            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Sending Message...
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5">
                            <Send size={13} /> Send Message
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
                      className="text-center py-12 flex flex-col items-center justify-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-[#4f8ef7]/10 border border-[#4f8ef7]/20 flex items-center justify-center text-[#4f8ef7] mb-6">
                        <CheckCircle2 size={32} />
                      </div>
                      <h3 className="font-semibold text-lg text-[#e8eaf2] mb-3">Message Sent!</h3>
                      <p className="text-xs text-[#8b92a9] leading-relaxed max-w-sm mb-8">
                        Thank you for reaching out to us. Your message has been saved to our inbox, and an email notification has been sent to our operations email at <span className="font-mono text-[#e8eaf2]">contact@betterdose.dev</span>. We will review it and reply shortly.
                      </p>
                      <button 
                        onClick={() => setSubmitted(false)}
                        className="btn btn-ghost text-xs py-2 px-5"
                      >
                        Send Another Message
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
