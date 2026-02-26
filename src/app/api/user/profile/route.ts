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
    const profile = await db.collection('user_profiles').findOne({ userId });
    return NextResponse.json(profile || {});
  } catch (error: any) {
    console.error('[Profile API GET] Error:', error);
    return NextResponse.json({ error: 'Database error', details: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const profileData = await req.json();
    const client = await clientPromise;
    const db = client.db('internhunt');

    const result = await db.collection('user_profiles').updateOne(
      { userId },
      { $set: { ...profileData, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('[Profile API GET] Error:', error);
    return NextResponse.json({ error: 'Database error', details: error.message }, { status: 500 });
  }
}
