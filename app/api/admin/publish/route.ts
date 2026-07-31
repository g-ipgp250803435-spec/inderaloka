import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { commitFile } from "@/lib/github";
import type { SiteContent } from "@/lib/types";

function isContent(value: unknown): value is SiteContent {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<SiteContent>;
  return Boolean(candidate.site?.name && Array.isArray(candidate.services) && Array.isArray(candidate.news) && Array.isArray(candidate.pages));
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ ok: false, message: "Sesi tidak sah." }, { status: 401 });
  const body = (await request.json().catch(() => null)) as { content?: unknown } | null;
  if (!body || !isContent(body.content)) return NextResponse.json({ ok: false, message: "Format kandungan tidak sah." }, { status: 400 });
  try {
    const encoded = Buffer.from(`${JSON.stringify(body.content, null, 2)}\n`, "utf8").toString("base64");
    const result = await commitFile("data/site-content.json", encoded, "content: kemas kini Portal Rasmi Inderaloka");
    if (!result.ok) return NextResponse.json({ ok: false, configurationMissing: true, message: "Integrasi GitHub belum dikonfigurasikan. Eksport JSON dan commit secara manual." }, { status: 503 });
    return NextResponse.json({ ok: true, commitUrl: result.commitUrl, message: "Perubahan telah dihantar ke GitHub. Vercel akan menjalankan deployment baharu." });
  } catch (error) {
    return NextResponse.json({ ok: false, message: error instanceof Error ? error.message : "Penerbitan gagal." }, { status: 500 });
  }
}
