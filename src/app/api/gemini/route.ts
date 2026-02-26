import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('[Gemini API] Missing GEMINI_API_KEY');
    return NextResponse.json({ error: 'Missing GEMINI_API_KEY in environment variables.' }, { status: 500 });
  }

  let body;
  try {
    body = await req.json();
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { prompt } = body;
  if (!prompt) {
    return NextResponse.json({ error: 'Missing prompt.' }, { status: 400 });
  }

  // Standardize on v1beta for widest model compatibility
  const configs = [
    { model: 'gemini-2.0-flash', version: 'v1beta' },
    { model: 'gemini-1.5-flash', version: 'v1beta' }
  ];
  
  let lastError = null;

  for (const config of configs) {
    try {
      console.log(`[Gemini API] Attempting with ${config.model} (${config.version})...`);
      const geminiRes = await fetch(`https://generativelanguage.googleapis.com/${config.version}/models/${config.model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      });

      const data = await geminiRes.json().catch(() => ({}));

      if (!geminiRes.ok) {
        console.error(`[Gemini API] ${config.model} failed:`, geminiRes.status, data.error?.message || 'Unknown error');
        lastError = data.error || { message: 'HTTP Error ' + geminiRes.status };
        
        // Even if 429, we try the next model configuration in the list
        continue; 
      }

      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      if (!text) {
        console.warn(`[Gemini API] ${config.model} returned empty text. Likely safety filtered.`);
        continue;
      }

      return NextResponse.json({ text });
    } catch (error) {
      console.error(`[Gemini API] ${config.model} exception:`, error);
      lastError = error;
    }
  }

  return NextResponse.json({ 
    error: 'Failed to generate content with Gemini.', 
    details: lastError 
  }, { status: 500 });
} 