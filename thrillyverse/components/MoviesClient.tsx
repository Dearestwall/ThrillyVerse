"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

const CATS = [
  { key:"hindi",     label:"🎭 Hindi"     },
  { key:"punjabi",   label:"🌾 Punjabi"   },
  { key:"hollywood", label:"🎪 Hollywood" },
  { key:"webseries", label:"📺 Web Series"},
]

export default function MoviesClient({
  movies, initialCategory, initialQuery
}: { movies: any[]; initialCategory: string; initialQuery: string }) {
  const router = useRouter()
  const [category, setCategory] = useState(initialCategory)
  const [query, setQuery] = useState(initialQuery)
  const [selected, setSelected] = useState<any>(null)

  const navigate = (cat: string, q: string) => {
    const p = new URLSearchParams()
    if (cat) p.set("category", cat)
    if (q)   p.set("q", q)
    router.push(`/movies?${p.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); navigate(category, query) }

  return (
    <>
      {/* Search */}
      <form onSubmit={handleSearch} style={{ display:"flex", gap:10, marginBottom:20, maxWidth:500 }}>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search movies..."
          style={{ flex:1, background:"#1a1a1a", border:"1px solid rgba(255,255,255,0.1)",
            color:"#e5e5e5", padding:"10px 14px", borderRadius:10, fontSize:14 }} />
        <button type="submit" className="btn btn-primary">Search</button>
        {query && (
          <button type="button" className="btn btn-ghost"
            onClick={() => { setQuery(""); navigate(category,"") }}>Clear</button>
        )}
      </form>

      {/* Category Tabs */}
      <div style={{ display:"flex", gap:8, marginBottom:24, flexWrap:"wrap" }}>
        {CATS.map(c => (
          <button key={c.key} onClick={() => { setCategory(c.key); navigate(c.key, query) }}
            style={{
              padding:"8px 16px", borderRadius:10, fontSize:14, fontWeight:500,
              border: category===c.key ? "1px solid #7c3aed" : "1px solid rgba(255,255,255,0.08)",
              background: category===c.key ? "rgba(124,58,237,0.2)" : "transparent",
              color: category===c.key ? "#a78bfa" : "#888", cursor:"pointer", transition:"all 0.18s"
            }}>{c.label}</button>
        ))}
      </div>

      {/* Grid */}
      {movies.length === 0 ? (
        <div style={{ textAlign:"center", padding:"80px 24px", color:"#555" }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🎬</div>
          <p style={{ fontSize:16, fontWeight:500, marginBottom:6 }}>No movies found</p>
          <p style={{ fontSize:13 }}>Try a different category or search term</p>
          <a href="https://www.instagram.com/thrillyverse/" target="_blank" rel="noopener"
            style={{ display:"inline-block", marginTop:16, color:"#7c3aed", fontSize:14 }}>
            Request a movie on Instagram →
          </a>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(148px,1fr))", gap:14 }}>
          {movies.map((movie: any) => (
            <article key={movie.id}
              onClick={() => { setSelected(movie); fetch(`/api/movies/${movie.id}/view`,{method:"POST"}) }}
              style={{ background:"#1a1a1a", borderRadius:12, overflow:"hidden",
                border:"1px solid rgba(255,255,255,0.06)", cursor:"pointer", transition:"border-color 0.18s, transform 0.18s" }}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor="#7c3aed";(e.currentTarget as HTMLElement).style.transform="translateY(-3px)"}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="rgba(255,255,255,0.06)";(e.currentTarget as HTMLElement).style.transform="translateY(0)"}}>
              {movie.poster_url
                ? <img src={movie.poster_url} alt={movie.title}
                    style={{ width:"100%", aspectRatio:"2/3", objectFit:"cover" }} loading="lazy" />
                : <div style={{ width:"100%", aspectRatio:"2/3", background:"#242424",
                    display:"flex", alignItems:"center", justifyContent:"center", fontSize:32 }}>🎬</div>
              }
              <div style={{ padding:"8px 10px 12px" }}>
                <p style={{ fontSize:12, fontWeight:500, lineHeight:1.4,
                  overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" as any }}>
                  {movie.title}
                </p>
                {movie.quality && (
                  <span style={{ display:"inline-block", marginTop:5, fontSize:10, fontWeight:600,
                    background:"rgba(124,58,237,0.2)", color:"#a78bfa", padding:"2px 6px", borderRadius:4 }}>
                    {movie.quality}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Modal */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:200,
          display:"flex", alignItems:"center", justifyContent:"center",
          padding:20, backdropFilter:"blur(6px)"
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background:"#1a1a1a", borderRadius:16, maxWidth:580, width:"100%",
            border:"1px solid rgba(255,255,255,0.1)", overflow:"hidden",
            maxHeight:"90vh", overflowY:"auto"
          }}>
            <div style={{ position:"sticky", top:0, background:"#1a1a1a",
              padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.06)",
              display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <h2 style={{ fontSize:17, fontWeight:600, fontFamily:"'Space Grotesk',sans-serif" }}>
                {selected.title}
              </h2>
              <button onClick={() => setSelected(null)}
                style={{ background:"none", border:"none", color:"#888", fontSize:22, cursor:"pointer" }}>✕</button>
            </div>

            <div style={{ padding:20 }}>
              <div style={{ display:"flex", gap:16, marginBottom:20, flexWrap:"wrap" }}>
                {selected.poster_url && (
                  <img src={selected.poster_url} alt={selected.title}
                    style={{ width:130, borderRadius:10, objectFit:"cover", flexShrink:0 }} />
                )}
                <div style={{ flex:1, minWidth:180 }}>
                  {selected.description && (
                    <p style={{ fontSize:13, color:"#888", lineHeight:1.6, marginBottom:12 }}>
                      {selected.description}
                    </p>
                  )}
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    {selected.year && <span className="badge badge-purple">{selected.year}</span>}
                    {selected.quality && <span className="badge badge-green">{selected.quality}</span>}
                    {selected.language && <span className="badge badge-yellow">{selected.language}</span>}
                  </div>
                </div>
              </div>

              {selected.movie_links && Object.keys(selected.movie_links).length > 0 && (
                <div style={{ marginBottom:20 }}>
                  <h3 style={{ fontSize:12, fontWeight:600, color:"#666", textTransform:"uppercase",
                    letterSpacing:1, marginBottom:10 }}>🎬 Movie Download Links</h3>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {Object.entries(selected.movie_links).map(([quality, url]) => (
                      <a key={quality} href={url as string} target="_blank" rel="noopener"
                        className="btn btn-primary" style={{ justifyContent:"space-between" }}>
                        <span>⬇️ Download {quality}</span>
                        <span style={{ fontSize:11, opacity:0.7 }}>↗</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {selected.series_links && Object.keys(selected.series_links).length > 0 && (
                <div>
                  <h3 style={{ fontSize:12, fontWeight:600, color:"#666", textTransform:"uppercase",
                    letterSpacing:1, marginBottom:10 }}>📺 Series Episodes</h3>
                  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                    {Object.entries(selected.series_links).map(([ep, url]) => (
                      <a key={ep} href={url as string} target="_blank" rel="noopener"
                        style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                          padding:"10px 14px", background:"#242424", borderRadius:8,
                          border:"1px solid rgba(255,255,255,0.06)", fontSize:13, color:"#e5e5e5" }}>
                        <span>📥 {ep}</span>
                        <span style={{ color:"#7c3aed", fontSize:12 }}>Download →</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {(!selected.movie_links || Object.keys(selected.movie_links).length === 0) &&
               (!selected.series_links || Object.keys(selected.series_links).length === 0) && (
                <div style={{ textAlign:"center", padding:"24px", color:"#555" }}>
                  <p style={{ marginBottom:8 }}>Links coming soon.</p>
                  <a href="https://instagram.com/thrillyverse" target="_blank" rel="noopener"
                    style={{ color:"#7c3aed" }}>Request on Instagram →</a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}