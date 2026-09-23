import {NextResponse} from "next/server";
import {z} from "zod";
import {getUser} from "@/lib/auth";
const schema=z.object({kind:z.enum(["technical","hr"]),question:z.string().min(1).max(2000),answer:z.string().min(10).max(10000)});
export async function POST(req:Request){if(!await getUser())return NextResponse.json({error:"Unauthorized"},{status:401});const parsed=schema.safeParse(await req.json());if(!parsed.success)return NextResponse.json({error:"Provide a question and an answer of at least 10 characters."},{status:400});if(!process.env.AI_API_KEY)return NextResponse.json({error:"AI feedback is unavailable. Configure AI_PROVIDER, AI_API_KEY, and AI_MODEL on the server to enable real answer analysis."},{status:503});return NextResponse.json({error:"The configured provider adapter is not available yet. No practice score was generated."},{status:501});}
