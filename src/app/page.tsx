'use client';
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Zap,
  Shield,
  Brain,
  Users,
  TrendingUp,
  CheckCircle,
  Star,
  ArrowRight,
  Sparkles,
  Clock,
  Target,
  Award,
  BookOpen,
  MessageSquare,
  BarChart3,
} from "lucide-react"
import { useRouter } from "next/navigation";
import InternshipList from "@/components/InternshipList";
import Link from "next/link";
import Image from "next/image";


export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Navigation */}
      {/* <nav className="bg-surface border-b border-slate-800/50 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-left space-x-3">
                <Image src="/app-logo.png" alt="InternHunt" width={140} height={140} className="flex justify-left py-2" />
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted hover:text-accent transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-muted hover:text-accent transition-colors">
                Pricing
              </a>
              <a href="#testimonials" className="text-muted hover:text-accent transition-colors">
                Reviews
              </a>
              <Link href="/internships" className="bg-primary hover:bg-blue-600 text-white px-2 py-2 rounded-lg text-md">Get Started</Link>
            </div>
          </div>
        </div>
      </nav> */}

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-secondary/10 text-secondary border-secondary/20 mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Internship Discovery
            </Badge>

            <h1 className="text-5xl md:text-6xl font-bold text-main mb-6 leading-tight">
              Find Your Dream
              <span className="text-primary"> Internship</span>
              <br />
              in Minutes, Not Months
            </h1>

            <p className="text-xl text-muted mb-8 max-w-3xl mx-auto leading-relaxed">
              Skip the endless scrolling. Our AI matches you with perfect internships based on your skills, interests,
              and career goals. Trusted by 50,000+ students worldwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button size="lg" className="bg-primary hover:bg-blue-600 text-white px-8 py-4 text-lg" asChild>
                <Link href="/internships">
                  Start Hunting Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-accent text-accent hover:bg-accent hover:text-white px-8 py-4 text-lg bg-transparent"
              >
                Watch Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-muted mb-16">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>50,000+ Students</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>95% Match Success</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 fill-secondary text-secondary" />
                <span>4.9/5 Rating</span>
              </div>
            </div>
          </div>

          {/* Hero Visual/Stats */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="bg-card border-slate-700 p-8 text-center hover:border-slate-600 transition-colors">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-main mb-3 tracking-tight">2 min</h3>
              <p className="text-base text-muted font-medium">Average match time</p>
            </Card>
            <Card className="bg-card border-slate-700 p-8 text-center hover:border-slate-600 transition-colors">
              <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-3xl font-bold text-main mb-3 tracking-tight">10,000+</h3>
              <p className="text-base text-muted font-medium">Active internships</p>
            </Card>
            <Card className="bg-card border-slate-700 p-8 text-center hover:border-slate-600 transition-colors">
              <div className="w-16 h-16 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-3xl font-bold text-main mb-3 tracking-tight">500+</h3>
              <p className="text-base text-muted font-medium">Partner companies</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Internship Listings */}
      <section className="py-12 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-main mb-8 text-center">Latest Internships</h2>
          <InternshipList limit={3} filterTag="internship" clampText={true} minimal={true}  />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-main mb-4">Why Students Choose InternHunt</h2>
            <p className="text-xl text-muted max-w-2xl mx-auto">
              Built specifically for students who want to land internships faster with modern AI technology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-3 mb-3">
            <Card className="bg-card border-slate-700 hover:border-slate-600 transition-colors group p-8">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-main mb-4 leading-tight">Lightning Fast Matching</h3>
              <p className="text-base text-muted leading-relaxed">
                Our AI analyzes thousands of internships in seconds to find your perfect matches based on skills,
                location, and preferences
              </p>
            </Card>

            <Card className="bg-card border-slate-700 hover:border-slate-600 transition-colors group p-8">
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <Shield className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-main mb-4 leading-tight">Verified Opportunities</h3>
              <p className="text-base text-muted leading-relaxed">
                Every internship is verified and vetted by our team. No fake postings, no scams - just real
                opportunities from trusted companies
              </p>
            </Card>

            <Card className="bg-card border-slate-700 hover:border-slate-600 transition-colors group p-8">
              <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors">
                <Brain className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-main mb-4 leading-tight">Smart AI Assistant</h3>
              <p className="text-base text-muted leading-relaxed">
                Get personalized application tips, resume feedback, interview prep, and career guidance powered by
                advanced AI
              </p>
            </Card>
          </div>

          {/* Additional Features */}
          <div className="grid md:grid-cols-2 gap-3">
            <Card className="bg-card border-slate-700 p-8 hover:border-slate-600 transition-colors">
              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-main mb-3 leading-tight">Application Tracking</h3>
                  <p className="text-base text-muted leading-relaxed">
                    Keep track of all your applications, deadlines, and follow-ups in one organized dashboard
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-card border-slate-700 p-8 hover:border-slate-600 transition-colors">
              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-main mb-3 leading-tight">Direct Company Contact</h3>
                  <p className="text-base text-muted leading-relaxed">
                    Connect directly with hiring managers and recruiters through our integrated messaging system
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-main mb-4">Loved by Students Worldwide</h2>
            <p className="text-xl text-muted">See what students are saying about their InternHunt experience</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <Card className="bg-surface border-slate-700 p-8 hover:border-slate-600 transition-colors">
              <div className="flex items-center mb-6">
                <div className="flex text-secondary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-base text-muted mb-8 leading-relaxed font-medium">
                "Found my dream internship at Google in just 3 days! The AI matching was incredibly accurate and saved
                me hours of searching."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <div>
                  <p className="text-main font-bold text-base">Sarah Chen</p>
                  <p className="text-muted text-sm font-medium">CS Student, Stanford</p>
                </div>
              </div>
            </Card>

            <Card className="bg-surface border-slate-700 p-8 hover:border-slate-600 transition-colors">
              <div className="flex items-center mb-6">
                <div className="flex text-secondary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-base text-muted mb-8 leading-relaxed font-medium">
                "The resume feedback feature helped me land 3 interviews in my first week. InternHunt is a game-changer
                for students!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <div>
                  <p className="text-main font-bold text-base">Marcus Johnson</p>
                  <p className="text-muted text-sm font-medium">Business Student, NYU</p>
                </div>
              </div>
            </Card>

            <Card className="bg-surface border-slate-700 p-8 hover:border-slate-600 transition-colors">
              <div className="flex items-center mb-6">
                <div className="flex text-secondary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-base text-muted mb-8 leading-relaxed font-medium">
                "As an international student, finding internships was tough. InternHunt connected me with companies that
                sponsor visas!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mr-4">
                  <span className="text-slate-900 font-bold text-lg">A</span>
                </div>
                <div>
                  <p className="text-main font-bold text-base">Aisha Patel</p>
                  <p className="text-muted text-sm font-medium">Engineering Student, MIT</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-main mb-4">Simple, Student-Friendly Pricing</h2>
            <p className="text-xl text-muted">
              Start free, upgrade when you're ready to supercharge your internship search
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="border-2 border-slate-700 relative p-8 hover:border-slate-600 transition-colors">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-main mb-4">Free Explorer</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-main">$0</span>
                  <span className="text-lg font-medium text-muted">/month</span>
                </div>
                <p className="text-base text-muted font-medium">Perfect for getting started</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-muted">
                  <CheckCircle className="w-5 h-5 text-accent mr-4 flex-shrink-0" />
                  <span className="text-base">5 AI matches per week</span>
                </li>
                <li className="flex items-center text-muted">
                  <CheckCircle className="w-5 h-5 text-accent mr-4 flex-shrink-0" />
                  <span className="text-base">Basic profile setup</span>
                </li>
                <li className="flex items-center text-muted">
                  <CheckCircle className="w-5 h-5 text-accent mr-4 flex-shrink-0" />
                  <span className="text-base">Email notifications</span>
                </li>
                <li className="flex items-center text-muted">
                  <CheckCircle className="w-5 h-5 text-accent mr-4 flex-shrink-0" />
                  <span className="text-base">Application tracking</span>
                </li>
              </ul>
              <Button
                className="w-full border-primary text-primary hover:bg-primary hover:text-white bg-transparent py-3 text-base font-semibold"
                variant="outline"
              >
                Start Free
              </Button>
            </Card>

            {/* Pro Plan */}
            <Card className="border-2 border-primary relative shadow-xl p-8 hover:border-blue-400 transition-colors">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-secondary text-slate-900 px-4 py-1 font-bold">
                Most Popular
              </Badge>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-main mb-4">Pro Hunter</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-main">$19</span>
                  <span className="text-lg font-medium text-muted">/month</span>
                </div>
                <p className="text-base text-muted font-medium">For serious internship hunters</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-muted">
                  <CheckCircle className="w-5 h-5 text-primary mr-4 flex-shrink-0" />
                  <span className="text-base">Unlimited AI matches</span>
                </li>
                <li className="flex items-center text-muted">
                  <CheckCircle className="w-5 h-5 text-primary mr-4 flex-shrink-0" />
                  <span className="text-base">Advanced filtering</span>
                </li>
                <li className="flex items-center text-muted">
                  <CheckCircle className="w-5 h-5 text-primary mr-4 flex-shrink-0" />
                  <span className="text-base">Resume optimization</span>
                </li>
                <li className="flex items-center text-muted">
                  <CheckCircle className="w-5 h-5 text-primary mr-4 flex-shrink-0" />
                  <span className="text-base">Interview prep AI</span>
                </li>
                <li className="flex items-center text-muted">
                  <CheckCircle className="w-5 h-5 text-primary mr-4 flex-shrink-0" />
                  <span className="text-base">Direct company messaging</span>
                </li>
                <li className="flex items-center text-muted">
                  <CheckCircle className="w-5 h-5 text-primary mr-4 flex-shrink-0" />
                  <span className="text-base">Priority support</span>
                </li>
              </ul>
              <Button className="w-full bg-primary hover:bg-blue-600 text-white py-3 text-base font-semibold">
                Upgrade to Pro
              </Button>
            </Card>

            {/* Premium Plan */}
            <Card className="border-2 border-slate-700 relative p-8 hover:border-slate-600 transition-colors">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-main mb-4">Premium Elite</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-main">$39</span>
                  <span className="text-lg font-medium text-muted">/month</span>
                </div>
                <p className="text-base text-muted font-medium">Maximum success guarantee</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-muted">
                  <CheckCircle className="w-5 h-5 text-accent mr-4 flex-shrink-0" />
                  <span className="text-base">Everything in Pro</span>
                </li>
                <li className="flex items-center text-muted">
                  <CheckCircle className="w-5 h-5 text-accent mr-4 flex-shrink-0" />
                  <span className="text-base">1-on-1 career coaching</span>
                </li>
                <li className="flex items-center text-muted">
                  <CheckCircle className="w-5 h-5 text-accent mr-4 flex-shrink-0" />
                  <span className="text-base">Custom application strategy</span>
                </li>
                <li className="flex items-center text-muted">
                  <CheckCircle className="w-5 h-5 text-accent mr-4 flex-shrink-0" />
                  <span className="text-base">Success guarantee</span>
                </li>
                <li className="flex items-center text-muted">
                  <CheckCircle className="w-5 h-5 text-accent mr-4 flex-shrink-0" />
                  <span className="text-base">Exclusive company access</span>
                </li>
              </ul>
              <Button
                className="w-full border-accent text-accent hover:bg-accent hover:text-white bg-transparent py-3 text-base font-semibold"
                variant="outline"
              >
                Go Premium
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Land Your Dream Internship?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students who've already found their perfect internships with InternHunt
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-8 py-4 text-lg">
              Start Your Hunt Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg bg-transparent"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-main py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">InternHunt</span>
              </div>
              <p className="text-gray-400 mb-4">
                The smartest way for students to find internships with AI-powered matching.
              </p>
              <div className="flex items-center space-x-2 text-muted">
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm">50,000+ students trust us</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Status
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Community
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Press
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 InternHunt. All rights reserved. Built with ❤️ for students worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
