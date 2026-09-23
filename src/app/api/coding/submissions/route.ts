import { NextResponse } from "next/server";
import { z } from "zod";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
const schema=z.object({problemId:z.string(),language:z.enum(["Java","Python","C++","JavaScript"]),code:z.string().min(1).max(50000)});
export async function GET(){const user=await getUser();if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});const submissions=await db.codingSubmission.findMany({where:{userId:user.id},include:{problem:{select:{title:true}}},orderBy:{createdAt:"desc"},take:50});return NextResponse.json({submissions});}
export async function POST(req:Request){const user=await getUser();if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});const parsed=schema.safeParse(await req.json());if(!parsed.success)return NextResponse.json({error:"Choose a problem, language, and code."},{status:400});const problem=await db.codingProblem.findUnique({where:{id:parsed.data.problemId}});if(!problem)return NextResponse.json({error:"Problem not found."},{status:404});const submission=await db.codingSubmission.create({data:{...parsed.data,userId:user.id,status:"Not executed"}});return NextResponse.json({submission,note:"Code was saved. Execution is disabled until a sandboxed judge service is configured."},{status:201});}
