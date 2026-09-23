import { NextResponse } from "next/server";
import { z } from "zod";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";

const schema = z.object({
  kind: z.enum(["technical", "hr"]),
  topic: z.string().trim().min(1).max(80),
  prompt: z.string().trim().min(5).max(1200),
  answer: z.string().trim().min(10).max(10000),
  selfRating: z.number().int().min(1).max(5),
});

export async function GET(req: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const kind = new URL(req.url).searchParams.get("kind");
  const practices = await db.interviewPractice.findMany({
    where: { userId: user.id, ...(kind === "technical" || kind === "hr" ? { kind } : {}) },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: { id: true, kind: true, topic: true, prompt: true, answer: true, selfRating: true, createdAt: true },
  });
  return NextResponse.json({ practices });
}

export async function POST(req: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Add an answer of at least 10 characters and select a self-rating." }, { status: 400 });
  const practice = await db.interviewPractice.create({ data: { ...parsed.data, userId: user.id } });
  return NextResponse.json({ practice }, { status: 201 });
}
