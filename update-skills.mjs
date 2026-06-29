import { readFileSync } from "fs";
const env = Object.fromEntries(readFileSync(".env.local","utf8").split("\n").filter(l=>l.includes("=")).map(l=>{const [k,...v]=l.split("=");return[k.trim(),v.join("=").trim()]}));
const URL = env["NEXT_PUBLIC_SUPABASE_URL"];
const KEY = env["SUPABASE_SERVICE_ROLE_KEY"];
const h = { "apikey": KEY, "Authorization": `Bearer ${KEY}`, "Content-Type": "application/json", "Prefer": "return=minimal" };

const members = [
  {
    id: "e37dc87c-c7ea-42e8-8d29-af26b5ff10d9",
    role: "Founder & Lead Engineer",
    bio: "Founder, software engineer, and systems architect based in Addis Ababa, Ethiopia. Leads full-stack development, AI integrations, enterprise API design, and QA testing engagements across BetterDose projects. Extensive hands-on experience across backend systems, 3D data visualization, AI orchestration, and real-world product testing.",
    skills: ["Java","Spring Boot","JWT","JUnit 5","Mockito","Flyway","Bucket4j","BCrypt","JaCoCo","JavaScript","TypeScript","React","Next.js","HTML5","CSS3","PHP","Laravel","Livewire","Blade","MySQL","cPanel","Apache","PHPMailer","AJAX","jQuery","Bootstrap","Cloudflare","Python","FastAPI","Requests","OpenAI API","Google Gemini API","Anthropic Claude API","Multi-LLM Routing","Multithreading","Postman","CesiumJS","Three.js","WebGL","Remotion","FFmpeg","PostgreSQL","Supabase","REST APIs","Docker","Git","Linux Hosting","Manual QA","Usability Testing","Functional Testing","Exploratory Testing","Beta Testing","Android QA","iOS QA","Network QA","AI Evaluation","User Research","Bug Reporting"]
  },
  {
    id: "d11dfa14-bb74-4fed-a095-8a8a88998a6b",
    role: "Senior Developer",
    bio: "Full-stack developer specializing in frontend architecture, UI engineering, and Laravel-based backend development. Key contributor to Uniconnect (React/Vite), Goojarato streaming platform, the Enterprise RESTful API, and Laravel hosting management.",
    skills: ["React","TypeScript","JavaScript","Vite","Tailwind CSS","HTML5","CSS3","Bootstrap","AJAX","jQuery","PHP","Laravel","Livewire","Blade","MySQL","cPanel","Cloudflare","Apache","PHPMailer","REST APIs","HLS Streaming","Java","Spring Boot","JUnit 5","Mockito","Maven","JWT","BCrypt","UI/UX Engineering","Git"]
  },
  {
    id: "f08db0a6-32b6-441e-981a-d5a934288ee2",
    role: "Senior Developer",
    bio: "Backend developer and data engineer with deep expertise in Python-based systems, machine learning pipelines, and automation. Contributed to the ERP CRM system, Goojarato streaming platform, Motion Graphics engine, and ML classification models.",
    skills: ["Python","Django","FastAPI","Scikit-learn","Pandas","NumPy","Machine Learning","PHP","Laravel","Livewire","MySQL","Blade","AJAX","jQuery","Bootstrap","React","TypeScript","Next.js","Remotion","FFmpeg","Tailwind CSS","PostgreSQL","MongoDB","Prisma","Supabase","Docker","Linux Bash","Automation","Git","REST APIs"]
  }
];

for (const m of members) {
  const r = await fetch(`${URL}/rest/v1/team_members?id=eq.${m.id}`, {
    method: "PATCH", headers: h,
    body: JSON.stringify({ role: m.role, bio: m.bio, skills: m.skills })
  });
  console.log(m.id.slice(0,8), r.ok ? `OK (${m.skills.length} skills)` : await r.text());
}
