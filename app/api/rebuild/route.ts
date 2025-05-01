import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function POST(req: Request): Promise<Response> {
  try {
    const { secret } = await req.json();

    if (secret !== process.env.REBUILD_SECRET) {
      console.error("❌ Unauthorized access attempt.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ STEP 1: Confirm API is working
    console.log("✅ API route reached. Secret is valid.");

    // ✅ STEP 2: Check if outDir exists
    const outDir = path.join(process.cwd(), "site-export", "out");
    console.log("🔍 Checking directory:", outDir);

    if (!fs.existsSync(outDir)) {
      console.error("❌ site-export/out folder is missing.");
      return NextResponse.json({ error: "Static export folder not found at 'site-export/out'" }, { status: 500 });
    }

    const files = fs.readdirSync(outDir);
    console.log("📦 Exported files:", files);

    return NextResponse.json({
      success: true,
      message: `API reached, folder found with ${files.length} items.`,
    });
  } catch (err: any) {
    console.error("❌ Unexpected error in /api/rebuild:", err);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
