import { NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }  // ← Promise<> required in Next.js 15
) {
  const { id } = await params
  await adminClient.rpc('increment_view_count', { movie_id: id }).match(() =>
    adminClient.from('movies').update({ view_count: 1 }).eq('id', id)
  )
  return NextResponse.json({ ok: true })
}