import { createClient } from "@/lib/supabase/server"
import { getSettings } from '@/lib/settings'   // ✅ no .ts
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export const revalidate = 60

export default async function HomePage() {
  const supabase = await createClient()
  const settings = await getSettings()

  const [{ data: projects }, { data: announcements }, { data: featured }] = await Promise.all([
    supabase.from("projects").select("*").order("sort_order"),
    supabase.from("announcements").select("*").eq("is_active", true).limit(1),
    supabase.from("movies").select("*").eq("is_featured", true).limit(6),
  ])

  return (
    <>
      <Navbar logoUrl={settings.site_logo_url} siteName={settings.site_name} />

      {announcements?.[0] && (
        <div style={{
          background: "linear-gradient(90deg,#7c3aed,#a855f7)",
          padding: "9px 20px", textAlign: "center", fontSize: 13, fontWeight: 500
        }}>📢 {announcements[0].text}</div>
      )}

      {/* Hero */}
      <section style={{ padding: "64px 24px 48px", textAlign: "center", maxWidth: 820, margin: "0 auto" }}>
        {settings.site_logo_url && (
          <img src={settings.site_logo_url} alt={settings.site_name}
            style={{ width: 88, height: 88, borderRadius: 22, margin: "0 auto 20px", objectFit: "cover",
              border: "2px solid rgba(124,58,237,0.4)" }} />
        )}
        <h1 style={{ fontFamily: "'Space Grotesk',sans-serif",
          fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 700, marginBottom: 14 }}>
          {settings.site_name || "ThrillyVerse"}
        </h1>
        <p style={{ fontSize: 18, color: "#777", marginBottom: 36, maxWidth: "50ch", margin: "0 auto 36px" }}>
          {settings.site_tagline || "Think Beyond The Verse"}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/movies" className="btn btn-primary" style={{ fontSize: 15, padding: "11px 24px" }}>
            🎬 Browse Movies
          </a>
          <a href="/material" className="btn btn-ghost" style={{ fontSize: 15, padding: "11px 24px" }}>
            📚 Study Materials
          </a>
        </div>
      </section>

      {/* Featured Movies */}
      {featured && featured.length > 0 && (
        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 64px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700 }}>
              ⭐ Featured Movies
            </h2>
            <a href="/movies" style={{ fontSize: 13, color: "#7c3aed" }}>View All →</a>
          </div>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 14
          }}>
            {featured.map((movie: any) => (
              <a key={movie.id} href="/movies" style={{
                background: "#1a1a1a", borderRadius: 12, overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.06)", transition: "border-color 0.18s, transform 0.18s",
                display: "block"
              }}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor="#7c3aed";(e.currentTarget as HTMLElement).style.transform="translateY(-3px)"}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="rgba(255,255,255,0.06)";(e.currentTarget as HTMLElement).style.transform="translateY(0)"}}>
                {movie.poster_url
                  ? <img src={movie.poster_url} alt={movie.title}
                      style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover" }} loading="lazy" />
                  : <div style={{ width:"100%", aspectRatio:"2/3", background:"#242424",
                      display:"flex", alignItems:"center", justifyContent:"center", fontSize:32 }}>🎬</div>
                }
                <p style={{ padding:"8px 10px 12px", fontSize:12, fontWeight:500, lineHeight:1.4,
                  overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" as any }}>
                  {movie.title}
                </p>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 64px" }}>
          <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:700, marginBottom:20 }}>
            🚀 Our Projects
          </h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:18 }}>
            {projects.map((proj: any) => (
              <div key={proj.id} className="card" style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  {proj.logo_url && (
                    <img src={proj.logo_url} alt={proj.title}
                      style={{ width:48, height:48, borderRadius:12, objectFit:"cover",
                        border:"1px solid rgba(255,255,255,0.08)", flexShrink:0 }} />
                  )}
                  <div>
                    <h3 style={{ fontWeight:600, fontSize:15 }}>{proj.title}</h3>
                    {proj.description && (
                      <p style={{ fontSize:12, color:"#666", marginTop:3 }}>{proj.description}</p>
                    )}
                  </div>
                </div>
                {proj.screenshots?.[0] && (
                  <div style={{ borderRadius:8, overflow:"hidden", border:"1px solid rgba(255,255,255,0.06)" }}>
                    <img src={proj.screenshots[0]} alt={proj.title + " screenshot"}
                      style={{ width:"100%", aspectRatio:"16/9", objectFit:"cover" }} loading="lazy" />
                  </div>
                )}
                {proj.project_url && (
                  <a href={proj.project_url} target="_blank" rel="noopener noreferrer"
                    className="btn btn-primary" style={{ alignSelf:"flex-start" }}>
                    Open Project →
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Social Links */}
      <section style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px 80px" }}>
        <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:700, marginBottom:20 }}>
          📡 Find Us On
        </h2>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          {settings.social_telegram_movies && (
            <a href={settings.social_telegram_movies} target="_blank" rel="noopener"
              style={{ background:"#2AABEE1a", border:"1px solid #2AABEE44", color:"#2AABEE",
                padding:"10px 18px", borderRadius:10, fontSize:13, fontWeight:500 }}>
              ✈️ Telegram Movies
            </a>
          )}
          {settings.social_telegram_material && (
            <a href={settings.social_telegram_material} target="_blank" rel="noopener"
              style={{ background:"#2AABEE1a", border:"1px solid #2AABEE44", color:"#2AABEE",
                padding:"10px 18px", borderRadius:10, fontSize:13, fontWeight:500 }}>
              ✈️ Telegram Materials
            </a>
          )}
          {settings.social_instagram && (
            <a href={settings.social_instagram} target="_blank" rel="noopener"
              style={{ background:"#E1306C1a", border:"1px solid #E1306C44", color:"#E1306C",
                padding:"10px 18px", borderRadius:10, fontSize:13, fontWeight:500 }}>
              📸 Instagram
            </a>
          )}
          {settings.social_youtube_main && (
            <a href={settings.social_youtube_main} target="_blank" rel="noopener"
              style={{ background:"#FF00001a", border:"1px solid #FF000044", color:"#f87171",
                padding:"10px 18px", borderRadius:10, fontSize:13, fontWeight:500 }}>
              ▶️ YouTube
            </a>
          )}
        </div>
      </section>

      <Footer settings={settings} />
    </>
  )
}