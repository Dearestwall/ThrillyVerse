import { createClient } from "@/lib/supabase/server"
// Update the import path if the file is named 'settings.ts' or located elsewhere
import { getSettings } from '@/lib/settings'
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import MaterialClient from "@/components/MaterialClient"

export const revalidate = 300

interface Props { searchParams: Promise<{ class?: string; subject?: string; tab?: string }> }

export default async function MaterialPage({ searchParams }: Props) {
  const params = await searchParams
  const supabase = await createClient()
  const settings = await getSettings()
  const classLevel = params.class === "class11" ? "class11" : "class10"
  const subject = params.subject ?? "literature"
  const activeTab = params.tab ?? "materials"

  const [{ data: materials }, { data: news }, { data: quizzes }] = await Promise.all([
    supabase.from("materials").select("*").eq("class_level", classLevel)
      .eq("subject", subject).order("created_at", { ascending: false }),
    supabase.from("news").select("*").eq("is_published", true)
      .order("created_at", { ascending: false }).limit(20),
    supabase.from("quizzes").select("*").eq("is_active", true)
      .order("created_at", { ascending: false }),
  ])

  return (
    <>
      <Navbar logoUrl={settings.site_logo_url} siteName={settings.site_name} />
      <main style={{ maxWidth:1200, margin:"0 auto", padding:"28px 20px" }}>
        <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:26, fontWeight:700, marginBottom:24 }}>
          📚 Study Materials
        </h1>
        <MaterialClient
          materials={materials ?? []} news={news ?? []} quizzes={quizzes ?? []}
          classLevel={classLevel as "class10"|"class11"}
          initialSubject={subject} initialTab={activeTab}
        />
      </main>
      <Footer settings={settings} />
    </>
  )
}