'use client';
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import {
  Search,
  Zap,
  Shield,
  Brain,
  Users,
  TrendingUp,
  Star,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Briefcase,
  Layers,
  MousePointer2,
} from "lucide-react"
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import InternshipList from "@/components/InternshipList";
import Link from "next/link";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }
};

const stagger = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { staggerChildren: 0.1 }
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface font-sans antialiased text-main overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-28 pb-32 px-6">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.08),transparent_50%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center text-left">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <Badge className="bg-white/5 text-primary border-primary/20 mb-8 px-4 py-1.5 rounded-full backdrop-blur-sm">
                {/* <Sparkles className="w-3.5 h-3.5 mr-2" /> */}
                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Next-Gen Career Intelligence</span>
              </Badge>

              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-main mb-8 tracking-tighter leading-[0.9] text-balance">
                Precision Match Your <br />
                <span className="text-primary italic">Next Move.</span>
              </h1>

              <p className="text-lg md:text-xl text-muted mb-12 max-w-xl leading-relaxed font-medium text-balance">
                InternHunt leverages neural matching to align your technical profile with elite internship opportunities globally. No noise, just signals.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="h-14 px-10 bg-primary hover:bg-primary/90 text-white rounded-xl text-base font-bold shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02]" asChild>
                  <Link href="/internships">
                    Launch Discovery
                    <MousePointer2 className="ml-3 w-4 h-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-10 border-white/10 text-main hover:bg-white/5 bg-transparent rounded-xl text-base font-bold transition-all">
                  View Demo
                </Button>
              </div>
            </motion.div>

            {/* Premium Matching Radar Hero Graphic */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as any, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="absolute -inset-20 bg-primary/10 rounded-full blur-[100px] opacity-40" />
              <svg viewBox="0 0 500 500" className="relative w-full h-auto drop-shadow-2xl">
                <defs>
                  <linearGradient id="sweepGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                  </linearGradient>
                  <filter id="svgGlow">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Outer Architectural Rings */}
                <circle cx="250" cy="250" r="220" fill="none" stroke="currentColor" strokeWidth="1" className="text-white/10" />
                <circle cx="250" cy="250" r="180" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/20" strokeDasharray="4 8" />
                <circle cx="250" cy="250" r="140" fill="none" stroke="currentColor" strokeWidth="1" className="text-white/10" />
                <circle cx="250" cy="250" r="100" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary/30" />

                {/* Rotating Scanner Group */}
                <g>
                  {/* The visible "sweep" area - Corrected coordinates for r=220 */}
                  <path 
                    d="M250 250 L250 30 A220 220 0 0 1 391.4 81.5 Z" 
                    fill="url(#sweepGradient)"
                    className="opacity-60"
                  />
                  {/* The leading beam line */}
                  <line 
                    x1="250" y1="250" x2="250" y2="30" 
                    stroke="#3B82F6" 
                    strokeWidth="4" 
                    strokeLinecap="round"
                    filter="url(#svgGlow)" 
                  />
                  <animateTransform 
                    attributeName="transform" 
                    type="rotate" 
                    from="0 250 250" 
                    to="360 250 250" 
                    dur="6s" 
                    repeatCount="indefinite" 
                  />
                </g>

                {/* Match "Pings" - High Visibility */}
                <g filter="url(#svgGlow)">
                  <circle cx="380" cy="180" r="6" className="fill-primary shadow-xl">
                    <animate attributeName="opacity" values="0;1;0" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="380" cy="180" r="6" fill="none" stroke="#3B82F6" strokeWidth="2">
                    <animate attributeName="r" values="6;20" dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0" dur="2.5s" repeatCount="indefinite" />
                  </circle>

                  <circle cx="150" cy="320" r="5" className="fill-accent">
                    <animate attributeName="opacity" values="0;1;0" dur="3s" begin="1s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="150" cy="320" r="5" fill="none" stroke="#22D3EE" strokeWidth="2">
                    <animate attributeName="r" values="5;18" dur="3s" begin="1s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0" dur="3s" begin="1s" repeatCount="indefinite" />
                  </circle>

                  <circle cx="280" cy="380" r="7" className="fill-primary">
                    <animate attributeName="opacity" values="0;1;0" dur="4s" begin="0.5s" repeatCount="indefinite" />
                  </circle>
                </g>

                {/* Central AI Core - Glowing */}
                <circle cx="250" cy="250" r="8" className="fill-white shadow-xl" filter="url(#svgGlow)" />
                <circle cx="250" cy="250" r="14" fill="none" stroke="#3B82F6" strokeWidth="3">
                  <animate attributeName="r" values="14;20;14" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
                </circle>

                {/* Floating Meta Data - Clearer */}
                <g className="text-[10px] font-black fill-muted uppercase tracking-[0.25em]">
                  <text x="390" y="165">MATCH FOUND</text>
                  <text x="80" y="340">SCANNING...</text>
                  <text x="260" y="415">VERIFIED</text>
                </g>
              </svg>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-white/5 pt-12"
          >
            {[
              { label: "Talent Pool", value: "50,000+" },
              { label: "Success Rate", value: "95%" },
              { label: "Daily Listings", value: "1,200+" },
              { label: "Global Partners", value: "500+" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-black text-main tracking-tight mb-1">{stat.value}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <motion.section 
        {...fadeInUp}
        id="featured-jobs" 
        className="py-32 px-6 bg-white/[0.02] border-y border-white/5 relative"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-6 bg-primary rounded-full" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Live Opportunities</span>
              </div>
              <h2 className="text-4xl font-black text-main tracking-tight">Curated for Excellence.</h2>
            </div>
            <Button variant="link" className="text-primary font-bold gap-2 p-0 h-auto hover:no-underline group" asChild>
              <Link href="/internships">
                EXPLORE ALL OPENINGS
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-primary/5 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative">
              <InternshipList limit={3} filterTag="internship" clampText={true} minimal={true} />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Core Intelligence Features */}
      <section id="features" className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-4xl md:text-5xl font-black text-main mb-6 tracking-tight">Engineered for Results.</h2>
            <p className="text-lg text-muted font-medium">We replaced the traditional application grind with a data-driven intelligence layer.</p>
          </motion.div>

          <motion.div 
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            variants={{
              whileInView: { transition: { staggerChildren: 0.1 } }
            }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Layers,
                title: "Neural Matching",
                desc: "Our proprietary algorithm analyzes your stack and predicts the highest probability matches across our entire database.",
                tag: "ALGORITHM"
              },
              {
                icon: Briefcase,
                title: "Elite Verification",
                desc: "Direct-to-recruiter pipelines ensure every listing is current, high-quality, and verified by our engineering panel.",
                tag: "VETTED"
              },
              {
                icon: Brain,
                title: "Auto-Optimize",
                desc: "Instant generation of mission-critical application materials—tailored specifically to the job description in seconds.",
                tag: "GEN-AI"
              }
            ].map((f, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card className="bg-white/5 border-white/5 p-10 rounded-[2rem] hover:border-white/10 transition-all flex flex-col h-full shadow-2xl">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-8">
                    <f.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-[10px] font-black text-primary tracking-[0.2em] mb-4">{f.tag}</div>
                  <h3 className="text-2xl font-bold text-main mb-4 tracking-tight">{f.title}</h3>
                  <p className="text-muted leading-relaxed font-medium mb-8 flex-1">{f.desc}</p>
                  <div className="pt-6 border-t border-white/5">
                    <div className="flex items-center gap-2 text-xs font-bold text-main">
                      <CheckCircle2 className="w-3 h-3 text-primary" />
                      Deployed & Active
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Social Proof Grid */}
      <motion.section {...fadeInUp} id="testimonials" className="py-32 px-6 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-5xl font-black text-main mb-8 tracking-tight">The new standard for career entry.</h2>
              <div className="space-y-8">
                {[
                  { q: "Found my role at Google in 72 hours. The matching is pure signal.", n: "Sarah Chen", r: "CS @ Stanford" },
                  { q: "The AI cover letters are better than what I could write in an hour.", n: "Marcus J.", r: "Eng @ MIT" }
                ].map((t, i) => (
                  <motion.div key={i} {...fadeInUp} className="flex gap-6 items-start">
                    <div className="w-12 h-12 bg-primary/20 rounded-full shrink-0 flex items-center justify-center font-bold text-primary italic">“</div>
                    <div>
                      <p className="text-xl font-medium text-main/90 mb-4 tracking-tight leading-snug">{t.q}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-main">{t.n}</span>
                        <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{t.r}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="grid grid-cols-2 gap-4"
            >
               <div className="space-y-4">
                  <div className="h-48 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-center"><TrendingUp className="w-12 h-12 text-primary/20" /></div>
                  <div className="h-64 bg-primary rounded-3xl flex items-center justify-center flex-col p-8 text-white">
                    <div className="text-4xl font-black mb-2">95%</div>
                    <div className="text-xs font-bold uppercase tracking-widest opacity-80 text-center">Placement Success</div>
                  </div>
               </div>
               <div className="space-y-4 pt-12">
                  <div className="h-64 bg-white/5 rounded-3xl border border-white/5 p-8 flex flex-col justify-end">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-secondary text-secondary" />)}
                    </div>
                    <div className="text-xs font-bold uppercase tracking-widest text-muted">User Satisfaction</div>
                  </div>
                  <div className="h-48 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-center"><Users className="w-12 h-12 text-primary/20" /></div>
               </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Modern Pricing Grid */}
      <section id="pricing" className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="text-center max-w-2xl mx-auto mb-24">
            <h2 className="text-5xl font-black text-main mb-6 tracking-tight">Investment for Growth.</h2>
            <p className="text-lg text-muted font-medium">Transparent pricing designed for student success.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { n: "Explorer", p: "0", f: ["5 AI Matches", "Basic Dashboard", "Email Alerts"], b: "GET STARTED" },
              { n: "Hunter", p: "19", f: ["Unlimited Matches", "AI Document Studio", "Priority Indexing", "Direct Messaging"], b: "UPGRADE NOW", active: true },
              { n: "Elite", p: "39", f: ["All Hunter Features", "Application Acceleration", "Expert Review", "Network Access"], b: "GO ELITE" }
            ].map((plan, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`p-1px rounded-[2rem] ${plan.active ? 'bg-primary' : 'bg-white/5'}`}
              >
                <div className={`${plan.active ? 'bg-primary' : 'bg-white/[0.03] border border-white/5'} rounded-[2rem] p-10 h-full flex flex-col group hover:border-primary/20 transition-all`}>
                  <div className="mb-10 text-center">
                    <div className={`text-[10px] font-black tracking-[0.2em] mb-4 ${plan.active ? 'text-white/70' : 'text-muted'}`}>{plan.n}</div>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className={`text-5xl font-black ${plan.active ? 'text-white' : 'text-main'}`}>${plan.p}</span>
                      <span className={`${plan.active ? 'text-white/60' : 'text-muted'} text-sm font-bold tracking-widest`}>/mo</span>
                    </div>
                  </div>
                  <ul className="space-y-6 mb-12 flex-1">
                    {plan.f.map((feat, j) => (
                      <li key={j} className={`flex items-center gap-3 text-sm font-semibold ${plan.active ? 'text-white' : 'text-main/80'}`}>
                        <CheckCircle2 className={`w-4 h-4 shrink-0 ${plan.active ? 'text-white' : 'text-primary'}`} />
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full h-14 rounded-2xl font-black text-xs tracking-widest transition-all ${plan.active ? 'bg-white text-primary hover:bg-white/90 shadow-xl' : 'bg-white/5 text-main hover:bg-white/10'}`}>
                    {plan.b}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global CTA */}
      <motion.section {...fadeInUp} className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-primary rounded-[3rem] p-16 md:p-24 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.15),transparent_40%)]" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">Ready for liftoff?</h2>
              <p className="text-xl text-white/80 font-medium mb-12">Join the elite cohort of students leveraging InternHunt to secure their professional future.</p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button size="lg" className="h-16 px-12 bg-white text-primary hover:bg-white/90 rounded-2xl text-base font-black shadow-2xl transition-all hover:scale-105" asChild>
                  <Link href="/internships" className="text-primary">CREATE ACCOUNT</Link>
                </Button>
                <Button size="lg" variant="outline" className="h-16 px-12 border-white/20 text-white hover:bg-white/10 bg-transparent rounded-2xl text-base font-black transition-all">
                  VIEW DOCS
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Minimal Footer */}
      <footer className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                  <Search className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-black tracking-tighter text-main">InternHunt</span>
              </div>
              <p className="text-muted font-medium text-sm max-w-xs leading-relaxed">
                The intelligence layer for early career growth. Helping the next generation find signal in the noise.
              </p>
            </div>
            {['Product', 'Company'].map((title, i) => (
              <div key={i}>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-main mb-8">{title}</h4>
                <ul className="space-y-4 text-sm font-bold text-muted">
                  <li><a href="#" className="hover:text-primary transition-colors">Navigation</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Resources</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-white/5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted/60">© 2024 INTERNHUNT LTD. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-muted/60">
              <a href="#" className="hover:text-main">Twitter</a>
              <a href="#" className="hover:text-main">LinkedIn</a>
              <a href="#" className="hover:text-main">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
