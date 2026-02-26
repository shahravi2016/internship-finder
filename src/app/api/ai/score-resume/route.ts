import { NextRequest, NextResponse } from 'next/server';
const pdf = require('pdf-parse');

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'Missing API Key' }, { status: 500 });

  try {
    const formData = await req.formData();
    const file = formData.get('resume') as File;
    const jobTitle = formData.get('jobTitle');
    const jobDescription = formData.get('jobDescription');

    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

    // 1. Parse PDF to text
    const buffer = Buffer.from(await file.arrayBuffer());
    const pdfData = await pdf(buffer);
    const resumeText = pdfData.text;

    // 2. Feed to Gemini for Scoring
    const prompt = `
      You are an expert technical recruiter. Score this resume against the job description.
      
      Job Title: ${jobTitle}
      Job Description: ${jobDescription}
      
      Resume Content:
      ${resumeText.substring(0, 4000)} // Truncate to stay safe with context limits
      
      Return ONLY a JSON object with:
      {
        "score": (number 0-100),
        "feedback": "Exactly 2 concise sentences explaining the score and what's missing.",
        "skillGaps": ["skill1", "skill2"]
      }
    `;

    const geminiRes = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      }),
    });

    const data = await geminiRes.json();
    const resultText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    const result = JSON.parse(resultText);

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('[Resume Scorer] Error:', error);
    return NextResponse.json({ error: 'Failed to analyze resume', details: error.message }, { status: 500 });
  }
}
