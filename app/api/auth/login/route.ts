import { NextResponse } from "next/server";
import { createSessionValue, passwordsMatch, sessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { password?: string };
  if (!body.password || !passwordsMatch(body.password)) {
    return NextResponse.json({ ok: false, message: "Kata laluan tidak sah." }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(sessionCookie.name, createSessionValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: sessionCookie.maxAge
  });
  return response;
}
