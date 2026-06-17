import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { HASHED_USER, HASHED_PASS } from "@/lib/db";

// Locked identity constants — not editable via the admin panel
export const LOCKED_IDENTITY = {
  businessName: "BetterDose",
  ownerName: "Nebiyu Muluadam",
  ukRegistryNumber: "12345678",
  address: "Addis Ababa, Ethiopia",
};

function checkAuth(req: NextRequest): boolean {
  const token = req.headers.get("x-admin-token");
  if (!token) return false;
  const [u, p] = token.split(":");
  return u === HASHED_USER && p === HASHED_PASS;
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("business_config")
    .select("*")
    .eq("id", 1)
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ...data, ...LOCKED_IDENTITY });
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  // Strip any attempt to modify locked fields
  const { email, phone, linkedin_nebiyu, github_nebiyu, linkedin_eyob, github_eyob } = body;
  const { error } = await supabaseAdmin.from("business_config").upsert({
    id: 1,
    email,
    phone,
    linkedin_nebiyu,
    github_nebiyu,
    linkedin_eyob,
    github_eyob,
    updated_at: new Date().toISOString(),
  }, { onConflict: "id" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
