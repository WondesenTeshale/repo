import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { v4 as uuidv4 } from "uuid";

// Maximum file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "text/plain",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: `File ${file.name} exceeds the 10MB size limit.` }, { status: 400 });
      }

      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return NextResponse.json({ error: `File type ${file.type} is not allowed.` }, { status: 400 });
      }

      const ext = file.name.split(".").pop();
      const path = `inquiries/${uuidv4()}.${ext}`;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { error } = await supabaseAdmin.storage.from("documents").upload(path, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

      if (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: `Failed to upload ${file.name}` }, { status: 500 });
      }

      const { data } = supabaseAdmin.storage.from("documents").getPublicUrl(path);
      uploadedUrls.push(data.publicUrl);
    }

    return NextResponse.json({ urls: uploadedUrls });
  } catch (err: unknown) {
    console.error("Public upload error:", err);
    return NextResponse.json({ error: "Server error during file upload" }, { status: 500 });
  }
}
