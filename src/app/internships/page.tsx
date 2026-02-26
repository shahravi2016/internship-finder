"use client";
import React from "react";
import { useRouter } from "next/navigation";
import InternshipList from "@/components/InternshipList";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import { 
  User, 
  GraduationCap, 
  Code2, 
  MapPin, 
  Search, 
  Sparkles,
  ArrowRight,
  Briefcase,
  Filter,
  ChevronRight,
  ChevronLeft,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const experienceLevels = ["Beginner", "Intermediate", "Advanced"];
const years = ["1st Year", "2nd Year", "3rd Year", "Final Year", "Graduate"];
const roles = ["Frontend", "Backend", "Fullstack", "AI/ML", "Data Science", "DevOps", "Mobile", "UI/UX", "Cybersecurity"];
const locations = ["Remote", "Hybrid", "On-site"];

export default function InternshipFormPage() {
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState({
    name: "",
    college: "",
    major: "",
    skills: "",
    experience: "",
    year: "",
    preferredRole: "",
    preferredLocation: ""
  });
  
  const [search, setSearch] = React.useState("");
  const [filterLocation, setFilterLocation] = React.useState("");
  const [filterCompany, setFilterCompany] = React.useState("");
  const [filterTag, setFilterTag] = React.useState("");
  
  const router = useRouter();

  // Load profile on mount
  React.useEffect(() => {
    fetch('/api/user/profile')
      .then(res => res.json())
      .then(data => {
        if (data.name) {
          setFormData({
            name: data.name || "",
            college: data.college || "",
            major: data.major || "",
            skills: data.skills || "",
            experience: data.experience || "",
            year: data.year || "",
            preferredRole: data.preferredRole || "",
            preferredLocation: data.preferredLocation || ""
          });
        }
      });
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Save to DB first
    await fetch('/api/user/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const params = new URLSearchParams(formData);
    router.push(`/results?${params.toString()}`);
  }

  const isStepValid = () => {
    if (step === 1) return formData.name && formData.college && formData.major;
    if (step === 2) return formData.skills && formData.experience && formData.year;
    if (step === 3) return formData.preferredRole && formData.preferredLocation;
    return false;
  };

  return (
    <div className="min-h-screen bg-surface pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-24">
        
        {/* Step-Based Intelligent Form */}
        <section className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-4 px-4 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Step {step} of 3</span>
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black text-main tracking-tighter mb-4">
              {step === 1 && "Start with your identity."}
              {step === 2 && "Detail your expertise."}
              {step === 3 && "Define your trajectory."}
            </h1>
          </div>

          <Card className="bg-white/[0.02] border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden">
            {/* Progress Bar */}
            <div className="h-1 w-full bg-white/5">
              <motion.div 
                className="h-full bg-primary" 
                initial={{ width: "33%" }}
                animate={{ width: `${(step / 3) * 100}%` }}
              />
            </div>

            <form onSubmit={handleSubmit} className="p-10 md:p-12 space-y-8">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary block ml-1">Full Name</label>
                      <input
                        type="text" value={formData.name} onChange={e => handleInputChange("name", e.target.value)}
                        className="w-full rounded-2xl border border-white/10 px-6 py-4 bg-white/5 text-main focus:ring-2 focus:ring-primary/50 transition-all font-medium text-lg"
                        placeholder="John Doe" required
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary block ml-1">University</label>
                        <input
                          type="text" value={formData.college} onChange={e => handleInputChange("college", e.target.value)}
                          className="w-full rounded-2xl border border-white/10 px-6 py-4 bg-white/5 text-main focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                          placeholder="Stanford University" required
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary block ml-1">Major</label>
                        <input
                          type="text" value={formData.major} onChange={e => handleInputChange("major", e.target.value)}
                          className="w-full rounded-2xl border border-white/10 px-6 py-4 bg-white/5 text-main focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                          placeholder="Computer Science" required
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary block ml-1">Technical Stack</label>
                      <input
                        type="text" value={formData.skills} onChange={e => handleInputChange("skills", e.target.value)}
                        className="w-full rounded-2xl border border-white/10 px-6 py-4 bg-white/5 text-main focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                        placeholder="React, Python, AWS, Docker..." required
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary block ml-1">Proficiency</label>
                        <Select value={formData.experience} onValueChange={v => handleInputChange("experience", v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Level" />
                          </SelectTrigger>
                          <SelectContent>
                            {experienceLevels.map(lvl => <SelectItem key={lvl} value={lvl}>{lvl}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary block ml-1">Academic Year</label>
                        <Select value={formData.year} onValueChange={v => handleInputChange("year", v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div 
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary block ml-1">Target Role</label>
                        <Select value={formData.preferredRole} onValueChange={v => handleInputChange("preferredRole", v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Role" />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary block ml-1">Preferred Location</label>
                        <Select value={formData.preferredLocation} onValueChange={v => handleInputChange("preferredLocation", v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Location" />
                          </SelectTrigger>
                          <SelectContent>
                            {locations.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 flex items-start gap-4">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        By clicking <span className="text-main font-bold">Generate Matches</span>, our AI will prioritize roles that match your stack and location preferences first.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center justify-between pt-8 border-t border-white/5">
                {step > 1 ? (
                  <Button 
                    type="button" 
                    onClick={prevStep}
                    variant="ghost" 
                    className="h-12 px-6 text-muted hover:text-main hover:bg-white/5 font-bold text-xs tracking-widest"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" /> BACK
                  </Button>
                ) : <div />}

                {step < 3 ? (
                  <Button 
                    type="button" 
                    onClick={nextStep}
                    disabled={!isStepValid()}
                    className="h-12 px-8 bg-primary hover:bg-primary/90 text-white font-black text-xs tracking-widest rounded-xl shadow-xl shadow-primary/20 disabled:opacity-50"
                  >
                    CONTINUE <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    disabled={!isStepValid()}
                    className="h-14 px-10 bg-primary hover:bg-primary/90 text-white font-black text-xs tracking-[0.2em] rounded-xl shadow-2xl shadow-primary/30 group"
                  >
                    GENERATE MATCHES
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                )}
              </div>
            </form>
          </Card>
        </section>

        {/* Global Opportunities Explorer */}
        <section className="space-y-16">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 border-b border-white/5 pb-12">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Opportunity Explorer</span>
              </div>
              <h2 className="text-4xl font-black text-main tracking-tighter">Market Pulse.</h2>
              <p className="text-muted text-sm font-medium mt-2">Real-time listings from Google Jobs Engine.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full lg:w-auto">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-primary transition-colors" />
                <input
                  type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Keyword..."
                  className="w-full rounded-xl border border-white/10 pl-11 pr-4 py-3 bg-white/5 text-sm text-main focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-primary transition-colors" />
                <input
                  type="text" value={filterLocation} onChange={e => setFilterLocation(e.target.value)}
                  placeholder="City..."
                  className="w-full rounded-xl border border-white/10 pl-11 pr-4 py-3 bg-white/5 text-sm text-main focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>
              <input
                type="text" value={filterCompany} onChange={e => setFilterCompany(e.target.value)}
                placeholder="Company..."
                className="w-full rounded-xl border border-white/10 px-4 py-3 bg-white/5 text-sm text-main focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
              <input
                type="text" value={filterTag} onChange={e => setFilterTag(e.target.value)}
                placeholder="Tag (Remote)"
                className="w-full rounded-xl border border-white/10 px-4 py-3 bg-white/5 text-sm text-main focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
          </div>

          <div className="min-h-[600px]">
            <InternshipList
              limit={12}
              clampText
              minimal
              search={search}
              filterLocation={filterLocation}
              filterCompany={filterCompany}
              filterTag={filterTag}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
