import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const cat = searchParams.get("category") === "other" ? "OtherAssets" : "";
  const dir = path.join(process.cwd(), "public", "models", cat);

  let list = [];
  try {
    list = fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith(".3mf"));
  } catch {
    /* directory missing = empty list */
  }

  return NextResponse.json(list);
}
