import { NextResponse } from 'next/server'
import webpush from 'web-push'
import { adminClient } from '@/lib/supabase/admin'

webpush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export async function POST(req: Request) {
  if (req.headers.get('x-admin-secret') !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { title, body, url = '/', topic = 'all' } = await req.json()
  const { data: subs } = await adminClient.from('push_subscriptions').select('*').contains('topics', [topic])
  if (!subs?.length) return NextResponse.json({ sent: 0 })

  const payload = JSON.stringify({ title, body, url, icon: '/logo-192.png' })
  const results = await Promise.allSettled(
    subs.map(sub => webpush.sendNotification(
      { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
      payload
    ))
  )
  const expired = results
    .map((r, i) => ({ r, sub: subs[i] }))
    .filter(({ r }) => r.status === 'rejected' && (r.reason as any)?.statusCode === 410)
    .map(({ sub }) => sub.endpoint)
  if (expired.length) await adminClient.from('push_subscriptions').delete().in('endpoint', expired)

  return NextResponse.json({ sent: results.filter(r => r.status === 'fulfilled').length })
}