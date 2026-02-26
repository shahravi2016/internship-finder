"use client";
import React, { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { MapPin, Building2, ExternalLink, Globe2, Bookmark, BookmarkCheck } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { formatJobExtension } from "@/lib/utils";

interface Internship {
  title: string;
  company_name: string;
  location: string;
  via: string;
  description: string;
  extensions?: string[];
  job_id: string;
  job_highlights?: { [key: string]: string[] }[];
  related_links?: { link: string; text: string }[];
  detected_extensions?: Record<string, string>;
  savedAt?: Date;
}

interface InternshipListProps {
  limit?: number;
  cardClassName?: string;
  clampText?: boolean;
  minimal?: boolean;
  search?: string;
  filterLocation?: string;
  filterCompany?: string;
  filterTag?: string;
}

export default function InternshipList({
  limit,
  cardClassName = "",
  clampText = false,
  minimal = false,
  search = "",
  filterLocation = "",
  filterCompany = "",
  filterTag = "",
}: InternshipListProps) {
  const { userId } = useAuth();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetch('/api/user/saved-jobs')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setSavedJobIds(new Set(data.map(j => j.job_id)));
          }
        });
    }
  }, [userId]);

  const toggleSave = async (job: Internship) => {
    if (!userId) {
      alert("Please sign in to save jobs.");
      return;
    }

    try {
      const res = await fetch('/api/user/saved-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job)
      });
      const data = await res.json();
      
      setSavedJobIds(prev => {
        const next = new Set(prev);
        if (data.saved) next.add(job.job_id);
        else next.delete(job.job_id);
        return next;
      });
    } catch (e) {
      console.error("Save failed");
    }
  };

  useEffect(() => {
    async function fetchInternships() {
      setLoading(true);
      setError(null);
      try {
        let query = search || "internship";
        if (filterTag) query += ` ${filterTag}`;
        if (filterLocation) query += ` ${filterLocation}`;
        if (filterCompany) query += ` ${filterCompany}`;
        const res = await fetch(`/api/internships?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.jobs_results && Array.isArray(data.jobs_results)) {
          setInternships(data.jobs_results);
        } else {
          setError("No internships found.");
        }
      } catch (e) {
        setError("Failed to fetch internships.");
      } finally {
        setLoading(false);
      }
    }
    fetchInternships();
  }, [search, filterLocation, filterCompany, filterTag]);

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-[280px] bg-white/5 border border-white/5 rounded-2xl animate-pulse" />
      ))}
    </div>
  );
  
  if (error) return <div className="text-center text-warning p-8 bg-warning/5 rounded-2xl border border-warning/10">{error}</div>;

  let jobsToShow = internships;
  if (limit) {
    jobsToShow = jobsToShow.slice(0, limit);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {jobsToShow.map((job) => (
        <React.Fragment key={job.job_id}>
          <Card className={`relative overflow-hidden bg-white/[0.03] border-white/5 rounded-[2rem] hover:border-primary/20 transition-all group flex flex-col h-full shadow-2xl ${cardClassName}`}>
            {/* 1. Header Section */}
            <div className="p-8 border-b border-white/5 bg-white/[0.01]">
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-2xl font-black text-primary group-hover:scale-110 transition-all duration-500">
                  {job.company_name?.[0] || "🏢"}
                </div>
                <div className="flex items-start gap-3">
                  <button 
                    onClick={() => toggleSave(job)}
                    className="p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                  >
                    {savedJobIds.has(job.job_id) ? (
                      <BookmarkCheck className="w-4 h-4 text-primary" />
                    ) : (
                      <Bookmark className="w-4 h-4 text-muted" />
                    )}
                  </button>
                  <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1 font-bold rounded-lg text-[9px] tracking-widest uppercase">
                    ACTIVE
                  </Badge>
                </div>
              </div>
              <h3 className="font-bold text-xl text-main leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2" title={job.title}>
                {job.title}
              </h3>
              <div className="flex items-center gap-2 text-muted font-bold text-[10px] uppercase tracking-widest mb-4">
                <Building2 className="w-3 h-3 text-primary/60" />
                {job.company_name}
              </div>
              <div className="flex items-center gap-4 text-[10px] font-bold text-muted/60 uppercase tracking-tight">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-primary/40" />
                  {job.location || "Remote"}
                </div>
                <div className="flex items-center gap-1.5">
                  <Globe2 className="w-3 h-3 text-primary/40" />
                  {job.via?.split(' ').slice(-1)[0]}
                </div>
              </div>
            </div>

            {/* 2. Content Section */}
            <div className="p-8 space-y-6 flex-1 flex flex-col">
              <div className="bg-white/5 rounded-2xl p-5 border border-white/5 flex-1 max-h-[160px] overflow-y-auto custom-scrollbar">
                <div className="text-[9px] font-black text-primary uppercase tracking-widest mb-3">Overview</div>
                <p className="text-xs text-muted leading-relaxed line-clamp-4 font-medium">
                  {job.description}
                </p>
              </div>

              {/* Tags */}
              {job.extensions && job.extensions.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {job.extensions.slice(0, 3).map((ext) => (
                    <Badge key={ext} className="bg-white/5 text-muted border-white/5 px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-tighter">
                      {formatJobExtension(ext, job.location)}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Action Section */}
            <div className="p-8 pt-0 mt-auto flex gap-3">
              <Button 
                className="flex-1 h-12 bg-white/5 hover:bg-white/10 text-main border border-white/10 font-black text-[10px] tracking-[0.2em] uppercase rounded-xl transition-all"
                onClick={() => setOpenModal(job.job_id)}
              >
                Details
              </Button>
              <Button 
                asChild
                className="flex-1 h-12 bg-primary hover:bg-primary/90 text-white font-black text-[10px] tracking-[0.2em] uppercase rounded-xl shadow-lg shadow-primary/20"
              >
                <a 
                  href={job.related_links?.[0]?.link || `https://www.google.com/search?q=${encodeURIComponent(job.title + " " + job.company_name)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Apply Now
                </a>
              </Button>
            </div>
          </Card>

          {/* Premium Modal */}
          {openModal === job.job_id && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-surface/80 backdrop-blur-xl p-4 animate-in fade-in duration-300">
              <div className="bg-surface border border-white/10 rounded-[2.5rem] shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                <div className="p-10 border-b border-white/5 flex justify-between items-start">
                  <div>
                    <h2 className="font-black text-4xl text-main leading-none mb-3 tracking-tighter">{job.title}</h2>
                    <p className="text-primary font-bold text-lg flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      {job.company_name}
                    </p>
                  </div>
                  <button
                    className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-muted hover:text-main text-2xl transition-all hover:bg-white/10"
                    onClick={() => setOpenModal(null)}
                  >
                    ×
                  </button>
                </div>
                
                <div className="p-10 overflow-y-auto custom-scrollbar flex-1 space-y-10">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Location</div>
                      <div className="text-main font-bold">{job.location || "Not Specified"}</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Source</div>
                      <div className="text-main font-bold">{job.via}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6">Professional Requirements</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.extensions?.map((ext) => (
                        <Badge key={ext} className="bg-white/5 text-main/80 border-white/5 px-4 py-1.5 rounded-lg text-xs font-bold">
                          {ext}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6">Opportunity Description</h4>
                    <div className="text-main/70 text-base leading-relaxed whitespace-pre-line font-medium">
                      {job.description}
                    </div>
                  </div>

                  {job.related_links && job.related_links.length > 0 && (
                    <div className="pt-6 border-t border-white/5">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6">Application Portals</h4>
                      <div className="flex flex-wrap gap-4">
                        {job.related_links.map((link) => (
                          <a
                            key={link.link}
                            href={link.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl text-xs font-black tracking-widest flex items-center gap-3 transition-all shadow-xl shadow-primary/20"
                          >
                            <ExternalLink className="w-4 h-4" />
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
        </React.Fragment>
      ))}
    </div>
  );
}
