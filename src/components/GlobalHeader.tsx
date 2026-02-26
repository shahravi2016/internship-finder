"use client";

import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { 
  SignInButton, 
  SignUpButton, 
  SignedIn, 
  SignedOut, 
  UserButton 
} from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function GlobalHeader() {
  const router = useRouter();

  return (
    <header className="fixed top-0 w-full z-[100] border-b border-white/5 bg-[#09090b]/70 backdrop-blur-xl h-16">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transition-transform group-hover:rotate-6">
              <Search className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tighter text-main hidden sm:block">InternHunt</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-sm font-semibold text-muted hover:text-main transition-colors">Log in</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="bg-primary hover:bg-primary/90 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-lg shadow-primary/20">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-xs font-bold text-muted hover:text-main uppercase tracking-widest transition-colors">Dashboard</Link>
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
