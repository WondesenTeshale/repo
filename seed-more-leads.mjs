// seed-more-leads.mjs
import { readFileSync } from "fs";
const env = Object.fromEntries(readFileSync(".env.local","utf8").split("\n").filter(l=>l.includes("=")).map(l=>{const [k,...v]=l.split("=");return[k.trim(),v.join("=").trim()]}));
const URL = env["NEXT_PUBLIC_SUPABASE_URL"];
const KEY = env["SUPABASE_SERVICE_ROLE_KEY"];
if (!URL || !KEY) { console.error("Missing env vars"); process.exit(1); }
const h = { "apikey": KEY, "Authorization": `Bearer ${KEY}`, "Content-Type": "application/json", "Prefer": "return=minimal" };

const getRandomDate = (daysAgoStart, daysAgoEnd) => {
  const start = new Date().getTime() - daysAgoStart * 24 * 60 * 60 * 1000;
  const end = new Date().getTime() - daysAgoEnd * 24 * 60 * 60 * 1000;
  return new Date(start + Math.random() * (end - start)).toISOString();
};

const newLeads = [
  // --- 12 NEW LEADS ---
  { name: "Sarah Jenkins", email: "sarah.j@innovatestart.io", company: "InnovateStart", subject: "MVP Development for SaaS", message: "We need a rapid MVP built for our new B2B SaaS platform focusing on HR management.", status: "New", source: "Work With Us", created_at: getRandomDate(3, 1), notes: "" },
  { name: "Michael Chen", email: "m.chen@logisticsplus.com", company: "Logistics Plus", subject: "Custom Dashboard", message: "Looking for a custom dashboard to track our fleet in real-time. Do you work with WebGL/Maps?", status: "New", source: "Contact Form", created_at: getRandomDate(4, 1), notes: "" },
  { name: "Emily Rodriguez", email: "erodriguez@healthsync.care", company: "HealthSync", subject: "HIPAA Compliant Patient Portal", message: "We are evaluating agencies to build our new patient portal. Needs to be HIPAA compliant.", status: "New", source: "Work With Us", created_at: getRandomDate(5, 2), notes: "" },
  { name: "David Kim", email: "dkim@fintechforward.co", company: "FinTech Forward", subject: "API Integration Project", message: "We have an existing backend and need help integrating Stripe and Plaid APIs.", status: "New", source: "Contact Form", created_at: getRandomDate(6, 2), notes: "" },
  { name: "Jessica Alba", email: "jessica@retailtech.net", company: "RetailTech", subject: "E-commerce Optimization", message: "Our current Next.js storefront is slow. We need an audit and optimization.", status: "New", source: "Work With Us", created_at: getRandomDate(7, 3), notes: "" },
  { name: "Robert Taylor", email: "robert.t@edutechsolutions.org", company: "EduTech Solutions", subject: "LMS Customization", message: "Can you help us build custom plugins for our Moodle LMS?", status: "New", source: "Contact Form", created_at: getRandomDate(8, 3), notes: "" },
  { name: "Amanda White", email: "awhite@greenenergy.com", company: "Green Energy Corp", subject: "Data Visualization Engine", message: "We loved your 3D Geo Map. Can we build something similar for our wind farm data?", status: "New", source: "Work With Us", created_at: getRandomDate(9, 4), notes: "" },
  { name: "Chris Evans", email: "cevans@sportsanalytics.io", company: "Sports Analytics", subject: "Real-time Stats Dashboard", message: "Need a high-performance React dashboard for real-time sports betting analytics.", status: "New", source: "Contact Form", created_at: getRandomDate(10, 4), notes: "" },
  { name: "Laura Martinez", email: "lmartinez@nonprofitalliance.org", company: "Nonprofit Alliance", subject: "Donation Platform", message: "We need a simple, reliable donation platform built with Next.js and Stripe.", status: "New", source: "Work With Us", created_at: getRandomDate(11, 5), notes: "" },
  { name: "James Wilson", email: "jwilson@proptech.co.uk", company: "PropTech UK", subject: "Property Management App", message: "Looking for full-stack developers to build our MVP for a property management app.", status: "New", source: "Contact Form", created_at: getRandomDate(12, 5), notes: "" },
  { name: "Olivia Brown", email: "obrown@beautybrand.com", company: "Beauty Brand", subject: "Shopify Headless Migration", message: "We want to move from standard Shopify to a headless setup with Next.js.", status: "New", source: "Work With Us", created_at: getRandomDate(13, 6), notes: "" },
  { name: "William Davis", email: "wdavis@cybersec.io", company: "CyberSec Analytics", subject: "Threat Intelligence Dashboard", message: "Need a secure dashboard to visualize threat intelligence data. Fast turnaround needed.", status: "New", source: "Contact Form", created_at: getRandomDate(14, 6), notes: "" },

  // --- 8 DISCOVERY CALLS ---
  { name: "Daniel Garcia", email: "daniel@ai-innovate.ai", company: "AI Innovate", subject: "LLM Orchestration Layer", message: "We need an orchestration layer similar to the ELI LLM project you did.", status: "Discovery", source: "Work With Us", created_at: getRandomDate(15, 10), notes: "Discovery call scheduled for next Tuesday. They need Claude and OpenAI integration." },
  { name: "Sophia Lee", email: "slee@medtechstartup.com", company: "MedTech Startup", subject: "Telehealth Video App", message: "Building a WebRTC telehealth app. Need frontend expertise.", status: "Discovery", source: "Contact Form", created_at: getRandomDate(16, 11), notes: "Had initial chat. Need to sign NDA before proceeding." },
  { name: "Matthew Clark", email: "mclark@finserve.co", company: "FinServe", subject: "Legacy System Modernization", message: "We need to migrate our PHP backend to a modern Spring Boot API.", status: "Discovery", source: "Work With Us", created_at: getRandomDate(17, 12), notes: "Discovery call went well. They are sending over API docs for review." },
  { name: "Emma Lewis", email: "emma@travelplanner.app", company: "TravelPlanner", subject: "AI Trip Generator", message: "Want to build an AI trip planner that generates custom itineraries.", status: "Discovery", source: "Contact Form", created_at: getRandomDate(18, 13), notes: "Awaiting technical requirements document." },
  { name: "Andrew Walker", email: "awalker@manufacturing.inc", company: "Walker Manufacturing", subject: "IoT Dashboard", message: "We have IoT sensors on our machines and need a dashboard to track downtime.", status: "Discovery", source: "Work With Us", created_at: getRandomDate(19, 14), notes: "Need to confirm which IoT protocols they are using (MQTT?)." },
  { name: "Isabella Hall", email: "ihall@eventmanagement.co", company: "Event Management Co", subject: "Ticketing Platform MVP", message: "Need an MVP for a high-volume ticketing platform.", status: "Discovery", source: "Contact Form", created_at: getRandomDate(20, 15), notes: "Discussing load testing requirements." },
  { name: "Joshua Young", email: "jyoung@blockchaintech.io", company: "Blockchain Tech", subject: "Crypto Wallet Frontend", message: "We have the smart contracts, need a slick React frontend.", status: "Discovery", source: "Work With Us", created_at: getRandomDate(21, 16), notes: "They have a tight budget. Need to see if we can do a phased approach." },
  { name: "Ava King", email: "aking@hrsolutions.net", company: "HR Solutions", subject: "Employee Onboarding Portal", message: "Need a secure portal for new hires to upload documents.", status: "Discovery", source: "Contact Form", created_at: getRandomDate(22, 17), notes: "Compliance requirements are strict. Needs further scoping." },

  // --- 5 PROPOSAL SENT ---
  { name: "Thomas Wright", email: "twright@logistics.co.uk", company: "Wright Logistics", subject: "Route Optimization API", message: "Need a custom API to optimize delivery routes based on traffic data.", status: "Proposal Sent", source: "Work With Us", created_at: getRandomDate(25, 20), notes: "Proposal sent $25k. Awaiting feedback from their CTO." },
  { name: "Mia Scott", email: "mscott@fashionstore.co", company: "FashionStore.co", subject: "E-commerce Platform with Inventory Management", message: "Looking to build an online store with real-time inventory management.", status: "Proposal Sent", source: "Work With Us", created_at: getRandomDate(26, 21), notes: "Proposal sent last week. They asked for a slight revision on the payment timeline." },
  { name: "Alexander Green", email: "agreen@agritech.com", company: "AgriTech", subject: "Farm Management Software", message: "Building a SaaS for farm management. Need full stack team.", status: "Proposal Sent", source: "Contact Form", created_at: getRandomDate(27, 22), notes: "Proposal sent. Follow up scheduled for Friday." },
  { name: "Charlotte Adams", email: "cadams@fitnessapp.io", company: "FitnessApp", subject: "Workout Tracking App", message: "Need a React Native app for workout tracking.", status: "Proposal Sent", source: "Work With Us", created_at: getRandomDate(28, 23), notes: "They are comparing our proposal with one other agency." },
  { name: "Ethan Baker", email: "ebaker@restaurantgroup.com", company: "Baker Restaurant Group", subject: "Unified Ordering System", message: "Need a system to unify orders from UberEats, Deliveroo, etc.", status: "Proposal Sent", source: "Contact Form", created_at: getRandomDate(29, 24), notes: "Proposal sent. They seem very keen to start next month." },

  // --- 3 DEVELOPMENT ---
  { name: "Addis Ababa University", email: "admin@aau.edu.et", company: "Addis Ababa University", subject: "Uniserve - Uniconnect Student Service Marketplace", message: "Student-to-student service marketplace built with Spring Boot.", status: "Development", source: "Internal Project", created_at: getRandomDate(40, 35), notes: "Sprint 3 in progress. Backend API mostly complete." },
  { name: "BetterDose Internal", email: "eyob.mulugeta@betterdose.dev", company: "BetterDose", subject: "ERP CRM System", message: "Modular ERP/CRM system for customer lifecycle management.", status: "Development", source: "Internal Project", created_at: getRandomDate(45, 40), notes: "Building core data models in Django." },
  { name: "BetterDose Internal", email: "nebiyu.muluadam@betterdose.dev", company: "BetterDose", subject: "3D Geopolitical Map Animation", message: "CesiumJS globe engine with Three.js tactical overlays.", status: "Development", source: "Internal Project", created_at: getRandomDate(50, 45), notes: "Integrating Remotion pipeline." },

  // --- 2 TESTING ---
  { name: "BetterDose Internal", email: "nebiyu.muluadam@betterdose.dev", company: "BetterDose", subject: "Motion Graphics Creation System", message: "Programmatic Remotion-based motion graphics.", status: "Testing", source: "Internal Project", created_at: getRandomDate(60, 50), notes: "In final QA. Checking render times and FFmpeg optimization." },
  { name: "FinTech Client", email: "cto@paybridge.io", company: "PayBridge", subject: "Digital Wallet & Payment Processing API", message: "Need a secure backend for a digital wallet service.", status: "Testing", source: "Work With Us", created_at: getRandomDate(65, 55), notes: "UAT phase. Client is running penetration tests." }
];

async function update() {
  console.log("Removing existing non-Completed leads...");
  const del = await fetch(`${URL}/rest/v1/leads?status=neq.Completed`, { method: "DELETE", headers: h });
  if (!del.ok) { console.error("Delete failed:", await del.text()); process.exit(1); }
  
  console.log(`Inserting ${newLeads.length} new leads...`);
  for (const lead of newLeads) {
    lead.updated_at = lead.created_at;
  }
  
  const ins = await fetch(`${URL}/rest/v1/leads`, { method: "POST", headers: h, body: JSON.stringify(newLeads) });
  if (!ins.ok) { console.error("Insert failed:", await ins.text()); process.exit(1); }
  
  console.log("All done!");
}

update();
