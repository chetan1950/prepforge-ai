import { NextResponse } from "next/server";
import { z } from "zod";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
const schema=z.object({questionId:z.string().min(1),selected:z.string().max(200),timeTaken:z.number().int().min(0).max(3600)});
export async function POST(req:Request){const user=await getUser();if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});const parsed=schema.safeParse(await req.json());if(!parsed.success)return NextResponse.json({error:"Invalid answer submission."},{status:400});const question=await db.question.findUnique({where:{id:parsed.data.questionId}});if(!question)return NextResponse.json({error:"Question not found."},{status:404});const correct=parsed.data.selected===question.answer;await db.questionAttempt.create({data:{...parsed.data,userId:user.id,correct}});return NextResponse.json({correct,answer:question.answer,explanation:question.explanation});}
