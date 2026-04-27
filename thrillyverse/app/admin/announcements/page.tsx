"use client"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function AdminAnnouncementsPage() {
  const supabase = createClient()
  const [items, setItems] = useState<any[]>([])
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState("")

  const load = async () => {
    const { data } = await supabase.from("announcements").select("*").order("created_at",{ascending:false})
    setItems(data ?? [])
  }
  useEffect(() => { load() }, [])

  const add = async (e: React.FormEvent) => {
    e.preventDefault(); if (!text.trim()) return
    setLoading(true)
    await supabase.from("announcements").insert({ text })
    setText(""); setLoading(false); load()
    setToast("✅ Announcement added!"); setTimeout(() => setToast(""),3000)
  }

  const toggle = async (id: string, current: boolean) => {
    await supabase.from("announcements").update({ is_active: !current }).eq("id", id)
    load()
  }

  const del = async (id: string) => {
    if (!confirm("Delete?")) return
    await supabase.from("announcements").delete().eq("id", id)
    load()
  }

  return (
    <div>
      <h1 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:24,fontWeight:700,marginBottom:28}}>
        📢 Announcements
      </h1>
      <form onSubmit={add} className="card" style={{maxWidth:600,marginBottom:28,display:"flex",flexDirection:"column",gap:14}}>
        <div className="form-group">
          <label>New Announcement Text</label>
          <input value={text} onChange={e=>setText(e.target.value)}
            placeholder="New update: Kesari 2 added! Check movies section..." required />
        </div>
        <button type="submit" disabled={loading||!text.trim()} className="btn btn-primary"
          style={{alignSelf:"flex-start"}}>
          {loading ? "Adding..." : "Add Announcement"}
        </button>
      </form>

      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {items.map((item:any) => (
          <div key={item.id} style={{
            background:"#1a1a1a",border:"1px solid rgba(255,255,255,0.06)",
            borderRadius:10,padding:"12px 16px",
            display:"flex",alignItems:"center",gap:14
          }}>
            <div style={{flex:1}}>
              <p style={{fontSize:14,color:item.is_active?"#e5e5e5":"#555"}}>{item.text}</p>
              <p style={{fontSize:11,color:"#444",marginTop:4}}>
                {new Date(item.created_at).toLocaleDateString("en-IN")} ·{" "}
                <span style={{color:item.is_active?"#4ade80":"#666"}}>
                  {item.is_active ? "● Active" : "○ Inactive"}
                </span>
              </p>
            </div>
            <div style={{display:"flex",gap:8,flexShrink:0}}>
              <button onClick={() => toggle(item.id, item.is_active)} className="btn btn-ghost"
                style={{fontSize:12,padding:"6px 12px"}}>
                {item.is_active ? "Deactivate" : "Activate"}
              </button>
              <button onClick={() => del(item.id)} className="btn btn-danger"
                style={{fontSize:12,padding:"6px 12px"}}>Delete</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p style={{color:"#555",fontSize:14}}>No announcements yet.</p>}
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}