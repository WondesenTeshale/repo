import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { HASHED_USER, HASHED_PASS } from "@/lib/db";
import { sendContactNotification } from "@/lib/email";

function checkAuth(req: NextRequest): boolean {
  const token = req.headers.get("x-admin-token");
  if (!token) return false;
  const [u, p] = token.split(":");
  return u === HASHED_USER && p === HASHED_PASS;
}

// GET: Fetch all contact messages (Admin only)
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST: Submit a new contact message (Public)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields (name, email, message)" }, { status: 400 });
    }

    // Insert into database
    const { data, error } = await supabaseAdmin
      .from("contact_messages")
      .insert({
        name,
        email,
        subject: subject || "",
        message,
        status: "unread"
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Send email notification (does not block database success response)
    // Run asynchronously and log results
    sendContactNotification({ name, email, subject, message }).catch(err => {
      console.error("Failed to send contact form notification email:", err);
    });

    return NextResponse.json(data);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// PATCH: Update message status (Admin only)
export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Missing required fields (id, status)" }, { status: 400 });
    }

    if (!["unread", "read", "archived"].includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("contact_messages")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// DELETE: Remove a contact message (Admin only)
export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const { error } = await supabaseAdmin
      .from("contact_messages")
      .delete()
      .eq("id", id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
