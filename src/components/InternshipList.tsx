"use client";
import React, { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

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
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInternships() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/internships?q=internship");
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
  }, []);

  if (loading) return <div className="text-center py-8">Loading internships...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

  let jobsToShow = internships;
  // Apply filters and search
  if (search) {
    const s = search.toLowerCase();
    jobsToShow = jobsToShow.filter(
      (job) =>
        job.title.toLowerCase().includes(s) ||
        job.company_name.toLowerCase().includes(s)
    );
  }
  if (filterLocation) {
    const loc = filterLocation.toLowerCase();
    jobsToShow = jobsToShow.filter((job) => job.location && job.location.toLowerCase().includes(loc));
  }
  if (filterCompany) {
    const comp = filterCompany.toLowerCase();
    jobsToShow = jobsToShow.filter((job) => job.company_name && job.company_name.toLowerCase().includes(comp));
  }
  if (filterTag) {
    const tag = filterTag.toLowerCase();
    jobsToShow = jobsToShow.filter(
      (job) =>
        job.extensions &&
        job.extensions.some((ext) => ext.toLowerCase().includes(tag))
    );
  }
  if (limit) {
    jobsToShow = jobsToShow.slice(0, limit);
  }

  return (
    <>
      {jobsToShow.map((job) => (
        <React.Fragment key={job.job_id}>
          <Card className={cardClassName + " min-w-0"}>
            <div className="flex items-center gap-2 mb-2 min-w-0">
              <span className={clampText ? "font-bold text-lg truncate" : "font-bold text-lg"} title={job.title}>{job.title}</span>
            </div>
            <div className={clampText ? "text-muted text-sm truncate" : "text-muted text-sm"} title={job.company_name}>{job.company_name}</div>
            {/* Show up to 2 tags */}
            {job.extensions && job.extensions.length > 0 && (
              <div className="flex flex-wrap gap-2 my-2">
                {job.extensions.slice(0, 3).map((ext) => (
                  <Badge key={ext} className="bg-accent/10 text-accent border-accent/20">{ext}</Badge>
                ))}
              </div>
            )}
            {minimal ? (
              <>
                {job.description && (
                  <div className="text-sm text-muted line-clamp-4 mb-2" title={job.description}>
                    {job.description}
                  </div>
                )}
                <Button className="mt-2 w-fit" size="sm" onClick={() => setOpenModal(job.job_id)}>
                  Details
                </Button>
              </>
            ) : (
              <>
                <div className="text-xs text-muted mb-2">via {job.via}</div>
                <div className={clampText ? "text-sm line-clamp-4 mb-2 overflow-hidden" : "text-sm mb-2"} title={job.description}>{job.description}</div>
                {job.related_links && job.related_links.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {job.related_links.map((link) => (
                      <a
                        key={link.link}
                        href={link.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline text-xs"
                      >
                        {link.text}
                      </a>
                    ))}
                  </div>
                )}
              </>
            )}
          </Card>
          {/* Modal for details */}
          {minimal && openModal === job.job_id && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-md w-full p-6 relative animate-in fade-in-0 zoom-in-95 max-h-[80vh] overflow-y-auto flex flex-col">
                <button
                  className="absolute top-3 right-3 text-xl text-muted hover:text-red-500"
                  onClick={() => setOpenModal(null)}
                  aria-label="Close"
                >
                  ×
                </button>
                <h2 className="font-bold text-2xl mb-2 break-words">{job.title}</h2>
                <div className="text-muted text-lg mb-2 break-words">{job.company_name}</div>
                <div className="mb-2 text-sm text-muted">Location: {job.location}</div>
                <div className="mb-2 text-sm text-muted">via {job.via}</div>
                {job.extensions && job.extensions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {job.extensions.map((ext) => (
                      <Badge key={ext} className="bg-accent/10 text-accent border-accent/20">{ext}</Badge>
                    ))}
                  </div>
                )}
                <div className="mb-4 text-main text-base whitespace-pre-line break-words">
                  <span className="font-semibold block mb-1">Description:</span>
                  {job.description}
                </div>
                {job.related_links && job.related_links.length > 0 && (
                  <div className="mt-2 flex flex-col gap-2">
                    <span className="font-semibold">Links:</span>
                    <div className="flex flex-wrap gap-2">
                      {job.related_links.map((link) => (
                        <a
                          key={link.link}
                          href={link.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline text-xs"
                        >
                          {link.text}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
    </>
  );
} 