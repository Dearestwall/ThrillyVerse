import { NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'

export async function POST(req: Request) {
  const { subscription, topics } = await req.json()
  const { endpoint, keys: { p256dh, auth } } = subscription
  await adminClient.from('push_subscriptions').upsert(
    { endpoint, p256dh, auth, topics },
    { onConflict: 'endpoint' }
  )
  return NextResponse.json({ success: true })
}