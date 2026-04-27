import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdminNav from "@/components/AdminNav"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#0f0f0f" }}>
      <AdminNav userEmail={user.email ?? ""} />
      <main style={{ flex:1, overflowY:"auto", padding:"32px 28px" }}>{children}</main>
    </div>
  )
}