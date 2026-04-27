"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

const NAV = [
  {href:"/admin",               icon:"📊", label:"Dashboard"},
  {href:"/admin/movies",        icon:"🎬", label:"Movies"},
  {href:"/admin/materials",     icon:"📚", label:"Materials"},
  {href:"/admin/projects",      icon:"🚀", label:"Projects"},
  {href:"/admin/news",          icon:"📰", label:"News"},
  {href:"/admin/announcements", icon:"📢", label:"Announcements"},
  {href:"/admin/push",          icon:"🔔", label:"Push Notify"},
  {href:"/admin/settings",      icon:"⚙️",  label:"Settings"},
]

export default function AdminNav({ userEmail }: { userEmail: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const logout = async () => { await supabase.auth.signOut(); router.push("/login") }

  return (
    <aside style={{ width:220, background:"#111",
      borderRight:"1px solid rgba(255,255,255,0.06)",
      display:"flex", flexDirection:"column", padding:"20px 10px" }}>
      <Link href="/" style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 10px", marginBottom:24 }}>
        <div style={{ width:32, height:32, borderRadius:8,
          background:"linear-gradient(135deg,#7c3aed,#a855f7)",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:14, fontWeight:700, color:"#fff" }}>T</div>
        <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:15 }}>Admin</span>
      </Link>
      <nav style={{ flex:1, display:"flex", flexDirection:"column", gap:2 }}>
        {NAV.map(({href,icon,label}) => {
          const active = pathname === href
          return (
            <Link key={href} href={href} style={{
              display:"flex", alignItems:"center", gap:9,
              padding:"9px 12px", borderRadius:8, fontSize:13, fontWeight:500,
              background: active ? "rgba(124,58,237,0.2)" : "transparent",
              color: active ? "#a78bfa" : "#777",
              border: active ? "1px solid rgba(124,58,237,0.3)" : "1px solid transparent",
              transition:"all 0.18s"
            }}><span>{icon}</span>{label}</Link>
          )
        })}
      </nav>
      <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:14, marginTop:14 }}>
        <p style={{ fontSize:11, color:"#444", marginBottom:10, padding:"0 4px",
          overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{userEmail}</p>
        <button onClick={logout} style={{ width:"100%", padding:"8px 12px", borderRadius:8, fontSize:13,
          background:"rgba(220,38,38,0.1)", border:"1px solid rgba(220,38,38,0.2)",
          color:"#f87171", cursor:"pointer" }}>Sign Out</button>
      </div>
    </aside>
  )
}