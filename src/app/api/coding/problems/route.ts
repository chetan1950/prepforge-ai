import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
export async function GET(req:Request){if(!await getUser())return NextResponse.json({error:"Unauthorized"},{status:401});const url=new URL(req.url),category=url.searchParams.get("category"),difficulty=url.searchParams.get("difficulty");const problems=await db.codingProblem.findMany({where:{...(category&&category!=="All"?{category}:{}),...(difficulty&&difficulty!=="All"?{difficulty}:{})},select:{id:true,title:true,category:true,difficulty:true,statement:true,hints:true},orderBy:{title:"asc"}});return NextResponse.json({problems});}
