import { adminClient } from "@/lib/supabase/admin"

export const revalidate = 0

export default async function AdminDashboard() {
  const [
    {count:movieCount},{count:materialCount},{count:newsCount},{count:subCount},
    {data:topMovies},{data:recentNews}
  ] = await Promise.all([
    adminClient.from("movies").select("*",{count:"exact",head:true}),
    adminClient.from("materials").select("*",{count:"exact",head:true}),
    adminClient.from("news").select("*",{count:"exact",head:true}),
    adminClient.from("push_subscriptions").select("*",{count:"exact",head:true}),
    adminClient.from("movies").select("title,view_count").order("view_count",{ascending:false}).limit(5),
    adminClient.from("news").select("title,created_at").order("created_at",{ascending:false}).limit(5),
  ])

  const stats = [
    {icon:"🎬",label:"Movies",value:movieCount??0,href:"/admin/movies"},
    {icon:"📚",label:"Materials",value:materialCount??0,href:"/admin/materials"},
    {icon:"📰",label:"News Posts",value:newsCount??0,href:"/admin/news"},
    {icon:"🔔",label:"Subscribers",value:subCount??0,href:"/admin/push"},
  ]

  return (
    <div>
      <h1 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:26,fontWeight:700,marginBottom:6}}>Dashboard</h1>
      <p style={{color:"#666",fontSize:14,marginBottom:32}}>Welcome back! Here's your overview.</p>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:14,marginBottom:36}}>
        {stats.map(s => (
          <a key={s.label} href={s.href} className="card"
            style={{display:"block",transition:"border-color 0.18s"}}
            onMouseEnter={e=>(e.currentTarget as HTMLElement).style.borderColor="#7c3aed"}
            onMouseLeave={e=>(e.currentTarget as HTMLElement).style.borderColor="rgba(255,255,255,0.07)"}>
            <div style={{fontSize:26,marginBottom:10}}>{s.icon}</div>
            <div style={{fontSize:28,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif"}}>{s.value}</div>
            <div style={{fontSize:13,color:"#666",marginTop:4}}>{s.label}</div>
          </a>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:32}}>
        <div className="card">
          <h2 style={{fontSize:15,fontWeight:600,marginBottom:14}}>🔥 Most Viewed Movies</h2>
          {topMovies?.map((m:any) => (
            <div key={m.title} style={{display:"flex",justifyContent:"space-between",
              padding:"7px 0",borderBottom:"1px solid rgba(255,255,255,0.04)",fontSize:13}}>
              <span style={{color:"#ccc",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"70%"}}>{m.title}</span>
              <span style={{color:"#7c3aed",fontWeight:600,flexShrink:0}}>{m.view_count} views</span>
            </div>
          ))}
          {!topMovies?.length && <p style={{color:"#555",fontSize:13}}>No movies yet</p>}
        </div>
        <div className="card">
          <h2 style={{fontSize:15,fontWeight:600,marginBottom:14}}>📰 Recent News</h2>
          {recentNews?.map((n:any) => (
            <div key={n.title} style={{padding:"7px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
              <p style={{fontSize:13,color:"#ccc"}}>{n.title}</p>
              <p style={{fontSize:11,color:"#555"}}>{new Date(n.created_at).toLocaleDateString("en-IN")}</p>
            </div>
          ))}
          {!recentNews?.length && <p style={{color:"#555",fontSize:13}}>No news yet</p>}
        </div>
      </div>

      <h2 style={{fontSize:15,fontWeight:600,marginBottom:14}}>⚡ Quick Actions</h2>
      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
        {[["/admin/movies","🎬 Add Movie"],["/admin/materials","📚 Add Material"],
          ["/admin/news","📰 Post News"],["/admin/announcements","📢 Announcement"],
          ["/admin/push","🔔 Send Push"],["/admin/settings","⚙️ Settings"]].map(([h,l]) => (
          <a key={h} href={h} className="btn btn-ghost">{l}</a>
        ))}
      </div>
    </div>
  )
}