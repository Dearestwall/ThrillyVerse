import { NextResponse } from 'next/server';
import { generateSignature } from '@/lib/cloudinary';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const folder = typeof body.folder === 'string' ? body.folder : 'thrillyverse';

  const payload = await generateSignature(folder);
  return NextResponse.json(payload);
}