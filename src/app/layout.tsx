import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { type Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from "@clerk/themes";
import GlobalHeader from "@/components/GlobalHeader";

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
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#3B82F6",
          colorBackground: "#09090b",
          colorInputBackground: "#18181b",
          colorText: "#F8FAFC",
        },
      }}
    >
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className={`${inter.className} bg-surface text-main selection:bg-primary/30`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <GlobalHeader />
          <main className="pt-16">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  )
}
