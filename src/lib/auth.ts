import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
const COOKIE = "prepforge_session";
function secret() { const value = process.env.AUTH_SECRET; if (!value || value.length < 32) throw new Error("AUTH_SECRET must contain at least 32 characters."); return new TextEncoder().encode(value); }
export async function createSession(userId: string) { const token = await new SignJWT({ sub: userId }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(secret()); (await cookies()).set(COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 604800 }); }
export async function clearSession() { (await cookies()).delete(COOKIE); }
export async function getUser() { const token = (await cookies()).get(COOKIE)?.value; if (!token) return null; try { const { payload } = await jwtVerify(token, secret()); if (typeof payload.sub !== "string") return null; return await db.user.findUnique({ where: { id: payload.sub }, select: { id: true, name: true, email: true, role: true, targetRole: true, preferredLanguage: true } }); } catch { return null; } }
