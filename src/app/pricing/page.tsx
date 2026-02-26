"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Sparkles, 
  CreditCard, 
  Zap, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  FileText,
  MessageCircle,
  TrendingUp,
  Loader2
} from "lucide-react";
import { useAuth, useUser } from "@clerk/nextjs";

const features = [
  { icon: Sparkles, title: "Neural Matching+", desc: "Unlimited AI matches instead of 3/day" },
  { icon: FileText, title: "AI Document Studio", desc: "Custom cover letters & STAR drafts" },
  { icon: ShieldCheck, title: "Vetted Opportunities", desc: "Elite filters for top-tier startups" },
  { icon: Clock, title: "Priority Edge", desc: "Access listings 24h before everyone else" },
  { icon: MapPin, title: "Global Relocation", desc: "Visa-sponsorship specific filters" },
  { icon: MessageCircle, title: "Outreach Assistant", desc: "Automated cold DMs for recruiters" },
  { icon: TrendingUp, title: "Resume Intelligence", desc: "AI Scorer with recursive feedback" },
  { icon: Zap, title: "Career Pulse", desc: "Weekly high-signal internship reports" },
];

export default function PricingPage() {
  const { userId } = useAuth();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!userId) {
      alert("Please sign in to upgrade.");
      return;
    }

    setLoading(true);
    try {
      // 1. Create order on backend
      const orderRes = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 99 }),
      });
      const orderData = await orderRes.json();

      if (orderData.error) throw new Error(orderData.error);

      // 2. Initialize Razorpay
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderData.amount,
          currency: "INR",
          name: "InternHunt Pro",
          description: "Full Career Intelligence Access",
          order_id: orderData.id,
          handler: async function (response: any) {
            // In a real app, you'd call a verify-payment API here
            alert("Payment Successful! Order ID: " + response.razorpay_order_id);
            window.location.href = "/dashboard";
          },
          prefill: {
            name: user?.fullName || "",
            email: user?.primaryEmailAddress?.emailAddress || "",
          },
          theme: {
            color: "#3B82F6",
          },
        };
        // @ts-ignore
        const rzp = new window.Razorpay(options);
        rzp.open();
        setLoading(false);
      };
    } catch (err: any) {
      alert("Failed to initiate payment: " + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface pt-24 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4 px-4 py-1.5 rounded-full">
            <Zap className="w-3.5 h-3.5 mr-2" />
            <span className="text-[10px] font-black uppercase tracking-widest">Pricing & Plans</span>
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black text-main tracking-tighter mb-4">
            Invest in Your Future.
          </h1>
          <p className="text-muted font-medium text-lg max-w-xl mx-auto">
            Upgrade to Pro and unlock the full power of AI-driven career intelligence.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Features Column */}
          <div className="lg:col-span-7">
            <Card className="bg-white/[0.02] border-white/5 rounded-[2.5rem] p-10 h-full shadow-2xl">
              <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-10">Premium Intelligence Layer</div>
              <div className="grid sm:grid-cols-2 gap-8">
                {features.map((f, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <f.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-main mb-1">{f.title}</div>
                      <div className="text-xs text-muted leading-relaxed">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Pricing Column */}
          <div className="lg:col-span-5">
            <div className="p-1px bg-primary rounded-[2.5rem] h-full">
              <Card className="bg-[#09090b] rounded-[2.5rem] p-10 h-full flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <CreditCard className="w-32 h-32" />
                </div>

                <div className="relative z-10 flex-1">
                  <Badge className="bg-primary text-white font-black text-[10px] tracking-widest px-4 py-1 rounded-full mb-8">
                    MOST POPULAR
                  </Badge>
                  <h3 className="text-2xl font-black text-main uppercase tracking-tighter mb-2">Pro Hunter</h3>
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-6xl font-black text-main">₹99</span>
                    <span className="text-muted font-bold text-sm tracking-widest uppercase">/One-Time</span>
                  </div>

                  <ul className="space-y-5 mb-12">
                    {[
                      "Lifetime access to AI matching",
                      "Priority Support Hub",
                      "Custom STAR Drafter access",
                      "Elite Startup Feed"
                    ].map((t, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm font-bold text-main/80">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full h-16 bg-primary hover:bg-primary/90 text-white rounded-2xl text-base font-black tracking-widest shadow-2xl shadow-primary/30 relative z-10 group"
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      UPGRADE TO PRO
                      <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
                
                <p className="text-center text-[10px] text-muted font-bold uppercase tracking-widest mt-6 relative z-10">
                  Secure Payment via Razorpay
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Minimal Arrow icon for the button
function ArrowRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}
