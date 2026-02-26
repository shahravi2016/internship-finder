import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });

  const signature = req.headers.get('x-razorpay-signature');
  const body = await req.text();

  // 1. Verify Signature
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  if (signature !== expectedSignature) {
    console.error('[Razorpay Webhook] Invalid signature');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // 2. Parse Event
  const event = JSON.parse(body);
  console.log('[Razorpay Webhook] Received event:', event.event);

  if (event.event === 'order.paid') {
    const { userId } = event.payload.order.entity.notes;
    
    if (userId) {
      try {
        const client = await clientPromise;
        const db = client.db('internhunt');
        
        // Update user to PRO status
        await db.collection('user_profiles').updateOne(
          { userId },
          { $set: { isPro: true, proUpdatedAt: new Date() } },
          { upsert: true }
        );
        
        console.log(`[Razorpay Webhook] User ${userId} upgraded to PRO`);
      } catch (err) {
        console.error('[Razorpay Webhook] DB Update Error:', err);
        return NextResponse.json({ error: 'DB Update Failed' }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ success: true });
}
