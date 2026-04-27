"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError("")
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else router.push("/admin")
  }

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center",
      justifyContent:"center", background:"#0f0f0f", padding:24 }}>
      <div style={{ background:"#1a1a1a", border:"1px solid rgba(255,255,255,0.08)",
        borderRadius:16, padding:40, width:"100%", maxWidth:400 }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ width:56, height:56, borderRadius:14,
            background:"linear-gradient(135deg,#7c3aed,#a855f7)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:24, margin:"0 auto 16px" }}>🔐</div>
          <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:22, fontWeight:700, marginBottom:6 }}>
            Admin Login
          </h1>
          <p style={{ fontSize:13, color:"#666" }}>ThrillyVerse Admin Panel</p>
        </div>
        <form onSubmit={handleLogin} style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@thrillyverse.com" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required />
          </div>
          {error && (
            <div style={{ background:"rgba(220,38,38,0.1)", border:"1px solid rgba(220,38,38,0.3)",
              color:"#f87171", padding:"10px 14px", borderRadius:8, fontSize:13 }}>{error}</div>
          )}
          <button type="submit" disabled={loading} className="btn btn-primary"
            style={{ width:"100%", justifyContent:"center", padding:"12px" }}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>
        <p style={{ textAlign:"center", marginTop:20, fontSize:12, color:"#444" }}>
          <a href="/" style={{ color:"#7c3aed" }}>← Back to site</a>
        </p>
      </div>
    </div>
  )
}