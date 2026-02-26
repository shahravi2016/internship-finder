import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { job_id, status } = await req.json();
    if (!job_id || !status) return NextResponse.json({ error: 'Missing data' }, { status: 400 });

    const client = await clientPromise;
    const db = client.db('internhunt');

    await db.collection('saved_jobs').updateOne(
      { userId, job_id },
      { $set: { status, updatedAt: new Date() } }
    );

    return NextResponse.json({ success: true, status });
  } catch (error: any) {
    console.error('[Status Update API] Error:', error);
    return NextResponse.json({ error: 'Database error', details: error.message }, { status: 500 });
  }
}
