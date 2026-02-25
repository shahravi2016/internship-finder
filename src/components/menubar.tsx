'use client';

import Image from "next/image";
import Link from "next/link";


export default function Menu() {
    return(
        <div className="flex items-center justify-between">
        {/* <div className="min-h-screen bg-surface"> */}
        {/* Navigation */}
        <nav className="bg-surface border-b border-slate-800/50 sticky top-0 z-50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-center h-16">
  
              <div className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-muted hover:text-accent transition-colors">
                  Features
                </a>
                <Link href="#pricing" className="text-muted hover:text-accent transition-colors">
                  Pricing
                </Link>
                <a href="#testimonials" className="text-muted hover:text-accent transition-colors">
                  Reviews
                </a>
                {/* <Link href="/internships" className="bg-primary hover:bg-blue-600 text-white px-2 py-2 rounded-lg text-md">Get Started</Link> */}
              </div>
            </div>
          </div>
        </nav>
        {/* </div> */}
        </div>
    )
}