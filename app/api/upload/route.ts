import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { HASHED_USER, HASHED_PASS } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

type Bucket = "portfolio-images" | "documents" | "team-photos";

function checkAuth(req: NextRequest): boolean {
  const token = req.headers.get("x-admin-token");
  if (!token) return false;
  const [u, p] = token.split(":");
  return u === HASHED_USER && p === HASHED_PASS;
}

// GET /api/upload?bucket=portfolio-images — list files
export async function GET(req: NextRequest) {
  const bucket = req.nextUrl.searchParams.get("bucket") as Bucket;
  if (!bucket) return NextResponse.json({ error: "Missing bucket" }, { status: 400 });
  const { data, error } = await supabaseAdmin.storage.from(bucket).list("", { limit: 200 });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const files = (data ?? []).map((f) => ({
    name: f.name,
    url: supabaseAdmin.storage.from(bucket).getPublicUrl(f.name).data.publicUrl,
    bucket,
  }));
  return NextResponse.json(files);
}

// POST /api/upload — upload a file
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const bucket = formData.get("bucket") as Bucket;
  if (!file || !bucket) return NextResponse.json({ error: "Missing file or bucket" }, { status: 400 });
  const ext = file.name.split(".").pop();
  const path = `${uuidv4()}.${ext}`;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const { error } = await supabaseAdmin.storage.from(bucket).upload(path, buffer, {
    contentType: file.type,
    cacheControl: "3600",
    upsert: false,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl, path, name: file.name });
}

// DELETE /api/upload — delete a file
export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { bucket, path } = await req.json();
  const { error } = await supabaseAdmin.storage.from(bucket).remove([path]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
