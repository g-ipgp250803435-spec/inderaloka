import crypto from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "inderaloka_admin";
const SESSION_SECONDS = 60 * 60 * 8;

function secret() {
  return process.env.ADMIN_SESSION_SECRET ?? (process.env.NODE_ENV === "development" ? "development-only-change-me" : "");
}

function sign(value: string) {
  return crypto.createHmac("sha256", secret()).update(value).digest("hex");
}

export function passwordsMatch(input: string) {
  const expected = process.env.ADMIN_PASSWORD ?? (process.env.NODE_ENV === "development" ? "admin" : "");
  if (!expected || !secret()) return false;
  const left = Buffer.from(input);
  const right = Buffer.from(expected);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

export function createSessionValue() {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = String(expiresAt);
  return `${payload}.${sign(payload)}`;
}

export function verifySessionValue(value?: string) {
  if (!value) return false;
  const [expiresAt, signature] = value.split(".");
  if (!expiresAt || !signature) return false;
  const expected = sign(expiresAt);
  if (signature.length !== expected.length) return false;
  const validSignature = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  return validSignature && Number(expiresAt) > Math.floor(Date.now() / 1000);
}

export async function isAuthenticated() {
  const store = await cookies();
  return verifySessionValue(store.get(COOKIE_NAME)?.value);
}

export const sessionCookie = {
  name: COOKIE_NAME,
  maxAge: SESSION_SECONDS
};
