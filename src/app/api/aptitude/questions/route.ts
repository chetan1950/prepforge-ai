import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
export async function GET(req:Request){if(!await getUser())return NextResponse.json({error:"Unauthorized"},{status:401});const url=new URL(req.url);const category=url.searchParams.get("category");const difficulty=url.searchParams.get("difficulty");const take=Math.min(50,Math.max(1,Number(url.searchParams.get("take")||20)));const questions=await db.question.findMany({where:{...(category&&category!=="All"?{category}:{}),...(difficulty&&difficulty!=="All"?{difficulty}:{})},select:{id:true,prompt:true,category:true,difficulty:true,options:true,timeLimit:true},take});return NextResponse.json({questions:questions.map(q=>({...q,options:JSON.parse(q.options)}))});}
