'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const features = [
  { icon: "✅", title: "Full AI Matching", desc: "10+ internship matches instead of 3" },
  { icon: "🧠", title: "Resume Feedback", desc: "AI scans your resume and gives tips" },
  { icon: "📄", title: "Cover Letter Generator", desc: "Personalized letter for each internship" },
  { icon: "⏰", title: "Early Access", desc: "Get internships 24 hrs before free users" },
  { icon: "📍", title: "Location Filter", desc: "Filter by remote, hybrid, city-wise" },
  { icon: "🏷️", title: "Verified Only Mode", desc: "Only top-trusted companies shown" },
  { icon: "💬", title: "WhatsApp Support", desc: "Ask anything about internships" },
  { icon: "🎓", title: "Weekly Tips Email", desc: "Career & resume growth hacks" },
];

export default function PricingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background py-12 px-4">
      <Card className="w-full max-w-2xl mb-8">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            ✨ Value Pack for Paid Users <Badge className="ml-2">Suggestions</Badge>
          </CardTitle>
          <CardDescription>Unlock premium features to supercharge your internship hunt!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <span className="text-2xl" aria-label={f.title}>{f.icon}</span>
                <div>
                  <div className="font-semibold">{f.title}</div>
                  <div className="text-sm text-muted-foreground">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-xl">⚙️ Plan Setup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border rounded-lg">
              <thead>
                <tr className="bg-muted">
                  <th className="px-4 py-2 text-left">Plan</th>
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left">Access</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 font-medium">Free</td>
                  <td className="px-4 py-2">₹0</td>
                  <td className="px-4 py-2">3 internship matches/day</td>
                </tr>
                <tr className="bg-accent/30">
                  <td className="px-4 py-2 font-medium flex items-center gap-2">Pro <Badge variant="secondary">Recommended</Badge></td>
                  <td className="px-4 py-2 font-bold text-primary">₹99 <span className="font-normal text-xs">one-time</span></td>
                  <td className="px-4 py-2">Unlimited AI matches, cover letter, verified filter, resume tips</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-2">
          <Button className="w-full max-w-xs" onClick={() => {
            if (typeof window !== 'undefined') {
              const script = document.createElement('script');
              script.src = 'https://checkout.razorpay.com/v1/checkout.js';
              script.async = true;
              document.body.appendChild(script);
              script.onload = () => {
                const options = {
                  key: 'YOUR_RAZORPAY_KEY', // Replace with your Razorpay key
                  amount: 9900, // 99 INR in paise
                  currency: 'INR',
                  name: 'InternHunt Pro',
                  description: 'Unlock all premium features',
                  image: '/app-logo.png',
                  handler: function (response: any) {
                    alert('Payment successful! Payment ID: ' + response.razorpay_payment_id);
                  },
                  prefill: {
                    email: '',
                  },
                  theme: {
                    color: '#6366f1',
                  },
                };
                // @ts-ignore
                const rzp = new window.Razorpay(options);
                rzp.open();
              };
            }
          }}>
            Upgrade to Pro with Razorpay
          </Button>
          <div className="text-xs text-muted-foreground mt-1">One-time payment. No hidden fees.</div>
        </CardFooter>
      </Card>
    </div>
  );
} 