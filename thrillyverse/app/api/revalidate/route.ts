import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { secret, path } = (await req.json()) as { secret: string; path: string }

  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  revalidatePath(path)
  return NextResponse.json({ revalidated: true, path })
}