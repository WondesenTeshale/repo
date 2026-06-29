// update-leads-dates.mjs - Run: node update-leads-dates.mjs
import { readFileSync } from "fs";
const env = Object.fromEntries(readFileSync(".env.local","utf8").split("\n").filter(l=>l.includes("=")).map(l=>{const [k,...v]=l.split("=");return[k.trim(),v.join("=").trim()]}));
const URL = env["NEXT_PUBLIC_SUPABASE_URL"];
const KEY = env["SUPABASE_SERVICE_ROLE_KEY"];
if (!URL || !KEY) { console.error("Missing env vars"); process.exit(1); }
const h = { "apikey": KEY, "Authorization": `Bearer ${KEY}`, "Content-Type": "application/json", "Prefer": "return=minimal" };

const monthMap = { 'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5, 'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11 };

function parseDate(notes) {
  const match = notes.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sept?|Oct|Nov|Dec)[a-z]* (\d{4})/i);
  if (match) {
    const mStr = match[1].toLowerCase();
    const month = monthMap[mStr.substring(0, 3)];
    const year = parseInt(match[2], 10);
    // Random day in that month
    const day = Math.floor(Math.random() * 28) + 1;
    return new Date(Date.UTC(year, month, day, 12, 0, 0)).toISOString();
  }
  
  // Random date in the past month
  const today = new Date();
  const pastMonth = new Date(today.getTime() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000));
  return pastMonth.toISOString();
}

async function update() {
  console.log("Fetching leads...");
  const res = await fetch(`${URL}/rest/v1/leads?select=id,notes`, { headers: h });
  if (!res.ok) { console.error("Failed to fetch leads"); process.exit(1); }
  const leads = await res.json();
  
  console.log(`Updating ${leads.length} leads with specific dates...`);
  
  for (const lead of leads) {
    const newDate = parseDate(lead.notes || "");
    const patchRes = await fetch(`${URL}/rest/v1/leads?id=eq.${lead.id}`, {
      method: "PATCH",
      headers: h,
      body: JSON.stringify({ created_at: newDate, updated_at: newDate })
    });
    
    if (!patchRes.ok) {
      console.error(`Failed to update ${lead.id}`);
    } else {
      console.log(`Updated ${lead.id} to ${newDate}`);
    }
  }
  
  console.log("All done!");
}

update();
