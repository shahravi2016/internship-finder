"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Helper to generate a match score and reason
function getMatchScoreAndReason(job: any, userSkills: string[], experience: string, year: string) {
  // Simple rule-based: +20 for each matching skill, +10 for experience match, +5 for year match
  let score = 50;
  let matchedSkills = [];
  if (job.description && userSkills.length) {
    for (const skill of userSkills) {
      if (job.description.toLowerCase().includes(skill.toLowerCase())) {
        score += 20;
        matchedSkills.push(skill);
      }
    }
  }
  if (job.extensions && job.extensions.join(" ").toLowerCase().includes(experience.toLowerCase())) {
    score += 10;
  }
  if (year && job.description && job.description.toLowerCase().includes(year.toLowerCase())) {
    score += 5;
  }
  score = Math.min(score, 99);
  const reason = matchedSkills.length
    ? `You know ${matchedSkills.join(", ")}, perfect for their tech stack.`
    : `Your profile matches this role.`;
  return { score, reason };
}

function getResumeSummary(job: any, name: string, skills: string[], year: string) {
  return `As a ${skills.join(", ")} developer${year ? ` in my ${year} year` : ""}, I am excited to contribute to ${job.company_name}'s team.`;
}

function getCoverLetter(job: any, skills: string[], year: string) {
  return `As a ${skills[0] || "motivated"} developer${year ? ` in my ${year} year` : ""}, I’d love to contribute to your ${job.title}.`;
}

function stripMarkdown(text: string): string {
  // Remove code blocks, inline code, bold, italics, links, images, headings, lists, blockquotes
  return text
    .replace(/```[\s\S]*?```/g, "") // code blocks
    .replace(/`([^`]+)`/g, "$1") // inline code
    .replace(/\*\*([^*]+)\*\*/g, "$1") // bold
    .replace(/\*([^*]+)\*/g, "$1") // italics
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // links
    .replace(/!\[([^\]]*)\]\([^\)]+\)/g, "") // images
    .replace(/^#+\s/gm, "") // headings
    .replace(/^>\s/gm, "") // blockquotes
    .replace(/^[-*+]\s/gm, "") // lists
    .replace(/\n{2,}/g, "\n") // extra newlines
    .trim();
}

export default function ResultsPage() {
  const params = useSearchParams();
  const name = params.get("name") || "";
  const skillsString = params.get("skills") || "";
  const skills = useMemo(() => skillsString.split(",").map(s => s.trim()).filter(Boolean), [skillsString]);
  const experience = params.get("experience") || "";
  const year = params.get("year") || "";

  const [internships, setInternships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resumeSummary, setResumeSummary] = useState<string | null>(null);
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [loadingGemini, setLoadingGemini] = useState(false);
  const [search, setSearch] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [whyReasons, setWhyReasons] = useState<{ [jobId: string]: { why: string; loading: boolean } }>({});
  const [coverLetters, setCoverLetters] = useState<{ [jobId: string]: { text: string; loading: boolean } }>({});
  const [summaries, setSummaries] = useState<{ [jobId: string]: { text: string; loading: boolean } }>({});

  React.useEffect(() => {
    async function fetchInternships() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/internships?q=${encodeURIComponent(skills.join(" ") || "internship")}`);
        const data = await res.json();
        if (data.jobs_results && Array.isArray(data.jobs_results)) {
          setInternships(data.jobs_results.slice(0, 5));
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
  }, [skills.join(",")]);

  // Remove duplicate jobs by job_id
  const uniqueInternships = internships.filter((job, idx, arr) =>
    arr.findIndex(j => j.job_id === job.job_id) === idx
  );

  // Filter uniqueInternships based on search/filters
  let filteredInternships = uniqueInternships;
  if (search) {
    const s = search.toLowerCase();
    filteredInternships = filteredInternships.filter(
      (job) =>
        job.title.toLowerCase().includes(s) ||
        job.company_name.toLowerCase().includes(s)
    );
  }
  if (filterLocation) {
    const loc = filterLocation.toLowerCase();
    filteredInternships = filteredInternships.filter((job) => job.location && job.location.toLowerCase().includes(loc));
  }
  if (filterCompany) {
    const comp = filterCompany.toLowerCase();
    filteredInternships = filteredInternships.filter((job) => job.company_name && job.company_name.toLowerCase().includes(comp));
  }
  if (filterTag) {
    const tag = filterTag.toLowerCase();
    filteredInternships = filteredInternships.filter(
      (job) =>
        job.extensions &&
        job.extensions.some((ext: string) => ext.toLowerCase().includes(tag))
    );
  }

  // Auto-generate Gemini 'Why' reason for each job on load
  useEffect(() => {
    filteredInternships.forEach((job) => {
      if (!whyReasons[job.job_id]) {
        setWhyReasons((prev) => ({ ...prev, [job.job_id]: { why: '', loading: true } }));
        const whyPrompt = `In 1-2 lines, explain why a candidate with skills: ${skills.join(", ")} and year: ${year} is a great fit for the role of ${job.title} at ${job.company_name}.`;
        fetch("/api/gemini", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: whyPrompt }),
        })
          .then((res) => res.json())
          .then((data) => {
            setWhyReasons((prev) => ({
              ...prev,
              [job.job_id]: { why: stripMarkdown(data.text || ""), loading: false },
            }));
          });
      }
    });
    // eslint-disable-next-line
  }, [filteredInternships, name, year, experience, skills.join(",")]);

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        {name ? `Hey ${name},` : "Hey there,"} based on your profile, here are the best internships for you.
      </h1>
      {/* Student Profile Summary */}
      <div className="mb-8">
        <div className="bg-card border border-slate-200 dark:border-slate-700 rounded-xl p-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow">
          <div className="flex-1">
            <div className="font-bold text-lg mb-1">Student Profile</div>
            <div className="text-main text-base mb-1">{name || "Anonymous"}</div>
            <div className="text-muted text-sm mb-1">Year: {year || "-"}</div>
            <div className="text-muted text-sm mb-1">Experience: {experience || "-"}</div>
            <div className="flex flex-wrap gap-2 mt-2">
              {skills.map((skill) => (
                <Badge key={skill} className="bg-accent/10 text-accent border-accent/20">{skill}</Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Filters and Search UI */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by title or company..."
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 bg-background text-main focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="text"
          value={filterLocation}
          onChange={e => setFilterLocation(e.target.value)}
          placeholder="Filter by location"
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 bg-background text-main focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="text"
          value={filterCompany}
          onChange={e => setFilterCompany(e.target.value)}
          placeholder="Filter by company"
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 bg-background text-main focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="text"
          value={filterTag}
          onChange={e => setFilterTag(e.target.value)}
          placeholder="Filter by tag"
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 bg-background text-main focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      {loading && <div className="text-center py-8">Loading matches...</div>}
      {error && <div className="text-center text-red-500 py-8">{error}</div>}
      {loadingGemini && (
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded text-blue-900 text-center">
          Generating with Gemini...
        </div>
      )}
      <div className="space-y-8">
        {filteredInternships.map((job, idx) => {
          const { score } = getMatchScoreAndReason(job, skills, experience, year);
          const whyObj = whyReasons[job.job_id] || { why: '', loading: true };
          const coverObj = coverLetters[job.job_id] || { text: '', loading: false };
          const summaryObj = summaries[job.job_id] || { text: '', loading: false };
          return (
            <div key={job.job_id}>
              <Card className="p-6 flex flex-col gap-2 shadow-md">
                <div className="flex items-center gap-4 mb-2">
                  {/* Placeholder logo */}
                  <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-xl font-bold text-slate-500">
                    {job.company_name?.[0] || "🏢"}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-lg truncate" title={job.title}>{job.title}</div>
                    <div className="text-muted text-sm truncate" title={job.company_name}>{job.company_name}</div>
                  </div>
                  <Badge className="ml-auto bg-green-100 text-green-700 border-green-200">{score}% match</Badge>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {skills.map(skill => (
                    <Badge key={skill} className="bg-accent/10 text-accent border-accent/20">{skill}</Badge>
                  ))}
                </div>
                {/* Show job description first, then WHY reason */}
                {job.description && (
                  <div className="text-sm mb-2 line-clamp-4 overflow-hidden" title={job.description}>{job.description}</div>
                )}
                <div className="text-xs text-muted mb-2 line-clamp-2 overflow-hidden">Why:&nbsp;
                  {whyObj.loading ? "Generating why this fits..." : whyObj.why}
                </div>
                {/* Buttons for Cover Letter, Resume Summary, Details, Apply */}
                <div className="flex gap-2 mt-2 flex-wrap items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      setCoverLetters((prev) => ({ ...prev, [job.job_id]: { text: '', loading: true } }));
                      const prompt = `Write a concise, professional 1-paragraph cover letter for a candidate named ${name || "the user"} applying for the role of ${job.title} at ${job.company_name}. Skills: ${skills.join(", ")}. Year: ${year}.`;
                      const res = await fetch("/api/gemini", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ prompt }),
                      });
                      const data = await res.json();
                      setCoverLetters((prev) => ({ ...prev, [job.job_id]: { text: stripMarkdown(data.text || ""), loading: false } }));
                    }}
                  >
                    Cover Letter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      setSummaries((prev) => ({ ...prev, [job.job_id]: { text: '', loading: true } }));
                      const prompt = `Write a concise, professional 1-paragraph resume summary for a candidate named ${name || "the user"} applying for the role of ${job.title} at ${job.company_name}. Skills: ${skills.join(", ")}. Year: ${year}.`;
                      const res = await fetch("/api/gemini", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ prompt }),
                      });
                      const data = await res.json();
                      setSummaries((prev) => ({ ...prev, [job.job_id]: { text: stripMarkdown(data.text || ""), loading: false } }));
                    }}
                  >
                    Resume Summary
                  </Button>
                  <Button
                    variant="secondary"
                    type="button"
                    className="ml-auto"
                    onClick={() => setOpenModal(job.job_id)}
                  >
                    Details
                  </Button>
                  {job.related_links && job.related_links.length > 0 && (
                    <a
                      href={job.related_links[0].link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" type="button">
                        Apply
                      </Button>
                    </a>
                  )}
                </div>
                {/* Show Gemini responses below buttons */}
                {coverObj.loading && <div className="text-blue-500 text-sm mt-2">Generating cover letter...</div>}
                {coverObj.text && !coverObj.loading && (
                  <div className="mb-1 text-main text-sm mt-2"><span className="font-semibold">Cover Letter:</span> {coverObj.text}</div>
                )}
                {summaryObj.loading && <div className="text-blue-500 text-sm mt-2">Generating resume summary...</div>}
                {summaryObj.text && !summaryObj.loading && (
                  <div className="mb-1 text-main text-sm mt-2"><span className="font-semibold">Resume Summary:</span> {summaryObj.text}</div>
                )}
              </Card>
              {/* Modal for details */}
              {openModal === job.job_id && (
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
                        {job.extensions.map((ext: string) => (
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
                          {job.related_links.map((link: { link: string; text: string }) => (
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
            </div>
          );
        })}
      </div>
      {resumeSummary && (
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded text-blue-900">
          <strong>Resume Summary:</strong> {resumeSummary}
        </div>
      )}
      {coverLetter && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded text-green-900">
          <strong>Cover Letter:</strong> {coverLetter}
        </div>
      )}
    </div>
  );
} 