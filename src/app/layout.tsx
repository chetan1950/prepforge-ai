import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
const geistSans=Geist({variable:"--font-geist-sans",subsets:["latin"]});
const geistMono=Geist_Mono({variable:"--font-geist-mono",subsets:["latin"]});
export const metadata:Metadata={title:"PrepForge AI — Placement preparation, made personal",description:"Build real placement skills with focused practice, progress insights, and interview preparation."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" className={geistSans.variable+" "+geistMono.variable}><body>{children}</body></html>}
