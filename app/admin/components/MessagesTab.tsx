"use client";

import { useEffect, useState } from "react";
import { Mail, MailOpen, Trash2, Archive, Clock, ExternalLink } from "lucide-react";
import { ContactMessage, apiFetchContactMessages, apiDeleteContactMessage, apiUpdateMessageStatus } from "@/lib/db";

interface Props {
  token: string;
}

function daysAgo(d: number): string {
  const dt = new Date();
  dt.setDate(dt.getDate() - d);
  return dt.toISOString();
}

const DEMO_MESSAGES: ContactMessage[] = [
  { id: "d-001", name: "James Whitfield", email: "james.whitfield@techcorp.io", subject: "Enterprise SaaS Development Inquiry", message: "Hi, we are looking for a reliable development partner for a B2B SaaS platform. Our budget is around $80k-$120k. Could we schedule a discovery call this week?", status: "unread", createdAt: daysAgo(1) },
  { id: "d-002", name: "Aisha Okonkwo", email: "aisha@greenfinancehq.com", subject: "Proposal Request — Fintech Dashboard", message: "We need a full-stack developer team to build an investment dashboard for our retail clients. Timeline is 4 months. Please send over a proposal with your team structure.", status: "unread", createdAt: daysAgo(2) },
  { id: "d-003", name: "Samuel Tesfaye", email: "s.tesfaye@uniconnect.et", subject: "University Marketplace Platform", message: "We are a student startup building a campus marketplace app. We saw your portfolio and are very impressed. Can we talk about a quote for MVP development?", status: "read", createdAt: daysAgo(3) },
  { id: "d-004", name: "Charlotte Evans", email: "charlotte@nexwave.co.uk", subject: "Website Redesign + SEO Package", message: "Our current site is outdated and we are losing leads. We need a full redesign with SEO optimization. What does your typical engagement look like and what is the pricing?", status: "read", createdAt: daysAgo(4) },
  { id: "d-005", name: "Luca Ferretti", email: "l.ferretti@milanventures.it", subject: "React Native Mobile App", message: "Ciao! We are a Milan-based startup looking for a team to build a React Native app for iOS and Android. Do you have availability in Q3 2026?", status: "unread", createdAt: daysAgo(5) },
  { id: "d-006", name: "Priya Nair", email: "priya.nair@healthsync.in", subject: "Healthcare Portal Development", message: "We are a healthcare startup in Bangalore building a patient-doctor appointment portal. We need a secure, HIPAA-aware web app. Can you help?", status: "read", createdAt: daysAgo(7) },
  { id: "d-007", name: "Tom Brinkworth", email: "tom@brinkworth-law.com", subject: "Legal Firm Website Project", message: "We need a professional website for our law firm. 10 pages, no e-commerce, just a clean branding site with a contact form and blog. What is your earliest start date?", status: "read", createdAt: daysAgo(8) },
  { id: "d-008", name: "Fatuma Hassen", email: "fatuma@agateway.et", subject: "NGO Website & Donor Platform", message: "We are a registered NGO looking to build a website with an integrated donation and volunteer management system. We have a limited grant budget of around $15,000.", status: "unread", createdAt: daysAgo(10) },
  { id: "d-009", name: "David Kowalski", email: "d.kowalski@warelogix.pl", subject: "Warehouse Management System", message: "We need a custom WMS web app with barcode scanning, inventory tracking and reporting. Looking for a long-term technical partner.", status: "archived", createdAt: daysAgo(12) },
  { id: "d-010", name: "Amara Diallo", email: "amara.d@edutech.sn", subject: "E-Learning Platform Build", message: "We are building an online learning platform for West African students. We need video hosting, quiz engine, certification and payments. Budget is flexible for the right team.", status: "read", createdAt: daysAgo(14) },
  { id: "d-011", name: "Hannah Müller", email: "hannah@muller-kreativ.de", subject: "Brand Identity + Web Design", message: "Hallo! We are rebranding our creative agency and need a new logo, brand kit and website. Do you offer design-only packages?", status: "read", createdAt: daysAgo(16) },
  { id: "d-012", name: "Kevin Achebe", email: "kevin@tradehubng.com", subject: "B2B Trade Platform Nigeria", message: "We are building an online B2B trade platform for Nigerian SMEs. Think of it as an Alibaba for Africa. We need a strong technical team. Let us know if you are interested.", status: "unread", createdAt: daysAgo(18) },
  { id: "d-013", name: "Isabella Rossi", email: "i.rossi@luxurytours.it", subject: "Luxury Travel Booking Platform", message: "We run a premium travel company and want to build a custom booking system with a client portal, itinerary builder and payment gateway. Please share your process.", status: "read", createdAt: daysAgo(20) },
  { id: "d-014", name: "Ethan Clarke", email: "ethan@growthlab.io", subject: "Marketing Automation SaaS Tool", message: "We are building a no-code marketing automation tool for SMEs. We need a founding engineer partner. Equity + cash compensation. Are you open to this model?", status: "read", createdAt: daysAgo(22) },
  { id: "d-015", name: "Meron Girma", email: "meron@addislogistics.com", subject: "Logistics Tracking App Ethiopia", message: "We are one of the largest logistics companies in Ethiopia and need a web + mobile tracking app for our fleet. We have an in-house IT team but need experienced outsourced devs.", status: "archived", createdAt: daysAgo(25) },
  { id: "d-016", name: "Oliver Bennett", email: "oliver@proptech.co.uk", subject: "Real Estate SaaS Platform", message: "We are a PropTech startup building a platform for UK landlords and letting agents. Rent collection, tenancy agreements, maintenance requests. Need full dev team.", status: "read", createdAt: daysAgo(28) },
  { id: "d-017", name: "Zoe Andersen", email: "zoe@scandinaviancreative.dk", subject: "Portfolio Website for Design Studio", message: "We are a Danish design studio looking for a stunning portfolio site that can also handle client project showcases. Minimalist and modern. Budget around $6,000.", status: "unread", createdAt: daysAgo(30) },
  { id: "d-018", name: "Yohannes Bekele", email: "yb@habeshatech.et", subject: "ERP System for Manufacturing", message: "We manufacture garments for export and need a custom ERP covering procurement, production, HR and sales. Would love to discuss this with your team.", status: "read", createdAt: daysAgo(33) },
  { id: "d-019", name: "Chloe Martin", email: "chloe@restaurantpos.fr", subject: "Restaurant POS & Management System", message: "We are a Paris-based SaaS startup building a POS and restaurant management app. We need a React frontend developer urgently. Can you start in 2 weeks?", status: "read", createdAt: daysAgo(36) },
  { id: "d-020", name: "Nnamdi Osei", email: "n.osei@capitalfunds.gh", subject: "Investment Fund Portfolio App", message: "We manage a $50M fund and need a secure investor portal showing portfolio performance, reports, and capital call notifications. Very sensitive data — security is paramount.", status: "unread", createdAt: daysAgo(40) },
  { id: "d-021", name: "Sophia Larsen", email: "sophia@hrplatform.no", subject: "HR Management SaaS for Startups", message: "We are building an HR SaaS targeting Nordic startups — payroll, leave, performance reviews. Looking for a CTO-level technical partner for the first build phase.", status: "read", createdAt: daysAgo(44) },
  { id: "d-022", name: "Benjamin Addo", email: "b.addo@ghanahealthcare.com", subject: "National Health Records System", message: "We won a government tender to build a national digital health records system. Looking for experienced enterprise software developers with healthcare experience.", status: "archived", createdAt: daysAgo(48) },
  { id: "d-023", name: "Valeria Torres", email: "valeria@crecer.mx", subject: "EdTech Platform Mexico", message: "We are building a learning platform for adult literacy in rural Mexico. We need a very accessible, low-bandwidth app in Spanish. Do you have experience with this?", status: "read", createdAt: daysAgo(52) },
  { id: "d-024", name: "Ryan O'Neill", email: "ryan@irishsoftware.ie", subject: "Custom CRM for Insurance Brokers", message: "We are an Irish insurance brokerage and need a custom CRM to manage our 4,000 clients. We have looked at off-the-shelf solutions but none fit. Interested?", status: "read", createdAt: daysAgo(56) },
  { id: "d-025", name: "Lena Bergström", email: "lena@swenordic.se", subject: "E-commerce Platform Rebuild", message: "We currently use Shopify but need a fully custom e-commerce solution with advanced filtering, a B2B portal and an ERP integration. Let us know your capacity.", status: "unread", createdAt: daysAgo(60) },
  { id: "d-026", name: "Abdi Warsame", email: "a.warsame@mogadishtrade.so", subject: "Trade Finance Web App", message: "We facilitate international trade from Somalia and East Africa. We need a platform for invoice factoring and letters of credit. Is this within your scope?", status: "read", createdAt: daysAgo(65) },
  { id: "d-027", name: "Maricel Reyes", email: "maricel@pinoydev.ph", subject: "Freelance Marketplace Philippines", message: "We are building a Fiverr-style freelance marketplace specifically for Filipino developers and clients. Looking for a technical co-founder / lead developer.", status: "read", createdAt: daysAgo(70) },
  { id: "d-028", name: "Felix Braun", email: "felix@smartbuildingde.de", subject: "IoT Dashboard for Smart Buildings", message: "We build smart building infrastructure and need a web dashboard that visualizes sensor data from 50+ buildings in real time. Stack: React + Node + InfluxDB.", status: "archived", createdAt: daysAgo(75) },
  { id: "d-029", name: "Ngozi Eze", email: "ngozi@lagostalent.ng", subject: "Talent Recruitment Platform", message: "We are disrupting recruitment in Lagos. We need a full-stack platform connecting employers with pre-vetted candidates, including video interviews and skill tests.", status: "read", createdAt: daysAgo(80) },
  { id: "d-030", name: "Thomas Birch", email: "thomas@birch-capital.com", subject: "General Inquiry — Partnership", message: "I am a VC partner based in London. We have a portfolio company that needs urgent software development. Can we schedule a call to discuss a possible engagement?", status: "read", createdAt: daysAgo(85) },
];

export default function MessagesTab({ token }: Props) {
  const [dbMessages, setDbMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "read" | "archived">("all");

  const loadMessages = async () => {
    setLoading(true);
    const msgs = await apiFetchContactMessages(token);
    setDbMessages(msgs);
    setLoading(false);
  };

  // Merge real DB messages with demo messages, real ones first
  const messages = [
    ...dbMessages,
    ...DEMO_MESSAGES.filter(d => !dbMessages.some(m => m.id === d.id))
  ];

  useEffect(() => {
    loadMessages();
  }, [token]);

  const handleToggleRead = async (msg: ContactMessage, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = msg.status === "unread" ? "read" : "unread";
    if (msg.id.startsWith("d-")) return; // demo messages are read-only
    const updated = await apiUpdateMessageStatus(msg.id, newStatus, token);
    if (updated) setDbMessages(prev => prev.map(m => m.id === msg.id ? updated : m));
  };

  const handleArchive = async (msg: ContactMessage, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = msg.status === "archived" ? "read" : "archived";
    if (msg.id.startsWith("d-")) return; // demo messages are read-only
    const updated = await apiUpdateMessageStatus(msg.id, newStatus, token);
    if (updated) setDbMessages(prev => prev.map(m => m.id === msg.id ? updated : m));
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (id.startsWith("d-")) return; // demo messages are read-only
    if (confirm("Are you sure you want to delete this message?")) {
      const ok = await apiDeleteContactMessage(id, token);
      if (ok) {
        setDbMessages(prev => prev.filter(m => m.id !== id));
        if (expandedId === id) setExpandedId(null);
      }
    }
  };

  const toggleExpand = async (msg: ContactMessage) => {
    const isExpanding = expandedId !== msg.id;
    setExpandedId(isExpanding ? msg.id : null);
    if (isExpanding && msg.status === "unread" && !msg.id.startsWith("d-")) {
      const updated = await apiUpdateMessageStatus(msg.id, "read", token);
      if (updated) setDbMessages(prev => prev.map(m => m.id === msg.id ? updated : m));
    }
  };

  const filtered = messages.filter(m => {
    if (filter === "all") return m.status !== "archived"; // by default don't show archived in "all"
    return m.status === filter;
  });

  const unreadCount = messages.filter(m => m.status === "unread").length;

  if (loading) {
    return <p className="text-sm text-[#556080]">Loading messages...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Header / Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-[#e8eaf2]">Inbox Submissions</h2>
          <p className="text-xs text-[#8b92a9]">Manage contact requests and project proposals.</p>
        </div>

        {/* Filter Navigation */}
        <div className="flex items-center gap-1 bg-[#151922] p-1 rounded-lg border border-[#252d3d]">
          {(["all", "unread", "read", "archived"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded transition-colors ${
                filter === f 
                  ? "bg-[#1f2433] text-[#4f8ef7]" 
                  : "text-[#556080] hover:text-[#8b92a9]"
              }`}
            >
              {f} {f === "unread" && unreadCount > 0 && `(${unreadCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-[#252d3d] rounded-xl">
          <Mail size={24} className="mx-auto text-[#252d3d] mb-3" />
          <p className="text-xs text-[#556080]">No messages found in this folder.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {filtered.map(msg => {
            const isExpanded = expandedId === msg.id;
            return (
              <div 
                key={msg.id}
                onClick={() => toggleExpand(msg)}
                className={`border rounded-xl transition-all cursor-pointer ${
                  isExpanded 
                    ? "bg-[#151922]/60 border-[#4f8ef7]/40" 
                    : msg.status === "unread"
                      ? "bg-[#151922]/30 border-[#4f8ef7]/20 hover:border-[#4f8ef7]/40"
                      : "bg-transparent border-[#252d3d] hover:border-[#3a4454]"
                }`}
              >
                {/* Header Summary */}
                <div className="p-4 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
                  <div className="flex items-center gap-3 min-w-0">
                    {msg.status === "unread" ? (
                      <div className="w-2 h-2 rounded-full bg-[#4f8ef7] shrink-0" title="Unread" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-[#252d3d] shrink-0" />
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-xs text-[#e8eaf2]">{msg.name}</span>
                        <span className="text-[10px] text-[#556080] font-mono break-all">&lt;{msg.email}&gt;</span>
                      </div>
                      <p className={`text-xs truncate mt-0.5 ${msg.status === "unread" ? "text-[#e8eaf2] font-medium" : "text-[#8b92a9]"}`}>
                        {msg.subject || "(No Subject)"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-auto sm:ml-0">
                    <span className="text-[10px] text-[#556080] flex items-center gap-1">
                      <Clock size={11} /> {new Date(msg.createdAt).toLocaleDateString()}
                    </span>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        title={msg.status === "unread" ? "Mark as Read" : "Mark as Unread"}
                        onClick={(e) => handleToggleRead(msg, e)}
                        className={`p-1.5 rounded hover:bg-[#252d3d] transition-colors ${
                          msg.status === "unread" ? "text-[#4f8ef7]" : "text-[#556080] hover:text-[#e8eaf2]"
                        }`}
                      >
                        {msg.status === "unread" ? <Mail size={13} /> : <MailOpen size={13} />}
                      </button>
                      <button
                        title={msg.status === "archived" ? "Move to Inbox" : "Archive Message"}
                        onClick={(e) => handleArchive(msg, e)}
                        className={`p-1.5 rounded hover:bg-[#252d3d] text-[#556080] hover:text-[#e8eaf2] transition-colors ${
                          msg.status === "archived" ? "text-amber-500" : ""
                        }`}
                      >
                        <Archive size={13} />
                      </button>
                      <button
                        title="Delete Message"
                        onClick={(e) => handleDelete(msg.id, e)}
                        className="p-1.5 rounded hover:bg-[#252d3d] text-[#556080] hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-5 border-t border-[#252d3d]/50 pt-4 cursor-default" onClick={e => e.stopPropagation()}>
                    <div className="grid sm:grid-cols-2 gap-4 mb-4 text-xs">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-[#556080] block font-semibold">Sender Email</span>
                        <a 
                          href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || "Your message to BetterDose")}`}
                          className="text-[#4f8ef7] hover:underline inline-flex items-center gap-1 font-mono mt-0.5"
                        >
                          {msg.email} <ExternalLink size={11} />
                        </a>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-[#556080] block font-semibold">Submitted At</span>
                        <span className="text-[#8b92a9] block mt-0.5">{new Date(msg.createdAt).toLocaleString()}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-[#556080] block font-semibold mb-1">Message Content</span>
                      <div className="bg-[#0f1117] border border-[#252d3d]/70 rounded-lg p-4 text-xs text-[#e8eaf2] whitespace-pre-wrap leading-relaxed">
                        {msg.message}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
