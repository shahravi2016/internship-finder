import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const client = await clientPromise;
    const db = client.db('internhunt');
    const savedJobs = await db.collection('saved_jobs').find({ userId }).toArray();
    return NextResponse.json(savedJobs);
  } catch (error: any) {
    console.error('[Saved Jobs API] Error:', error);
    return NextResponse.json({ error: 'Database error', details: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const job = await req.json();
    const client = await clientPromise;
    const db = client.db('internhunt');

    // Check if already saved
    const existing = await db.collection('saved_jobs').findOne({ userId, job_id: job.job_id });

    if (existing) {
      // Toggle off: Unsave
      await db.collection('saved_jobs').deleteOne({ userId, job_id: job.job_id });
      return NextResponse.json({ message: 'Unsaved', saved: false });
    } else {
      // Toggle on: Save
      await db.collection('saved_jobs').insertOne({
        userId,
        ...job,
        savedAt: new Date()
      });
      return NextResponse.json({ message: 'Saved', saved: true });
    }
  } catch (error: any) {
    console.error('[Saved Jobs API] Error:', error);
    return NextResponse.json({ error: 'Database error', details: error.message }, { status: 500 });
  }
}
