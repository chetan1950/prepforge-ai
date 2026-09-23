import { NextResponse } from "next/server";
import { z } from "zod";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";

const updateSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  college: z.string().trim().max(120).nullable().optional(),
  degree: z.string().trim().max(80).nullable().optional(),
  branch: z.string().trim().max(100).nullable().optional(),
  graduationYear: z.number().int().min(2020).max(2040).nullable().optional(),
  targetRole: z.string().trim().min(2).max(100).optional(),
  experienceLevel: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
  preferredLanguage: z.enum(["Java", "Python", "C++", "JavaScript"]).optional(),
});

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const profile = await db.user.findUnique({
    where: { id: user.id },
    select: { name: true, email: true, college: true, degree: true, branch: true, graduationYear: true, targetRole: true, experienceLevel: true, preferredLanguage: true, createdAt: true },
  });
  return NextResponse.json({ profile });
}

export async function PATCH(req: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = updateSchema.safeParse(await req.json());
  if (!parsed.success || !Object.keys(parsed.data ?? {}).length) {
    return NextResponse.json({ error: "Check your profile details and try again." }, { status: 400 });
  }
  const profile = await db.user.update({
    where: { id: user.id },
    data: parsed.data,
    select: { name: true, email: true, college: true, degree: true, branch: true, graduationYear: true, targetRole: true, experienceLevel: true, preferredLanguage: true, createdAt: true },
  });
  return NextResponse.json({ profile });
}
