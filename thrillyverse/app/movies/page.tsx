import { createClient } from "@/lib/supabase/server"
import { getSettings } from "@/lib/settings"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import MoviesClient from "@/components/MoviesClient"

export const revalidate = 60

const CATS = ["hindi","punjabi","hollywood","webseries"] as const
type Cat = (typeof CATS)[number]

interface Props { searchParams: Promise<{ q?: string; category?: string }> }

export default async function MoviesPage({ searchParams }: Props) {
  const params = await searchParams
  const supabase = await createClient()
  const settings = await getSettings()
  const category: Cat = CATS.includes(params.category as Cat) ? (params.category as Cat) : "hindi"
  const q = params.q ?? ""

  let query = supabase.from("movies").select("*").eq("category", category)
  if (q) query = query.ilike("title", `%${q}%`)
  const { data: movies } = await query.order("created_at", { ascending: false })

  const { data: announcements } = await supabase
    .from("announcements").select("*").eq("is_active", true).limit(1)

  return (
    <>
      <Navbar logoUrl={settings.site_logo_url} siteName={settings.site_name} />
      {announcements?.[0] && (
        <div style={{ background:"linear-gradient(90deg,#7c3aed,#a855f7)",
          padding:"8px 20px", textAlign:"center", fontSize:13, fontWeight:500 }}>
          📢 {announcements[0].text}
        </div>
      )}
      <main style={{ maxWidth:1400, margin:"0 auto", padding:"28px 20px" }}>
        <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:26, fontWeight:700, marginBottom:24 }}>
          🎬 Movies &amp; Series
        </h1>
        <MoviesClient movies={movies ?? []} initialCategory={category} initialQuery={q} />
      </main>
      <Footer settings={settings} />
    </>
  )
}