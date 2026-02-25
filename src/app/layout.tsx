import type React from "react"
// import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { type Metadata } from 'next'
import Image from "next/image";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import './globals.css'
import Menu from "@/components/menubar"
import Link from "next/link";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "InternHunt - Find Your Dream Internship",
  description:
    "AI-powered internship discovery platform for students. Find perfect internships in minutes, not months.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className={`${inter.className} bg-surface text-main`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
        <header className="flex items-center p-4 gap-4 h-16 justify-end sticky top-0 z-50 backdrop-blur-sm">
            <SignedOut>
              {/* <Menu></Menu> */}
              <SignInButton />
              <SignUpButton>
                <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              {/* <Menu></Menu> */}
              <UserButton />
            </SignedIn>
            <Link href="/pricing" className="text-white hover:underline">
              Pricing
            </Link>
          </header>
          {children}
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  )
}
