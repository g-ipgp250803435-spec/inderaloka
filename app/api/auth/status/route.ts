import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getGitHubConfig } from "@/lib/github";

export async function GET() {
  return NextResponse.json({ authenticated: await isAuthenticated(), githubConfigured: Boolean(getGitHubConfig()) });
}
