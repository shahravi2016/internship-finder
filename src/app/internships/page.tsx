"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import InternshipList from "@/components/InternshipList";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const experienceLevels = ["Beginner", "Intermediate", "Advanced"];
const years = ["2nd", "3rd", "final"];

export default function InternshipFormPage() {
  const [name, setName] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [year, setYear] = useState("");
  const [search, setSearch] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Pass form data as query params for /results
    const params = new URLSearchParams({
      ...(name && { name }),
      skills,
      experience,
      year,
    });
    router.push(`/results?${params.toString()}`);
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <Card className="p-8 mb-10 shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Find Internships</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Name (optional)</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 bg-background text-main focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Your name (optional)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Skills <span className="text-muted">(comma-separated, e.g. React, Python)</span></label>
              <input
                type="text"
                value={skills}
                onChange={e => setSkills(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 bg-background text-main focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="React, Python, ..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Experience Level</label>
              <select
                value={experience}
                onChange={e => setExperience(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 bg-background text-main focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="" disabled>Select experience</option>
                {experienceLevels.map(lvl => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Year</label>
              <select
                value={year}
                onChange={e => setYear(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 bg-background text-main focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="" disabled>Select year</option>
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
          <Button type="submit" className="w-full text-lg mt-4">Find Internships</Button>
        </form>
      </Card>
      <div>
        <h2 className="text-xl font-semibold mb-4 text-center">New Internship Opportunities</h2>
        <p className="text-center text-muted mb-6 max-w-2xl mx-auto">
          Browse and filter the latest internship opportunities tailored for students. Use the search and filters below to find roles that match your skills, interests, and preferred locations. Click 'Details' on any card to view more information about the internship.
        </p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InternshipList
            limit={6}
            cardClassName="min-h-[220px] p-6 flex flex-col gap-2 shadow-md overflow-hidden"
            clampText
            minimal
            search={search}
            filterLocation={filterLocation}
            filterCompany={filterCompany}
            filterTag={filterTag}
          />
        </div>
      </div>
    </div>
  );
} 