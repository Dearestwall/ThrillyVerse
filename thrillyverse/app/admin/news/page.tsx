"use client"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

const empty = { title:"", summary:"", type:"update", is_published:true }

export default function AdminNewsPage() {
  const supabase = createClient()
  const [items, setItems] = useState<any[]>([])
  const [form, setForm] = useState<any>(empty)
  const [editing, setEditing] = useState<string|null>(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState("")

  const load = async () => {
    const { data } = await supabase.from("news").select("*").order("created_at",{ascending:false})
    setItems(data ?? [])
  }
  useEffect(() => { load() }, [])

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    if (editing) {
      await supabase.from("news").update(form).eq("id", editing)
      setToast("✅ Updated!")
    } else {
      await supabase.from("news").insert(form)
      setToast("✅ Added!")
    }
    setForm(empty); setEditing(null); setLoading(false); load()
    setTimeout(() => setToast(""),3000)
  }

  const del = async (id: string) => {
    if (!confirm("Delete?")) return
    await supabase.from("news").delete().eq("id",id); load()
  }

  return (
    <div>
      <h1 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:24,fontWeight:700,marginBottom:28}}>
        📰 Manage News
      </h1>
      <form onSubmit={save} className="card" style={{maxWidth:600,marginBottom:28,display:"flex",flexDirection:"column",gap:14}}>
        <h2 style={{fontSize:15,fontWeight:600}}>{editing ? "✏️ Edit News" : "➕ Add News"}</h2>
        <div className="form-group">
          <label>Title *</label>
          <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required placeholder="Breaking: New movies added!" />
        </div>
        <div className="form-group">
          <label>Summary *</label>
          <textarea value={form.summary} onChange={e=>setForm({...form,summary:e.target.value})} rows={3} required placeholder="Brief summary..." />
        </div>
        <div className="form-group">
          <label>Type</label>
          <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
            <option value="update">Update</option>
            <option value="announcement">Announcement</option>
            <option value="premium">Premium</option>
            <option value="telegram">Telegram</option>
          </select>
        </div>
        <label style={{display:"flex",alignItems:"center",gap:8,fontSize:14,color:"#aaa",cursor:"pointer"}}>
          <input type="checkbox" checked={form.is_published} onChange={e=>setForm({...form,is_published:e.target.checked})} />
          Published (visible on site)
        </label>
        <div style={{display:"flex",gap:10}}>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Saving..." : editing ? "Update" : "Add News"}
          </button>
          {editing && <button type="button" onClick={() => { setForm(empty); setEditing(null) }} className="btn btn-ghost">Cancel</button>}
        </div>
      </form>

      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {items.map((item:any) => (
          <div key={item.id} style={{
            background:"#1a1a1a",border:"1px solid rgba(255,255,255,0.06)",
            borderRadius:10,padding:"12px 16px",display:"flex",alignItems:"center",gap:14
          }}>
            <div style={{flex:1}}>
              <p style={{fontSize:14,fontWeight:500}}>{item.title}</p>
              <p style={{fontSize:12,color:"#666",marginTop:3}}>
                {item.type} · {item.is_published ? "Published" : "Draft"} · {new Date(item.created_at).toLocaleDateString("en-IN")}
              </p>
            </div>
            <div style={{display:"flex",gap:8,flexShrink:0}}>
              <button onClick={() => { setEditing(item.id); setForm(item); window.scrollTo({top:0,behavior:"smooth"}) }}
                className="btn btn-ghost" style={{fontSize:12,padding:"6px 12px"}}>Edit</button>
              <button onClick={() => del(item.id)} className="btn btn-danger" style={{fontSize:12,padding:"6px 12px"}}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}