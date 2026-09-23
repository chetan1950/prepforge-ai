import { NextResponse } from "next/server";
import { z } from "zod";
import { compare } from "bcryptjs";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";
const schema=z.object({email:z.string().email(),password:z.string().min(1).max(128)});
export async function POST(req:Request){try{const parsed=schema.safeParse(await req.json());if(!parsed.success)return NextResponse.json({error:"Enter a valid email and password."},{status:400});const user=await db.user.findUnique({where:{email:parsed.data.email.toLowerCase()}});if(!user||!(await compare(parsed.data.password,user.passwordHash)))return NextResponse.json({error:"Email or password is incorrect."},{status:401});await createSession(user.id);return NextResponse.json({user:{id:user.id,name:user.name,email:user.email}});}catch{return NextResponse.json({error:"Login is temporarily unavailable."},{status:500});}}
