import { createClient } from '@supabase/supabase-js'

// Only use in API routes — never import in client components
export const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)