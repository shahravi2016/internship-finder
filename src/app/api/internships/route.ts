import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q') || 'internship';
  const apiKey = process.env.SERPAPI_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'Missing SERPAPI_KEY in environment variables.' }, { status: 500 });
  }

  const serpApiUrl = `https://serpapi.com/search.json?engine=google_jobs&q=${encodeURIComponent(query)}&api_key=${apiKey}`;

  try {
    const res = await fetch(serpApiUrl);
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch from SerpAPI.' }, { status: 500 });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
} 