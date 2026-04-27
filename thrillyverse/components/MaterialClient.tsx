"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

const CLASS10_SUBJECTS = [
  {key:"literature",label:"Literature"},{key:"language",label:"Language"},
  {key:"maths",label:"Maths"},{key:"physics",label:"Physics"},
  {key:"chemistry",label:"Chemistry"},{key:"biology",label:"Biology"},
  {key:"history",label:"His/Civics"},{key:"geography",label:"Geography"},
  {key:"computer applications",label:"Computer"},{key:"commercial applications",label:"Comm. App"},
  {key:"physical education",label:"Phy. Edu"},{key:"economics",label:"Economics"},
  {key:"papers",label:"Question Papers"},{key:"oswaal",label:"Oswaal"},
]
const CLASS11_SUBJECTS = [
  {key:"literature",label:"Literature"},{key:"maths",label:"Maths"},
  {key:"physics",label:"Physics"},{key:"chemistry",label:"Chemistry"},
  {key:"biology",label:"Biology"},{key:"commerce",label:"Commerce"},
  {key:"economics",label:"Economics"},{key:"accounts",label:"Accounts"},
]

export default function MaterialClient({ materials, news, quizzes, classLevel, initialSubject, initialTab }:
  { materials:any[]; news:any[]; quizzes:any[]; classLevel:"class10"|"class11"; initialSubject:string; initialTab:string }) {
  const router = useRouter()
  const [tab, setTab] = useState(initialTab)
  const [cls, setCls] = useState(classLevel)
  const [subject, setSubject] = useState(initialSubject)
  const [searchQ, setSearchQ] = useState("")

  const subjects = cls === "class10" ? CLASS10_SUBJECTS : CLASS11_SUBJECTS
  const nav = (c:string,s:string,t:string) => router.push(`/material?class=${c}&subject=${s}&tab=${t}`)
  const filtered = materials.filter(m => !searchQ || m.title?.toLowerCase().includes(searchQ.toLowerCase()))

  const tabBtn = (key:string,label:string) => (
    <button key={key} onClick={() => { setTab(key); nav(cls,subject,key) }}
      style={{ padding:"10px 20px", borderRadius:10, fontSize:14, fontWeight:500,
        border: tab===key ? "1px solid #7c3aed" : "1px solid rgba(255,255,255,0.08)",
        background: tab===key ? "rgba(124,58,237,0.2)" : "transparent",
        color: tab===key ? "#a78bfa" : "#888", cursor:"pointer", transition:"all 0.18s" }}>
      {label}
    </button>
  )

  return (
    <>
      <div style={{ display:"flex", gap:8, marginBottom:24, flexWrap:"wrap" }}>
        {tabBtn("materials","📖 Materials")}
        {tabBtn("news","📰 News")}
        {tabBtn("quiz","✏️ Quizzes")}
      </div>

      {tab === "materials" && (
        <>
          {/* Class selector */}
          <div style={{ display:"flex", gap:10, marginBottom:18 }}>
            {[["class10","Class 10"],["class11","Class 11"]].map(([c,l]) => (
              <button key={c} onClick={() => { setCls(c as any); nav(c,subject,tab) }}
                style={{ padding:"8px 20px", borderRadius:8, fontSize:14, fontWeight:600,
                  background: cls===c ? "#7c3aed" : "#1a1a1a",
                  color: cls===c ? "#fff" : "#888",
                  border: cls===c ? "1px solid #7c3aed" : "1px solid rgba(255,255,255,0.08)",
                  cursor:"pointer" }}>{l}</button>
            ))}
          </div>

          {/* Subject tabs */}
          <div style={{ overflowX:"auto", marginBottom:22 }}>
            <div style={{ display:"flex", gap:6, paddingBottom:4, minWidth:"max-content" }}>
              {subjects.map(s => (
                <button key={s.key} onClick={() => { setSubject(s.key); nav(cls,s.key,tab) }}
                  style={{ padding:"6px 14px", borderRadius:8, fontSize:13, whiteSpace:"nowrap",
                    background: subject===s.key ? "rgba(124,58,237,0.2)" : "transparent",
                    border: subject===s.key ? "1px solid #7c3aed" : "1px solid rgba(255,255,255,0.08)",
                    color: subject===s.key ? "#a78bfa" : "#666", cursor:"pointer" }}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <input value={searchQ} onChange={e => setSearchQ(e.target.value)}
            placeholder="Search materials..."
            style={{ width:"100%", maxWidth:400, background:"#1a1a1a",
              border:"1px solid rgba(255,255,255,0.1)", color:"#e5e5e5",
              padding:"10px 14px", borderRadius:10, fontSize:14, marginBottom:20 }} />

          {filtered.length === 0 ? (
            <div style={{ textAlign:"center", padding:"64px 24px", color:"#555" }}>
              <div style={{ fontSize:48, marginBottom:12 }}>📚</div>
              <p style={{ fontWeight:500, marginBottom:6 }}>No materials yet for this subject</p>
              <p style={{ fontSize:13 }}>Check back soon!</p>
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 }}>
              {filtered.map((m:any) => (
                <a key={m.id} href={m.drive_url} target="_blank" rel="noopener"
                  style={{ background:"#1a1a1a", borderRadius:12, padding:16,
                    border:"1px solid rgba(255,255,255,0.06)", display:"flex", gap:14, alignItems:"center",
                    transition:"border-color 0.18s" }}
                  onMouseEnter={e=>(e.currentTarget as HTMLElement).style.borderColor="#7c3aed"}
                  onMouseLeave={e=>(e.currentTarget as HTMLElement).style.borderColor="rgba(255,255,255,0.06)"}>
                  {m.thumbnail_url
                    ? <img src={m.thumbnail_url} alt={m.title}
                        style={{ width:60, height:60, borderRadius:8, objectFit:"cover", flexShrink:0 }} />
                    : <div style={{ width:60, height:60, borderRadius:8, background:"#242424", flexShrink:0,
                        display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>📄</div>
                  }
                  <div style={{ flex:1, minWidth:0 }}>
                    <h3 style={{ fontSize:13, fontWeight:600, marginBottom:4, lineHeight:1.4,
                      overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" as any }}>
                      {m.title}
                    </h3>
                    {m.description && (
                      <p style={{ fontSize:11, color:"#666", lineHeight:1.4,
                        overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" as any }}>
                        {m.description}
                      </p>
                    )}
                    <span style={{ fontSize:11, color:"#7c3aed", marginTop:4, display:"block" }}>
                      📥 Open in Drive →
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </>
      )}

      {tab === "news" && (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {news.length === 0 ? (
            <div style={{ textAlign:"center", padding:"64px", color:"#555" }}>
              <div style={{ fontSize:48, marginBottom:12 }}>📰</div>
              <p>No news yet.</p>
            </div>
          ) : news.map((item:any) => (
            <div key={item.id} className="card"
              style={{ borderLeft:"3px solid #7c3aed" }}>
              <div style={{ display:"flex", justifyContent:"space-between", gap:12 }}>
                <div>
                  <h3 style={{ fontSize:14, fontWeight:600, marginBottom:5 }}>{item.title}</h3>
                  <p style={{ fontSize:13, color:"#777", lineHeight:1.5 }}>{item.summary}</p>
                </div>
                {item.type && <span className="badge badge-purple" style={{ flexShrink:0 }}>{item.type}</span>}
              </div>
              <p style={{ fontSize:11, color:"#555", marginTop:10 }}>
                {new Date(item.created_at).toLocaleDateString("en-IN")}
              </p>
            </div>
          ))}
        </div>
      )}

      {tab === "quiz" && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 }}>
          {quizzes.length === 0 ? (
            <div style={{ textAlign:"center", padding:"64px", color:"#555", gridColumn:"1/-1" }}>
              <div style={{ fontSize:48, marginBottom:12 }}>✏️</div>
              <p>No active quizzes right now.</p>
            </div>
          ) : quizzes.map((quiz:any) => (
            <div key={quiz.id} className="card">
              <h3 style={{ fontSize:15, fontWeight:600, marginBottom:8 }}>{quiz.title}</h3>
              {quiz.description && <p style={{ fontSize:13, color:"#777", marginBottom:12 }}>{quiz.description}</p>}
              <div style={{ display:"flex", gap:6, marginBottom:14 }}>
                {quiz.subject && <span className="badge badge-purple">{quiz.subject}</span>}
                {quiz.class_level && <span className="badge badge-green">{quiz.class_level}</span>}
              </div>
              {quiz.form_url && (
                <a href={quiz.form_url} target="_blank" rel="noopener" className="btn btn-primary">
                  Take Quiz →
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}