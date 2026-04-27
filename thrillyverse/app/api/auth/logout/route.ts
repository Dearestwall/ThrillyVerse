import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = createClient()
  await (await supabase).auth.signOut()
  return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_APP_URL!))
}