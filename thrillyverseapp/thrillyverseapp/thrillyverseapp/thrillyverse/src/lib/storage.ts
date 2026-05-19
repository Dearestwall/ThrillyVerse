import { supabase, isSupabaseConfigured } from './supabase'

export async function uploadFile(bucket: string, file: File, folder = 'uploads') {
  if (!isSupabaseConfigured) {
    return { publicUrl: URL.createObjectURL(file), path: `${folder}/${file.name}` }
  }

  const ext = file.name.split('.').pop()
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabase.storage.from(bucket).upload(fileName, file, {
    cacheControl: '3600',
    upsert: false
  })

  if (error) {
    throw new Error(error.message)
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName)
  return { publicUrl: data.publicUrl, path: fileName }
}