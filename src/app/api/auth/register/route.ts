import { NextResponse } from "next/server";
import { z } from "zod";
import { hash } from "bcryptjs";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";
const schema=z.object({name:z.string().trim().min(2).max(80),email:z.string().email().max(254),password:z.string().min(10).max(128),college:z.string().max(120).optional(),degree:z.string().max(80).optional(),branch:z.string().max(100).optional(),graduationYear:z.coerce.number().int().min(2020).max(2040).optional()});
export async function POST(req:Request){try{const parsed=schema.safeParse(await req.json());if(!parsed.success)return NextResponse.json({error:"Please check the form fields.",details:parsed.error.flatten().fieldErrors},{status:400});const data=parsed.data;const exists=await db.user.findUnique({where:{email:data.email.toLowerCase()}});if(exists)return NextResponse.json({error:"An account with this email already exists."},{status:409});const {password,...profile}=data;const user=await db.user.create({data:{...profile,email:data.email.toLowerCase(),passwordHash:await hash(password,12)}});await createSession(user.id);return NextResponse.json({user:{id:user.id,name:user.name,email:user.email}},{status:201});}catch(error){console.error("registration failed",error);return NextResponse.json({error:"We could not create your account. Please try again."},{status:500});}}
