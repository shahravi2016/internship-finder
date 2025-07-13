import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing GEMINI_API_KEY in environment variables.' }, { status: 500 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { prompt } = body;
  if (!prompt) {
    return NextResponse.json({ error: 'Missing prompt.' }, { status: 400 });
  }

  try {
    const geminiRes = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });
    if (!geminiRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch from Gemini.' }, { status: 500 });
    }
    const data = await geminiRes.json();
    // Extract the generated text
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return NextResponse.json({ text });
  } catch (error) {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
} 