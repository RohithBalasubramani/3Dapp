import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req) {
  const form = await req.formData();
  const catDir = form.get("category") === "other" ? "OtherAssets" : "";
  const file = form.get("file"); // Blob
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const dir = path.join(process.cwd(), "public", "models", catDir);
  fs.mkdirSync(dir, { recursive: true });

  const buf = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(dir, file.name), buf);

  return NextResponse.json({ ok: true });
}
