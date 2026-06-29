// seed-leads.mjs - Run: node seed-leads.mjs
import { readFileSync } from "fs";
const env = Object.fromEntries(readFileSync(".env.local","utf8").split("\n").filter(l=>l.includes("=")).map(l=>{const [k,...v]=l.split("=");return[k.trim(),v.join("=").trim()]}));
const URL = env["NEXT_PUBLIC_SUPABASE_URL"];
const KEY = env["SUPABASE_SERVICE_ROLE_KEY"];
if (!URL || !KEY) { console.error("Missing env vars"); process.exit(1); }
const h = { "apikey": KEY, "Authorization": `Bearer ${KEY}`, "Content-Type": "application/json", "Prefer": "return=minimal" };

// Note: lead_number auto-assigned by Postgres sequence starting at 5643
const leads = [
  // ── COMPLETED ENGAGEMENTS (portfolio projects delivered) ─────────────────
  {
    name: "Eyob Mulugeta",
    email: "eyob.mulugeta@betterdose.dev",
    company: "BetterDose Internal",
    subject: "Goojarato – Movie & TV Streaming Platform",
    message: "Full-stack streaming platform built with PHP/Laravel, Livewire, HLS streaming, and cPanel hosting. Delivered with SSL configuration, email routing via PHPMailer, and Cloudflare integration.",
    status: "Completed",
    source: "Internal Project",
    notes: "Completed Dec 2024. All team members contributed. Live in production. Cloudflare CDN configured."
  },
  {
    name: "Abel Tadesse",
    email: "abel.tadesse@betterdose.dev",
    company: "BetterDose Internal",
    subject: "Laravel Application Maintenance & cPanel Hosting Management",
    message: "Client needed full maintenance of legacy Laravel app — dependency upgrades, Eloquent query optimization, SSL, DNS, and file storage on shared cPanel environment.",
    status: "Completed",
    source: "Referral",
    notes: "Delivered Sept 2024. Documented handover notes provided to client. Laravel upgraded to latest stable."
  },
  {
    name: "Nebiyu Muluadam",
    email: "nebiyu.muluadam@betterdose.dev",
    company: "BetterDose Internal",
    subject: "Enterprise-Ready RESTful API Core with JWT Auth",
    message: "Built a production-grade Spring Boot REST API from scratch — JWT auth, BCrypt, rate limiting (Bucket4j), Swagger docs, JUnit 5 test suite with 85%+ coverage, Flyway migrations.",
    status: "Completed",
    source: "Internal Project",
    notes: "Completed Feb 2025. Packaged as reusable Maven archetype. 85% JaCoCo code coverage achieved."
  },
  {
    name: "Nebiyu Muluadam",
    email: "nebiyu.muluadam@betterdose.dev",
    company: "BetterDose Internal",
    subject: "ML Iris Classification & Sales Prediction Model",
    message: "Trained Iris flower classification model achieving 97.8% accuracy using scikit-learn. Extended pipeline to include sales prediction regression model with hyperparameter tuning.",
    status: "Completed",
    source: "Internal Project",
    notes: "Completed Sept 2024. Models validated with cross-validation. Joblib serialization for deployment."
  },
  {
    name: "Nebiyu Muluadam",
    email: "nebiyu.muluadam@betterdose.dev",
    company: "BetterDose Internal",
    subject: "Database Management Panel",
    message: "Built a secure internal database management UI using Next.js, Prisma ORM, and Tailwind CSS with an admin dashboard for schema inspection and record management.",
    status: "Completed",
    source: "Internal Project",
    notes: "Completed Q4 2024. Private project — not publicly listed in portfolio."
  },

  // ── ACTIVE DEVELOPMENT ───────────────────────────────────────────────────
  {
    name: "Nebiyu Muluadam",
    email: "nebiyu.muluadam@betterdose.dev",
    company: "Addis Ababa University",
    subject: "Uniserve – Uniconnect Student Service Marketplace",
    message: "Student-to-student service marketplace built with Spring Boot, JWT auth, Flyway, Testcontainers, React/Vite frontend. Targeting university campus deployment.",
    status: "Development",
    source: "Internal Project",
    notes: "Active development. Backend testing suite refactored with Mockito/JUnit 5 at 80%+ coverage."
  },
  {
    name: "Eyob Mulugeta",
    email: "eyob.mulugeta@betterdose.dev",
    company: "BetterDose Internal",
    subject: "ERP CRM System",
    message: "Modular ERP/CRM system for customer lifecycle management, sales pipeline tracking, and inventory control. Built with Spring Boot backend and React frontend.",
    status: "Development",
    source: "Internal Project",
    notes: "Currently building core data model. Private project. Expected completion Q3 2025."
  },
  {
    name: "Nebiyu Muluadam",
    email: "nebiyu.muluadam@betterdose.dev",
    company: "BetterDose Internal",
    subject: "3D Geopolitical Map Animation & Data Visualization Engine",
    message: "CesiumJS globe engine with Three.js tactical overlays, Remotion rendering pipeline for broadcast-quality export. Covers Korean Peninsula and South China Sea sequences.",
    status: "Development",
    source: "Internal Project",
    notes: "Phase 2 complete. Remotion pipeline delivering cinematic video exports. Ongoing content additions."
  },
  {
    name: "Nebiyu Muluadam",
    email: "nebiyu.muluadam@betterdose.dev",
    company: "BetterDose Internal",
    subject: "Motion Graphics Creation System",
    message: "Programmatic Remotion-based motion graphics for broadcast video production — animated text reveals, particle systems, channel credits, cinematic sequences.",
    status: "Development",
    source: "Internal Project",
    notes: "Delivering sequences on-demand. Multiple broadcast-quality exports delivered June 2025."
  },

  // ── QA / TESTING COMPLETED ───────────────────────────────────────────────
  {
    name: "AikiTech Team",
    email: "contact@aikitech.ai",
    company: "AikiTech.ai",
    subject: "ELI LLM Routing System – QA & API Testing",
    message: "Enterprise-grade AI orchestration layer with intelligent LLM routing across OpenAI, Google Gemini, and Anthropic Claude. Concurrent multi-threaded load testing and CSV reporting.",
    status: "Completed",
    source: "Work With Us",
    notes: "Deployed May 2025. Full QA completed. Postman collection delivered. Multi-LLM failover validated."
  },
  {
    name: "Haypenny Platform",
    email: "support@haypenny.com",
    company: "Haypenny",
    subject: "Digital Currency Trading Platform – QA Testing",
    message: "Structured functional and exploratory testing of trade execution flows, wallet balance integrity, and edge cases under simulated market conditions.",
    status: "Completed",
    source: "Contact Form",
    notes: "Completed Feb 2025. Bug report with 12 issues delivered. All critical issues resolved before launch."
  },
  {
    name: "Game Studio",
    email: "beta@aliensvszombies.io",
    company: "Aliens vs Zombies Studio",
    subject: "Android Mobile Beta – Gameplay QA",
    message: "Full functional QA on Android beta build. 15+ bugs documented covering gameplay loops, UI responsiveness, and crash scenarios with full reproduction steps.",
    status: "Completed",
    source: "Beta Platform",
    notes: "Completed March 2025. JIRA board used for bug tracking. All P1 crashes fixed before public launch."
  },
  {
    name: "Multi-LLM Platform",
    email: "beta@llmchatbot.io",
    company: "LLM AI Chatbot Services",
    subject: "Single-Session Multi-LLM Chatbot Beta Evaluation",
    message: "Assessed response quality, context retention, switching latency between LLM providers, and conversational coherence in a structured single-session beta test.",
    status: "Completed",
    source: "Beta Platform",
    notes: "Completed Oct 2024. Feedback report submitted. Context retention issues flagged for GPT-4 fallback."
  },
  {
    name: "Lumi Product Team",
    email: "beta@lumi.travel",
    company: "Lumi",
    subject: "Lumi Travel Experience Platform – Beta Testing",
    message: "Evaluated onboarding flow, reward unlock mechanisms, booking UX, and push notification reliability across iOS and Android.",
    status: "Completed",
    source: "Beta Platform",
    notes: "Completed Oct 2024. Submitted detailed UX friction report. Onboarding flow restructured post-feedback."
  },
  {
    name: "ASTA Digital Team",
    email: "digital@asta.org",
    company: "American Society of Travel Advisors",
    subject: "Travel Recommendations & Trip Planning Platform – QA",
    message: "Evaluated travel recommendation accuracy, trip planning workflows, advisor search functionality, and itinerary builder usability.",
    status: "Completed",
    source: "Beta Platform",
    notes: "Completed Oct 2024. Itinerary builder pagination bug reported. Content discovery search improved."
  },
  {
    name: "Nupt.ai Team",
    email: "beta@nupt.ai",
    company: "Nupt.ai",
    subject: "AI Wedding Planning Application – Beta Testing",
    message: "Tested vendor recommendations, budget tracking, guest list management, and AI suggestion quality. Reported 8+ UX issues including onboarding friction.",
    status: "Completed",
    source: "Beta Platform",
    notes: "Completed Nov 2024. AI suggestion relevance gaps documented. Onboarding redesigned post-beta."
  },
  {
    name: "OpenAI Research",
    email: "research@openai.com",
    company: "OpenAI / Trust & Safety",
    subject: "ChatGPT Trust and User Research Study",
    message: "Structured user research examining trust patterns in AI-generated content. Scenario-based tasks covering perceived reliability, transparency, and decision-making confidence.",
    status: "Completed",
    source: "Research Program",
    notes: "Completed Nov 2024. Qualitative feedback submitted. Part of OpenAI Trust & Safety research cohort."
  },
  {
    name: "MediaCasa Team",
    email: "beta@mediacasa.app",
    company: "MediaCasa",
    subject: "Desktop App Beta – Media Management & Library QA",
    message: "Evaluated file import workflows, library navigation, search performance, and cross-format playback stability. Submitted bug report covering UI inconsistencies and performance bottlenecks.",
    status: "Completed",
    source: "Beta Platform",
    notes: "Completed Nov 2024. 7 performance bottlenecks identified. Multi-format playback crash reproduced."
  },
  {
    name: "AI Productivity Tool",
    email: "beta@productivityai.io",
    company: "AI Productivity Suite",
    subject: "AI Productivity Tool Beta – Workflow & Automation QA",
    message: "Tested task automation, smart scheduling, document summarization, and third-party tool integrations. Provided structured feedback on AI output quality.",
    status: "Completed",
    source: "Beta Platform",
    notes: "Completed Nov 2024. Scheduling conflict edge cases documented. Summary accuracy rated 7.2/10."
  },
  {
    name: "Couples App Studio",
    email: "beta@audioroleplay.io",
    company: "AI Audio Role-Play",
    subject: "AI Audio Role-Play Couples App – Beta QA",
    message: "Assessed voice synthesis quality, scenario scripting, conversation flow naturalness, and privacy handling. Focused on immersion quality and audio latency measurements.",
    status: "Completed",
    source: "Beta Platform",
    notes: "Completed Dec 2024. 340ms average audio latency documented. Privacy data handling gap reported."
  },
  {
    name: "ScreenZen Android",
    email: "beta@screenzen.app",
    company: "ScreenZen",
    subject: "Android Audio Recording Feature – QA Testing",
    message: "Tested microphone input quality, background recording stability, file export formats, and audio-video sync accuracy. 5 reproducible bugs on incoming call interruption.",
    status: "Completed",
    source: "Beta Platform",
    notes: "Completed Dec 2024. Recording interruption bug reproduced on 4 device models. Patch confirmed."
  },
  {
    name: "Valandor Team",
    email: "beta@valandor.ai",
    company: "Valandor AI",
    subject: "Valandor AI Platform – Core Feature Beta Testing",
    message: "Evaluated AI feature flows, response accuracy, UI responsiveness, and error handling edge cases. Delivered structured test report with prioritized findings.",
    status: "Completed",
    source: "Beta Platform",
    notes: "Completed Dec 2024. 14 test cases executed. 3 high-priority findings escalated."
  },
  {
    name: "Ario EdTech",
    email: "beta@arioapp.com",
    company: "Ario",
    subject: "School Email Decoder – Usability Testing & Screen Recording",
    message: "Usability video walkthrough of email parsing accuracy, notification flows, and inbox organization. Documented friction points in onboarding sequence.",
    status: "Completed",
    source: "Beta Platform",
    notes: "Completed Dec 2024. Full screen recording submitted. Onboarding flow took avg 4.7 min — flagged as too long."
  },
  {
    name: "Holafly Support",
    email: "beta@holafly.com",
    company: "Holafly",
    subject: "eSIM USA Carrier Automatic Provisioning – Testing",
    message: "Tested eSIM activation flow, automatic carrier switching, data connectivity stability, and APN configuration across multiple devices on the US network.",
    status: "Completed",
    source: "Contact Form",
    notes: "Completed Jan 2025. Carrier switch took 8 min avg — expected <3 min. APN auto-config confirmed."
  },
  {
    name: "Noping Team",
    email: "beta@noping.net",
    company: "Noping",
    subject: "Gaming Connectivity Beta – 30-Day Performance Test",
    message: "Evaluated ping reduction, server selection logic, and connection stability across multiple game titles over a 30-day trial. Post-trial survey with quantitative metrics submitted.",
    status: "Completed",
    source: "Beta Platform",
    notes: "Completed Jan 2025. Avg ping reduction of 34% measured. Stability dips noted on EU servers."
  },
  {
    name: "Pollux Platform",
    email: "beta@pollux.co.uk",
    company: "Pollux",
    subject: "UK Business Platform Beta – Networking & Compliance QA",
    message: "Tested company profile creation, business directory search, networking flows, and UK-specific regulatory field validation. Provided compliance feedback.",
    status: "Completed",
    source: "Beta Platform",
    notes: "Completed Jan 2025. VAT number field validation bug documented. Search relevance ranked 6/10."
  },
  {
    name: "InCrowd AI",
    email: "beta@incrowd.ai",
    company: "InCrowd AI",
    subject: "AI Video Clipping Platform – Detection Accuracy QA",
    message: "Tested clip detection accuracy, export quality, timeline editing, and sharing workflow. Reported scene boundary detection issues for fast-paced content.",
    status: "Completed",
    source: "Beta Platform",
    notes: "Completed Jan 2025. Fast-cut scenes (under 1.2s) missed in 40% of clips. Export quality rated excellent."
  },
  {
    name: "ScreenZen iOS",
    email: "ios-beta@screenzen.app",
    company: "ScreenZen",
    subject: "iOS Platform QA – Permission Handling & Cross-Platform Parity",
    message: "iOS-specific QA focusing on background app refresh, iOS permission handling, iCloud sync, and UI consistency. Cross-platform parity comparison against Android.",
    status: "Completed",
    source: "Beta Platform",
    notes: "Completed Jan 2025. 6 iOS-only issues found vs 5 Android. iCloud sync had 15s delay bug."
  },
  {
    name: "SHIFT Product Team",
    email: "beta@shiftapp.io",
    company: "SHIFT",
    subject: "SHIFT Android Beta – Multi-API-Level QA",
    message: "Tested app flows across Android API levels, notification delivery, background service behavior. Structured bug report with device-specific reproduction steps.",
    status: "Completed",
    source: "Beta Platform",
    notes: "Completed Feb 2025. Notification delivery failure on Android 13 (API 33) reproduced. Fixed in v1.2.1."
  },
  {
    name: "Stable Stakes",
    email: "beta@stablestakes.com",
    company: "Stable Stakes",
    subject: "Fantasy Sports Lineup Platform – Scoring & Submission QA",
    message: "Validated lineup builder logic, scoring rule accuracy, entry submission workflows, and live result updating across multiple contest formats. Edge cases in scoring calculations documented.",
    status: "Completed",
    source: "Beta Platform",
    notes: "Completed Feb 2025. Lineup save race condition found. Overtime scoring miscalculated by 0.5 pts."
  },
  {
    name: "DUBS Gaming",
    email: "beta@dubsgaming.com",
    company: "DUBS Gaming",
    subject: "Family Gaming App Beta – Parent & Teen UX Testing",
    message: "Evaluated first-time experience for parents and teens (13-17). Assessed parental controls, content filtering, account linking, and onboarding clarity for both personas.",
    status: "Completed",
    source: "Beta Platform",
    notes: "Completed Feb 2025. Parent onboarding avg 6.3 min (target 3 min). Content filter bypass reproduced."
  },

  // ── PIPELINE ACTIVE ──────────────────────────────────────────────────────
  {
    name: "E-commerce Client",
    email: "startup@fashionstore.co",
    company: "FashionStore.co",
    subject: "E-commerce Platform with Inventory Management",
    message: "Looking to build an online store with real-time inventory management, Stripe payments, and an admin dashboard. Budget confirmed. Timeline is 3 months.",
    status: "Proposal Sent",
    source: "Work With Us",
    notes: "Proposal sent June 2025. Awaiting client sign-off. Stack proposed: Next.js, Supabase, Stripe."
  },
  {
    name: "FinTech Startup",
    email: "cto@paybridge.io",
    company: "PayBridge",
    subject: "Digital Wallet & Payment Processing API",
    message: "Need a secure backend for a digital wallet service — transaction management, multi-currency support, and audit logging. Compliance with PCI-DSS required.",
    status: "Discovery",
    source: "Contact Form",
    notes: "Discovery call held June 2025. Architecture review in progress. PCI-DSS scope being assessed."
  },
  {
    name: "NGO Digital Team",
    email: "tech@africarelief.org",
    company: "Africa Relief Initiative",
    subject: "Volunteer & Donation Management Platform",
    message: "Non-profit needs a volunteer registration system, donation tracking dashboard, and impact reporting portal for field teams and donors.",
    status: "Discovery",
    source: "Contact Form",
    notes: "Initial requirements gathered. Non-profit budget — exploring reduced-rate engagement options."
  },
  {
    name: "SaaS Company",
    email: "product@cloudtask.io",
    company: "CloudTask",
    subject: "Multi-Tenant SaaS Feature Development",
    message: "Looking for a development partner to build 3 new features: team workspaces, role-based permissions, and an API key management interface.",
    status: "New",
    source: "Work With Us",
    notes: "Received June 29 2025. No response yet — to be reviewed."
  },
  {
    name: "University IT",
    email: "it@universityx.edu",
    company: "University X",
    subject: "Student Portal & Internal Service Marketplace",
    message: "University IT department wants to build a modern student portal with course enrollment, campus services booking, and a marketplace for student-to-student exchanges.",
    status: "New",
    source: "Contact Form",
    notes: "Received June 29 2025. Follows up on Uniconnect demo interest."
  },
  {
    name: "Healthcare Startup",
    email: "ceo@clinicplus.health",
    company: "ClinicPlus",
    subject: "Patient Appointment & Health Records System",
    message: "Early-stage healthtech startup needing a patient portal, doctor scheduling system, and basic EHR (Electronic Health Records) module with HIPAA-conscious design.",
    status: "New",
    source: "Work With Us",
    notes: "Received June 2025. Promising lead — healthcare sector. Need to clarify HIPAA compliance requirements."
  }
];

async function seed() {
  console.log("Clearing existing leads...");
  const del = await fetch(`${URL}/rest/v1/leads?id=neq.00000000-0000-0000-0000-000000000000`, {
    method: "DELETE", headers: h
  });
  if (!del.ok) { console.error("Delete failed:", await del.text()); process.exit(1); }
  console.log("Cleared.");

  console.log(`Inserting ${leads.length} leads...`);
  const ins = await fetch(`${URL}/rest/v1/leads`, {
    method: "POST", headers: h, body: JSON.stringify(leads)
  });
  if (!ins.ok) { console.error("Insert failed:", await ins.text()); process.exit(1); }
  console.log(`Done! Seeded ${leads.length} CRM leads (lead numbers auto-assigned from #5643).`);
}
seed();
