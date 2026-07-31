import path from "node:path";
import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { commitFile } from "@/lib/github";

const allowed = new Set([".png", ".jpg", ".jpeg", ".webp", ".ico"]);

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ ok: false, message: "Sesi tidak sah." }, { status: 401 });
  const body = (await request.json().catch(() => null)) as { filename?: string; dataUrl?: string } | null;
  if (!body?.filename || !body.dataUrl) return NextResponse.json({ ok: false, message: "Fail tidak lengkap." }, { status: 400 });
  const extension = path.extname(body.filename).toLowerCase();
  if (!allowed.has(extension)) return NextResponse.json({ ok: false, message: "Gunakan PNG, JPG, WEBP atau ICO." }, { status: 400 });
  const base64 = body.dataUrl.split(",")[1];
  if (!base64) return NextResponse.json({ ok: false, message: "Data fail tidak sah." }, { status: 400 });
  const bytes = Buffer.from(base64, "base64");
  if (bytes.byteLength > 2 * 1024 * 1024) return NextResponse.json({ ok: false, message: "Saiz fail melebihi 2 MB." }, { status: 400 });
  const safeName = `${Date.now()}-${body.filename.toLowerCase().replace(/[^a-z0-9._-]/g, "-")}`;
  try {
    const result = await commitFile(`public/uploads/${safeName}`, base64, `asset: muat naik ${safeName}`);
    if (!result.ok) return NextResponse.json({ ok: false, configurationMissing: true, message: "Integrasi GitHub belum dikonfigurasikan." }, { status: 503 });
    return NextResponse.json({ ok: true, path: `/uploads/${safeName}`, commitUrl: result.commitUrl });
  } catch (error) {
    return NextResponse.json({ ok: false, message: error instanceof Error ? error.message : "Muat naik gagal." }, { status: 500 });
  }
}
