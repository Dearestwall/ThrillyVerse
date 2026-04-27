import { NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  await adminClient.rpc('increment_view_count', { movie_id: params.id })
  return NextResponse.json({ success: true })
}