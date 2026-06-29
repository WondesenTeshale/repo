// update-team-skills.mjs - Run: node update-team-skills.mjs
import { readFileSync } from "fs";
const env = Object.fromEntries(readFileSync(".env.local","utf8").split("\n").filter(l=>l.includes("=")).map(l=>{const [k,...v]=l.split("=");return[k.trim(),v.join("=").trim()]}));
const SUPABASE_URL = env["NEXT_PUBLIC_SUPABASE_URL"];
const SERVICE_KEY = env["SUPABASE_SERVICE_ROLE_KEY"];
if (!SUPABASE_URL || !SERVICE_KEY) { console.error("Missing env vars"); process.exit(1); }

const updates = [
  {
    id: "e37dc87c-c7ea-42e8-8d29-af26b5ff10d9",
    name: "Nebiyu Muluadam",
    role: "Founder & Lead Engineer",
    bio: "Software engineering student and systems architect based in Addis Ababa, Ethiopia. Leads full-stack development, AI integrations, QA testing engagements, and digital service deliveries across BetterDose projects. Extensive experience in backend architecture, data visualization, and enterprise API design.",
    skills: [
      "Java", "Spring Boot", "JWT", "JUnit 5", "Mockito",
      "JavaScript", "TypeScript", "React", "Next.js",
      "PHP", "Laravel", "MySQL", "PostgreSQL",
      "Python", "FastAPI", "OpenAI API", "Multi-LLM Routing",
      "CesiumJS", "Three.js", "WebGL", "Remotion",
      "Docker", "REST APIs", "Supabase", "Prisma",
      "Manual QA", "Usability Testing", "Beta Testing",
      "System Design", "cPanel", "Git"
    ]
  },
  {
    id: "d11dfa14-bb74-4fed-a095-8a8a88998a6b",
    name: "Abel Tadesse",
    role: "Senior Developer",
    bio: "Full-stack developer with a strong focus on frontend architecture, UI engineering, and cross-platform application development. Contributed to Uniconnect, the Enterprise RESTful API, Goojarato, and the Laravel maintenance project.",
    skills: [
      "React", "TypeScript", "JavaScript", "Vite",
      "Tailwind CSS", "HTML5", "CSS3", "Bootstrap",
      "PHP", "Laravel", "MySQL",
      "Java", "Spring Boot", "JUnit 5", "Maven",
      "Python", "Scikit-learn", "Pandas", "NumPy",
      "REST APIs", "Axios", "jQuery", "AJAX",
      "UI/UX Engineering", "Git"
    ]
  },
  {
    id: "f08db0a6-32b6-441e-981a-d5a934288ee2",
    name: "Eyob Mulugeta",
    role: "Senior Developer",
    bio: "Backend developer and system administrator specializing in script automation, API development, and data engineering pipelines. Contributed to the ERP CRM system, Goojarato streaming platform, Database Management Panel, Motion Graphics system, and the ML classification models.",
    skills: [
      "Python", "Django", "FastAPI",
      "React", "TypeScript", "Remotion",
      "PHP", "Laravel", "MySQL",
      "PostgreSQL", "MongoDB",
      "Scikit-learn", "Pandas", "NumPy", "Machine Learning",
      "Docker", "Linux Bash", "Automation",
      "Next.js", "Prisma", "Tailwind CSS",
      "REST APIs", "Git"
    ]
  }
];

async function update() {
  for (const member of updates) {
    console.log(`Updating ${member.name}...`);
    const res = await fetch(`${SUPABASE_URL}/rest/v1/team_members?id=eq.${member.id}`, {
      method: "PATCH",
      headers: {
        "apikey": SERVICE_KEY,
        "Authorization": `Bearer ${SERVICE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify({
        role: member.role,
        bio: member.bio,
        skills: member.skills
      })
    });
    if (!res.ok) { console.error(`Failed for ${member.name}:`, await res.text()); } 
    else { console.log(`  Done! (${member.skills.length} skills)`); }
  }
  console.log("All team members updated!");
}
update();
