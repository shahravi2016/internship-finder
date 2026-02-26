"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bookmark, 
  Briefcase, 
  MapPin, 
  ExternalLink, 
  Trash2, 
  Sparkles,
  ArrowLeft,
  LayoutDashboard,
  Clock,
  CheckCircle2,
  Send,
  MessageSquare,
  Trophy,
  XCircle,
  BrainCircuit,
  Loader2,
  Linkedin,
  MessageSquareText,
  Star as StarIcon,
  PenTool,
  Calendar,
  Bell
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@clerk/nextjs";

const statuses = [
  { id: "Saved", icon: Bookmark, color: "text-muted" },
  { id: "Applied", icon: Send, color: "text-blue-400" },
  { id: "Interviewing", icon: MessageSquare, color: "text-yellow-400" },
  { id: "Offer", icon: Trophy, color: "text-green-400" },
  { id: "Rejected", icon: XCircle, color: "text-red-400" }
];

function stripMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
    .replace(/!\[([^\]]*)\]\([^\)]+\)/g, "")
    .replace(/^#+\s/gm, "")
    .replace(/^>\s/gm, "")
    .replace(/^[-*+]\s/gm, "")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function DashboardPage() {
  const { isLoaded, userId } = useAuth();
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [interviewPrep, setInterviewPrep] = useState<{ [key: string]: { questions: string; loading: boolean } }>({});
  const [coldDMs, setColdDMs] = useState<{ [key: string]: { text: string; loading: boolean } }>({});
  
  // STAR Drafter States
  const [activeStarId, setActiveStarId] = useState<string | null>(null);
  const [starInput, setStarInput] = useState("");
  const [starOutput, setStarOutput] = useState<{ [key: string]: { text: string; loading: boolean } }>({});

  const checkDeadlines = useCallback((jobs: any[]) => {
    const today = new Date();
    const urgentJobs = jobs.filter(job => {
      if (!job.deadline) return false;
      const deadline = new Date(job.deadline);
      const diffTime = deadline.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 2;
    });

    if (urgentJobs.length > 0) {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Urgent Deadlines!", {
          body: `You have ${urgentJobs.length} application(s) closing soon.`,
          icon: "/app-logo.png"
        });
      } else if ("Notification" in window && Notification.permission !== "denied") {
        Notification.requestPermission();
      }
    }
  }, []);

  const fetchSavedJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/saved-jobs');
      const data = await res.json();
      if (Array.isArray(data)) {
        setSavedJobs(data);
        checkDeadlines(data);
      }
    } catch (e) {
      console.error("Failed to fetch");
    } finally {
      setLoading(false);
    }
  }, [checkDeadlines]);

  useEffect(() => {
    if (isLoaded && userId) {
      fetchSavedJobs();
    }
  }, [isLoaded, userId, fetchSavedJobs]);

  const updateStatus = async (jobId: string, status: string) => {
    try {
      await fetch('/api/user/saved-jobs/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_id: jobId, status })
      });
      setSavedJobs(prev => prev.map(j => j.job_id === jobId ? { ...j, status } : j));
    } catch (e) {
      console.error("Update failed");
    }
  };

  const updateDeadline = async (jobId: string, deadline: string) => {
    try {
      await fetch('/api/user/saved-jobs/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_id: jobId, deadline })
      });
      setSavedJobs(prev => prev.map(j => j.job_id === jobId ? { ...j, deadline } : j));
    } catch (e) {
      console.error("Deadline update failed");
    }
  };

  const removeJob = async (jobId: string) => {
    try {
      await fetch('/api/user/saved-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_id: jobId })
      });
      setSavedJobs(prev => prev.filter(j => j.job_id !== jobId));
    } catch (e) {
      console.error("Remove failed");
    }
  };

  const generatePrep = async (job: any) => {
    setInterviewPrep(prev => ({ ...prev, [job.job_id]: { questions: "", loading: true } }));
    const prompt = `You are an expert technical recruiter. Generate 3 technical and 2 behavioral interview questions for this role: ${job.title} at ${job.company_name}. Format: Clean list.`;
    try {
      const res = await fetch("/api/gemini", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt }) });
      const data = await res.json();
      setInterviewPrep(prev => ({ ...prev, [job.job_id]: { questions: stripMarkdown(data.text || ""), loading: false } }));
    } catch (err) { setInterviewPrep(prev => ({ ...prev, [job.job_id]: { questions: "Error.", loading: false } })); }
  };

  const generateColdDM = async (job: any) => {
    setColdDMs(prev => ({ ...prev, [job.job_id]: { text: "", loading: true } }));
    const prompt = `Generate a short, high-impact 3-sentence LinkedIn message for a student reaching out to a recruiter at ${job.company_name} for the ${job.title} role.`;
    try {
      const res = await fetch("/api/gemini", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt }) });
      const data = await res.json();
      setColdDMs(prev => ({ ...prev, [job.job_id]: { text: stripMarkdown(data.text || ""), loading: false } }));
    } catch (err) { setColdDMs(prev => ({ ...prev, [job.job_id]: { text: "Error.", loading: false } })); }
  };

  const generateStarDraft = async (job: any) => {
    if (!starInput) return;
    setStarOutput(prev => ({ ...prev, [job.job_id]: { text: "", loading: true } }));
    const prompt = `Rewrite this project experience into STAR format optimized for ${job.title} at ${job.company_name}. User input: ${starInput}`;
    try {
      const res = await fetch("/api/gemini", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt }) });
      const data = await res.json();
      setStarOutput(prev => ({ ...prev, [job.job_id]: { text: stripMarkdown(data.text || ""), loading: false } }));
      setStarInput("");
    } catch (err) { setStarOutput(prev => ({ ...prev, [job.job_id]: { text: "Error.", loading: false } })); }
  };

  const filteredJobs = useMemo(() => {
    if (activeFilter === "All") return savedJobs;
    return savedJobs.filter(j => (j.status || "Saved") === activeFilter);
  }, [savedJobs, activeFilter]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-muted font-bold text-xs uppercase tracking-widest">Syncing Hub</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pt-24 pb-20 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <LayoutDashboard className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Candidate Command Center</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-main tracking-tighter">Your Journey.</h1>
          </div>
          <Button asChild variant="outline" className="border-white/10 text-main hover:bg-white/5 rounded-xl font-bold">
            <Link href="/internships">
              <ArrowLeft className="w-4 h-4 mr-2" /> DISCOVER MORE
            </Link>
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mb-12 border-b border-white/5 pb-8">
          {["All", ...statuses.map(s => s.id)].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                activeFilter === f 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'bg-white/5 text-muted hover:bg-white/10 hover:text-main'
              }`}
            >
              {f} ({f === "All" ? savedJobs.length : savedJobs.filter(j => (j.status || "Saved") === f).length})
            </button>
          ))}
        </div>

        <div className="space-y-8">
          <AnimatePresence mode="popLayout">
            {filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredJobs.map((job) => {
                  const prep = interviewPrep[job.job_id];
                  const dm = coldDMs[job.job_id];
                  const star = starOutput[job.job_id];
                  return (
                    <motion.div
                      layout
                      key={job.job_id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="bg-white/[0.03] border-white/5 rounded-[2rem] hover:border-primary/20 transition-all group overflow-hidden flex flex-col h-full shadow-2xl relative">
                        <div className="p-8 border-b border-white/5 flex justify-between items-start bg-white/[0.01]">
                          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-xl font-black text-primary">
                            {job.company_name?.[0] || "🏢"}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-white/5 text-muted border-white/5 text-[9px] font-black uppercase tracking-widest px-2.5 py-1">
                              {job.status || "Saved"}
                            </Badge>
                            <button 
                              onClick={() => removeJob(job.job_id)}
                              className="p-2 rounded-lg bg-white/5 text-muted hover:bg-red-500/10 hover:text-red-500 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="p-8 flex-1 space-y-6">
                          <div>
                            <h3 className="font-bold text-xl text-main leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
                              {job.title}
                            </h3>
                            <div className="flex items-center gap-2 text-muted font-bold text-[10px] uppercase tracking-widest">
                              <Briefcase className="w-3 h-3 text-primary/60" />
                              {job.company_name}
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="flex items-center justify-between text-xs text-muted/60 font-medium">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5 text-primary/40" />
                                {job.location || "Remote"}
                              </div>
                              <a 
                                href={`https://www.linkedin.com/search/results/people/?keywords=Hiring%20Manager%20${encodeURIComponent(job.company_name)}`} 
                                target="_blank"
                                className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors"
                              >
                                <Linkedin className="w-3 h-3" /> Recruiters
                              </a>
                            </div>

                            <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Calendar className="w-3.5 h-3.5 text-muted" />
                                <input 
                                  type="date"
                                  value={job.deadline || ""}
                                  onChange={(e) => updateDeadline(job.job_id, e.target.value)}
                                  className="bg-transparent text-[10px] text-main font-bold focus:outline-none uppercase"
                                />
                              </div>
                              {job.deadline && (
                                <div className={`flex items-center gap-1 text-[9px] font-black animate-pulse ${
                                  new Date(job.deadline).getTime() - new Date().getTime() <= 172800000 
                                  ? 'text-red-400' 
                                  : 'text-primary'
                                }`}>
                                  <Bell className="w-3 h-3" /> {
                                    new Date(job.deadline).getTime() - new Date().getTime() <= 172800000 
                                    ? 'URGENT' 
                                    : 'TRACKING'
                                  }
                                </div>
                              )}
                            </div>
                            
                            <div className="pt-4 border-t border-white/5 space-y-3">
                              <div className="flex flex-wrap gap-2">
                                <button 
                                  onClick={() => generatePrep(job)}
                                  className="flex-1 bg-white/5 hover:bg-white/10 text-[9px] font-black text-primary border border-white/5 py-2.5 rounded-lg uppercase tracking-wider flex items-center justify-center gap-2"
                                >
                                  <BrainCircuit className="w-3 h-3" /> Interview
                                </button>
                                <button 
                                  onClick={() => generateColdDM(job)}
                                  className="flex-1 bg-white/5 hover:bg-white/10 text-[9px] font-black text-blue-400 border border-white/5 py-2.5 rounded-lg uppercase tracking-wider flex items-center justify-center gap-2"
                                >
                                  <MessageSquareText className="w-3 h-3" /> Cold DM
                                </button>
                                <button 
                                  onClick={() => setActiveStarId(activeStarId === job.job_id ? null : job.job_id)}
                                  className={`flex-1 bg-white/5 hover:bg-white/10 text-[9px] font-black ${activeStarId === job.job_id ? 'text-yellow-400 border-yellow-400/50' : 'text-muted border-white/5'} border py-2.5 rounded-lg uppercase tracking-wider flex items-center justify-center gap-2`}
                                >
                                  <StarIcon className="w-3 h-3" /> STAR Draft
                                </button>
                              </div>

                              <AnimatePresence mode="wait">
                                {activeStarId === job.job_id && !star?.text && !star?.loading && (
                                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="pt-2">
                                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                                      <textarea 
                                        value={starInput}
                                        onChange={(e) => setStarInput(e.target.value)}
                                        placeholder="Project summary..."
                                        className="w-full bg-transparent text-[11px] text-main focus:outline-none resize-none min-h-[60px]"
                                      />
                                      <Button onClick={() => generateStarDraft(job)} className="w-full h-8 bg-yellow-500 hover:bg-yellow-600 text-black text-[9px] font-black rounded-lg mt-2">REWRITE</Button>
                                    </div>
                                  </motion.div>
                                )}
                                {(prep || dm || star) && (
                                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="overflow-hidden">
                                    {star && !star.loading && (
                                      <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20 mt-2">
                                        <div className="text-[8px] font-black text-yellow-500 uppercase mb-2">Tailored STAR Bullet Points</div>
                                        <div className="text-[10px] text-main/80 whitespace-pre-line leading-relaxed max-h-[150px] overflow-y-auto custom-scrollbar">{star.text}</div>
                                      </div>
                                    )}
                                    {prep && !prep.loading && (
                                      <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 mt-2">
                                        <div className="text-[8px] font-black text-primary uppercase mb-2">Practice Questions</div>
                                        <div className="text-[10px] text-main/80 whitespace-pre-line leading-relaxed max-h-[100px] overflow-y-auto custom-scrollbar">{prep.questions}</div>
                                      </div>
                                    )}
                                    {dm && !dm.loading && (
                                      <div className="bg-blue-500/5 rounded-xl p-4 border border-blue-500/10 mt-2">
                                        <div className="text-[8px] font-black text-blue-400 uppercase mb-2">LinkedIn Pitch</div>
                                        <div className="text-[10px] text-main/80 whitespace-pre-line leading-relaxed">{dm.text}</div>
                                      </div>
                                    )}
                                    {(prep?.loading || dm?.loading || star?.loading) && (
                                      <div className="flex items-center justify-center py-4 animate-pulse text-[9px] font-black text-muted uppercase">Generating...</div>
                                    )}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>

                            <div className="pt-4 border-t border-white/5 space-y-3">
                              <div className="text-[9px] font-black text-muted uppercase tracking-[0.2em]">Current Stage</div>
                              <div className="flex flex-wrap gap-2">
                                {statuses.map((s) => {
                                  const Icon = s.icon;
                                  const isActive = (job.status || "Saved") === s.id;
                                  return (
                                    <button
                                      key={s.id}
                                      onClick={() => updateStatus(job.job_id, s.id)}
                                      className={`p-2 rounded-lg border transition-all ${
                                        isActive 
                                        ? `bg-white/10 border-primary shadow-inner` 
                                        : 'bg-white/5 border-white/5 hover:border-white/20'
                                      }`}
                                    >
                                      <Icon className={`w-4 h-4 ${isActive ? s.color : 'text-muted/40'}`} />
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-8 pt-0 mt-auto flex gap-3">
                          <Button asChild className="flex-1 h-12 bg-primary hover:bg-primary/90 text-white font-black text-[10px] tracking-[0.2em] uppercase rounded-xl shadow-lg shadow-primary/20">
                            <a href={job.related_links?.[0]?.link} target="_blank">
                              APPLY NOW <ExternalLink className="w-3 h-3 ml-2" />
                            </a>
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <motion.div 
                {...fadeInUp}
                className="text-center py-32 bg-white/[0.01] rounded-[3rem] border border-dashed border-white/10"
              >
                <Bookmark className="w-12 h-12 text-white/5 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-main mb-2">Queue is empty.</h3>
                <p className="text-muted text-sm max-w-xs mx-auto mb-8">Explore the market pulse to fill your pipeline.</p>
                <Button asChild className="bg-primary hover:bg-primary/90 rounded-xl font-bold px-8 h-12">
                  <Link href="/internships">START HUNTING</Link>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
