"use client";
import React, { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  Brain, 
  Sparkles, 
  Briefcase, 
  Zap, 
  Star, 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  Linkedin,
  MessageSquareText
} from "lucide-react";
import { motion } from "framer-motion";
import { formatJobExtension } from "@/lib/utils";

// Helper to generate a match score and reason
function getMatchScoreAndReason(
  job: any, 
  userSkills: string[], 
  experience: string, 
  year: string,
  preferredRole: string
) {
  let score = 40; // Base score
  let matchedSkills = [];
  
  const description = (job.description || "").toLowerCase();
  const title = (job.title || "").toLowerCase();

  if (userSkills.length) {
    for (const skill of userSkills) {
      if (description.includes(skill.toLowerCase())) {
        score += 15;
        matchedSkills.push(skill);
      }
    }
  }

  if (preferredRole && (title.includes(preferredRole.toLowerCase()) || description.includes(preferredRole.toLowerCase()))) {
    score += 20;
  }

  if (job.extensions && job.extensions.join(" ").toLowerCase().includes(experience.toLowerCase())) {
    score += 10;
  }

  if (year && description.includes(year.toLowerCase())) {
    score += 5;
  }

  score = Math.min(score, 99);
  return { score };
}

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

function ResultsContent() {
  const params = useSearchParams();
  
  const name = params.get("name") || "";
  const college = params.get("college") || "";
  const major = params.get("major") || "";
  const skillsString = params.get("skills") || "";
  const skills = useMemo(() => skillsString.split(",").map(s => s.trim()).filter(Boolean), [skillsString]);
  const experience = params.get("experience") || "";
  const year = params.get("year") || "";
  const preferredRole = params.get("preferredRole") || "";
  const preferredLocation = params.get("preferredLocation") || "";

  const [internships, setInternships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [whyReasons, setWhyReasons] = useState<{ [jobId: string]: { why: string; loading: boolean } }>({});
  const [coverLetters, setCoverLetters] = useState<{ [jobId: string]: { text: string; loading: boolean } }>({});
  const [summaries, setSummaries] = useState<{ [jobId: string]: { text: string; loading: boolean } }>({});
  const [coldDMs, setColdDMs] = useState<{ [jobId: string]: { text: string; loading: boolean } }>({});
  
  // Phase 3 States
  const [resumeScores, setResumeScores] = useState<{ [jobId: string]: { score: number; feedback: string; loading: boolean } }>({});

  const skillsJoined = skills.join(",");
  
  useEffect(() => {
    async function fetchInternships() {
      setLoading(true);
      setError(null);
      try {
        const query = `${preferredRole} ${skills.slice(0, 3).join(" ")} internship ${preferredLocation}`.trim();
        const res = await fetch(`/api/internships?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.jobs_results && Array.isArray(data.jobs_results)) {
          setInternships(data.jobs_results.slice(0, 6));
        } else {
          setError("No internships found matching your specific criteria.");
        }
      } catch (e) {
        setError("Failed to fetch internships.");
      } finally {
        setLoading(false);
      }
    }
    fetchInternships();
    // eslint-disable-next-line
  }, [skillsJoined, preferredRole, preferredLocation]);

  const uniqueInternships = internships.filter((job, idx, arr) =>
    arr.findIndex(j => j.job_id === job.job_id) === idx
  );

  useEffect(() => {
    async function generateReasons() {
      for (const job of uniqueInternships) {
        if (!whyReasons[job.job_id]) {
          setWhyReasons((prev) => ({ ...prev, [job.job_id]: { why: '', loading: true } }));
          
          const whyPrompt = `
            Candidate Profile:
            - Name: ${name || "User"}
            - College: ${college}
            - Major: ${major}
            - Skills: ${skills.join(", ")}
            - Experience: ${experience}
            - Current Year: ${year}
            - Target Role: ${preferredRole}
            
            Job: ${job.title} at ${job.company_name}
            
            In 1-2 concise lines, explain exactly why this specific candidate is a high-signal fit for this role.
          `;

          try {
            const res = await fetch("/api/gemini", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ prompt: whyPrompt }),
            });
            const data = await res.json();
            
            if (res.status === 429) {
              setWhyReasons((prev) => ({ ...prev, [job.job_id]: { why: "Rate limit hit. Retrying...", loading: false } }));
              await new Promise(r => setTimeout(r, 5000));
              continue;
            }

            setWhyReasons((prev) => ({
              ...prev,
              [job.job_id]: { why: data.error ? `Error: ${data.details?.message}` : stripMarkdown(data.text || ""), loading: false },
            }));
            await new Promise(r => setTimeout(r, 3500));
          } catch (err) { console.error(err); }
        }
      }
    }
    if (uniqueInternships.length > 0) generateReasons();
    // eslint-disable-next-line
  }, [uniqueInternships, name, college, major, year, experience, preferredRole, skillsJoined]);

  // Phase 3: Resume Upload Handler
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>, job: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResumeScores(prev => ({ ...prev, [job.job_id]: { score: 0, feedback: "", loading: true } }));

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobTitle", job.title);
    formData.append("jobDescription", job.description);

    try {
      const res = await fetch("/api/ai/score-resume", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      setResumeScores(prev => ({
        ...prev,
        [job.job_id]: { 
          score: data.score || 0, 
          feedback: data.feedback || "Analysis complete.", 
          loading: false 
        }
      }));
    } catch (err) {
      setResumeScores(prev => ({ ...prev, [job.job_id]: { score: 0, feedback: "Failed to analyze resume.", loading: false } }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-black mb-8 text-center text-main tracking-tighter">
        {name ? `Recommended for ${name}` : "Your Personalized Matches"}
      </h1>
      
      {/* Student Profile Summary */}
      <div className="mb-12">
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <GraduationCap className="w-24 h-24" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start justify-between">
            <div className="space-y-4 flex-1">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">Student Identity</div>
                <div className="text-3xl font-black text-main">{name || "Verified Talent"}</div>
                <div className="text-muted font-bold text-sm mt-1">{college} • {major}</div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/5">
                <div>
                  <div className="text-[9px] font-bold text-muted uppercase tracking-widest">Target</div>
                  <div className="text-xs font-bold text-main">{preferredRole}</div>
                </div>
                <div>
                  <div className="text-[9px] font-bold text-muted uppercase tracking-widest">Level</div>
                  <div className="text-xs font-bold text-main">{experience}</div>
                </div>
                <div>
                  <div className="text-[9px] font-bold text-muted uppercase tracking-widest">Status</div>
                  <div className="text-xs font-bold text-main">{year}</div>
                </div>
                <div>
                  <div className="text-[9px] font-bold text-muted uppercase tracking-widest">Loc</div>
                  <div className="text-xs font-bold text-main">{preferredLocation}</div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 max-w-xs justify-end">
              {skills.map((skill) => (
                <Badge key={skill} className="bg-primary/10 text-primary border-primary/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6" />
          <p className="text-muted font-bold tracking-[0.2em] uppercase text-xs animate-pulse">Running Neural Match Engine...</p>
        </div>
      )}
      
      {error && (
        <div className="text-center text-warning p-10 bg-warning/5 rounded-[2rem] border border-warning/10 font-bold">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-8">
        {uniqueInternships.map((job) => {
          const { score } = getMatchScoreAndReason(job, skills, experience, year, preferredRole);
          const whyObj = whyReasons[job.job_id] || { why: '', loading: true };
          const coverObj = coverLetters[job.job_id] || { text: '', loading: false };
          const summaryObj = summaries[job.job_id] || { text: '', loading: false };
          const dmObj = coldDMs[job.job_id] || { text: '', loading: false };
          const resumeObj = resumeScores[job.job_id];
          
          return (
            <div key={job.job_id}>
              <Card className="bg-white/[0.03] border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col group transition-all hover:border-primary/20">
                {/* 1. Header Section */}
                <div className="p-8 md:p-10 border-b border-white/5 flex flex-col md:flex-row items-start justify-between gap-6 bg-white/[0.01]">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl font-black text-primary group-hover:scale-110 transition-transform">
                      {job.company_name?.[0] || "🏢"}
                    </div>
                    <div>
                      <h3 className="font-black text-2xl text-main tracking-tight mb-1">{job.title}</h3>
                      <p className="text-muted font-bold text-sm flex items-center gap-2">
                        {job.company_name} <span className="text-primary/40">•</span> {job.location || "Remote"}
                      </p>
                    </div>
                  </div>
                  <div className="bg-primary/5 border border-primary/20 px-6 py-3 rounded-2xl flex flex-col items-center">
                    <div className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">Match Accuracy</div>
                    <div className="text-2xl font-black text-main">{score}%</div>
                  </div>
                </div>

                <div className="p-8 md:p-10 space-y-8">
                  {/* 2. AI Intelligence Section */}
                  <div className="relative">
                    <div className="bg-[#0F172A] rounded-3xl p-6 border border-primary/10 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12">
                        <Brain className="w-16 h-16 text-primary" />
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Neural Fit Analysis</span>
                      </div>
                      <p className="text-base text-main/90 leading-relaxed italic font-medium relative z-10">
                        {whyObj.loading ? "Synthesizing profile alignment..." : `"${whyObj.why}"`}
                      </p>
                    </div>
                  </div>

                  {/* 3. Job Description Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 px-2 text-muted">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Opportunity Overview</span>
                    </div>
                    <div className="bg-white/5 rounded-3xl p-6 border border-white/5 max-h-[200px] overflow-y-auto custom-scrollbar">
                      <p className="text-sm text-muted leading-relaxed whitespace-pre-line">
                        {job.description}
                      </p>
                    </div>
                  </div>

                  {/* Resume Score Results */}
                  {resumeObj && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`p-6 rounded-3xl border ${resumeObj.score > 70 ? 'bg-green-500/5 border-green-500/20' : 'bg-accent/5 border-accent/20'}`}
                    >
                      {resumeObj.loading ? (
                        <div className="flex items-center gap-3 animate-pulse">
                          <FileText className="w-5 h-5 text-primary" />
                          <span className="text-xs font-bold uppercase tracking-widest text-primary">Parsing & Scoring Resume...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-main">Resume Score</span>
                            </div>
                            <div className="text-2xl font-black text-main">{resumeObj.score}/100</div>
                          </div>
                          <p className="text-sm text-muted leading-relaxed">{resumeObj.feedback}</p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* 4. Technical Metadata */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {job.extensions?.slice(0, 6).map((ext: string) => (
                      <Badge key={ext} className="bg-white/5 text-muted border-white/5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tight">
                        {formatJobExtension(ext, job.location)}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* 5. Actions & Tooling Section */}
                <div className="p-8 md:p-10 bg-white/[0.01] border-t border-white/5 mt-auto">
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-wrap gap-3 items-center">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          className="h-10 bg-primary/5 border-primary/20 text-primary hover:bg-primary hover:text-white px-4 rounded-xl text-[9px] font-black tracking-widest uppercase transition-all flex items-center gap-2"
                          onClick={async () => {
                            setCoverLetters((prev) => ({ ...prev, [job.job_id]: { text: '', loading: true } }));
                            const prompt = `Write a professional 1-paragraph cover letter for ${name || "a student"} from ${college} (${major}). They are applying for ${job.title} at ${job.company_name}. Skills: ${skills.join(", ")}.`;
                            const res = await fetch("/api/gemini", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt }) });
                            const data = await res.json();
                            setCoverLetters((prev) => ({ ...prev, [job.job_id]: { text: stripMarkdown(data.text || ""), loading: false } }));
                          }}
                        >
                          <Zap className="w-3 h-3" /> Draft Letter
                        </Button>
                        <Button
                          variant="outline"
                          className="h-10 bg-primary/5 border-primary/20 text-primary hover:bg-primary hover:text-white px-4 rounded-xl text-[9px] font-black tracking-widest uppercase transition-all flex items-center gap-2"
                          onClick={async () => {
                            setSummaries((prev) => ({ ...prev, [job.job_id]: { text: '', loading: true } }));
                            const prompt = `Write a high-impact 2-sentence resume summary for ${name} at ${college}. Fit for ${job.title} at ${job.company_name}.`;
                            const res = await fetch("/api/gemini", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt }) });
                            const data = await res.json();
                            setSummaries((prev) => ({ ...prev, [job.job_id]: { text: stripMarkdown(data.text || ""), loading: false } }));
                          }}
                        >
                          <Star className="w-3 h-3" /> Resume Tips
                        </Button>
                        <Button
                          variant="outline"
                          className="h-10 bg-blue-500/5 border-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white px-4 rounded-xl text-[9px] font-black tracking-widest uppercase transition-all flex items-center gap-2"
                          onClick={async () => {
                            setColdDMs((prev) => ({ ...prev, [job.job_id]: { text: '', loading: true } }));
                            const prompt = `Generate a 3-sentence high-impact LinkedIn Cold DM for a student (${name}, ${major}) reaching out to a recruiter at ${job.company_name} for the ${job.title} role.`;
                            const res = await fetch("/api/gemini", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt }) });
                            const data = await res.json();
                            setColdDMs((prev) => ({ ...prev, [job.job_id]: { text: stripMarkdown(data.text || ""), loading: false } }));
                          }}
                        >
                          <MessageSquareText className="w-3 h-3" /> Cold DM
                        </Button>
                      </div>

                      <div className="h-4 w-px bg-white/10 hidden md:block" />

                      <div className="flex flex-wrap gap-2">
                        <div className="relative">
                          <input type="file" id={`resume-upload-${job.job_id}`} className="hidden" accept=".pdf" onChange={(e) => handleResumeUpload(e, job)} />
                          <Button
                            variant="outline"
                            className="h-10 bg-accent/5 border-accent/20 text-accent hover:bg-accent hover:text-white px-4 rounded-xl text-[9px] font-black tracking-widest uppercase flex items-center gap-2"
                            onClick={() => document.getElementById(`resume-upload-${job.job_id}`)?.click()}
                          >
                            <FileText className="w-3 h-3" /> Score Resume
                          </Button>
                        </div>
                        <Button
                          variant="outline"
                          asChild
                          className="h-10 bg-blue-600/10 border-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white px-4 rounded-xl text-[9px] font-black tracking-widest uppercase flex items-center gap-2"
                        >
                          <a href={`https://www.linkedin.com/search/results/people/?keywords=Hiring%20Manager%20${encodeURIComponent(job.company_name)}`} target="_blank">
                            <Linkedin className="w-3 h-3" /> Find Recruiters
                          </a>
                        </Button>
                      </div>

                      <div className="flex gap-2 ml-auto">
                        <Button
                          variant="outline"
                          className="h-10 border-white/10 text-main hover:bg-white/5 px-6 rounded-xl text-[9px] font-black tracking-widest uppercase"
                          onClick={() => setOpenModal(job.job_id)}
                        >
                          Details
                        </Button>
                        {job.related_links?.[0] && (
                          <Button
                            asChild
                            className="h-10 bg-primary hover:bg-primary/90 text-white border-none px-6 rounded-xl font-black text-[9px] tracking-widest uppercase shadow-lg shadow-primary/20"
                          >
                            <a href={job.related_links[0].link} target="_blank" rel="noopener noreferrer">
                              Apply <ExternalLink className="w-3 h-3 ml-2" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* AI Output Containers */}
                    {(coverObj.text || summaryObj.text || dmObj.text || coverObj.loading || summaryObj.loading || dmObj.loading) && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        {dmObj.loading && <div className="text-blue-400 text-[8px] font-black tracking-widest animate-pulse uppercase">Drafting Cold DM...</div>}
                        {dmObj.text && !dmObj.loading && (
                          <div className="bg-blue-500/5 rounded-2xl p-5 border border-blue-500/10">
                            <span className="text-[8px] font-black uppercase text-blue-400 block mb-2 tracking-widest">LinkedIn Networking Message</span>
                            <p className="text-xs text-main/80 leading-relaxed font-medium">{dmObj.text}</p>
                          </div>
                        )}
                        {coverObj.text && !coverObj.loading && (
                          <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10">
                            <span className="text-[8px] font-black uppercase text-primary block mb-2 tracking-widest">Generated Cover Letter</span>
                            <p className="text-xs text-main/80 leading-relaxed font-medium">{coverObj.text}</p>
                          </div>
                        )}
                        {summaryObj.text && !summaryObj.loading && (
                          <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                            <span className="text-[8px] font-black uppercase text-primary block mb-2 tracking-widest">Professional Summary</span>
                            <p className="text-xs text-main/80 leading-relaxed font-medium">{summaryObj.text}</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Modal for Details */}
              {openModal === job.job_id && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-surface/80 backdrop-blur-2xl p-4 animate-in fade-in duration-300">
                  <div className="bg-surface border border-white/10 rounded-[3rem] shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                    <div className="p-12 border-b border-white/5 flex justify-between items-start">
                      <div>
                        <h2 className="font-black text-4xl text-main leading-none mb-3 tracking-tighter">{job.title}</h2>
                        <p className="text-primary font-bold text-xl">{job.company_name}</p>
                      </div>
                      <button
                        className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-muted hover:text-main text-3xl transition-all hover:bg-white/10"
                        onClick={() => setOpenModal(null)}
                      >
                        ×
                      </button>
                    </div>
                    
                    <div className="p-12 overflow-y-auto custom-scrollbar flex-1 space-y-12">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                          <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Location</div>
                          <div className="text-main font-bold">{job.location || "Flexible"}</div>
                        </div>
                        <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                          <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Source</div>
                          <div className="text-main font-bold">{job.via}</div>
                        </div>
                        <div className="bg-white/5 p-5 rounded-2xl border border-white/5 col-span-2 md:col-span-1">
                          <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Fit Type</div>
                          <div className="text-main font-bold">{score}% Match</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6">Expertise Detected</h4>
                        <div className="flex flex-wrap gap-2">
                          {job.extensions?.map((ext: string) => (
                            <Badge key={ext} className="bg-white/5 text-main/90 border-white/5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-tight">
                              {ext}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6">Opportunity Insights</h4>
                        <div className="text-main/70 text-base leading-relaxed whitespace-pre-line font-medium">
                          {job.description}
                        </div>
                      </div>

                      {job.related_links && job.related_links.length > 0 && (
                        <div className="pt-8 border-t border-white/5">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-8">Secure Application Gateways</h4>
                          <div className="flex flex-wrap gap-4">
                            {job.related_links.map((link: { link: string; text: string }) => (
                              <a
                                key={link.link}
                                href={link.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-primary hover:bg-primary/90 text-white px-10 py-5 rounded-[2rem] text-xs font-black tracking-[0.2em] flex items-center gap-3 transition-all shadow-2xl shadow-primary/30"
                              >
                                {link.text.toUpperCase()}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-6 animate-pulse">
          <div className="w-20 h-20 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
          <p className="text-muted font-black tracking-[0.3em] uppercase text-xs">Calibrating Matches...</p>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
