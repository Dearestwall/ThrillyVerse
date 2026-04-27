"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import PushNotificationBell from "./PushNotificationBell"

const NAV = [
  { href: "/",        label: "Home"      },
  { href: "/movies",  label: "🎬 Movies" },
  { href: "/material",label: "📚 Materials" },
]

export default function Navbar({ logoUrl, siteName }: { logoUrl?: string; siteName?: string }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(15,15,15,0.92)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(255,255,255,0.06)"
    }}>
      <div style={{
        maxWidth: 1400, margin: "0 auto", padding: "0 20px",
        height: 56, display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        {/* Brand */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {logoUrl ? (
            <img src={logoUrl} alt={siteName} width={32} height={32}
              style={{ borderRadius: 8, objectFit: "cover" }} />
          ) : (
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "linear-gradient(135deg,#7c3aed,#a855f7)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 700, color: "#fff"
            }}>T</div>
          )}
          <span style={{
            fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 17
          }}>{siteName || "ThrillyVerse"}</span>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: 4 }}
          className="desktop-nav">
          {NAV.map(({ href, label }) => (
            <Link key={href} href={href} style={{
              padding: "6px 14px", borderRadius: 8, fontSize: 14, fontWeight: 500,
              color: pathname === href ? "#a78bfa" : "#888",
              background: pathname === href ? "rgba(124,58,237,0.12)" : "transparent",
              transition: "all 0.18s"
            }}>{label}</Link>
          ))}
        </nav>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <PushNotificationBell />
          {/* Hamburger for mobile */}
          <button onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            style={{ color: "#888", fontSize: 22, display: "none" }}
            className="hamburger">☰</button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{
          background: "#111", borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "12px 20px", display: "flex", flexDirection: "column", gap: 4
        }}>
          {NAV.map(({ href, label }) => (
            <Link key={href} href={href}
              onClick={() => setOpen(false)}
              style={{
                padding: "10px 14px", borderRadius: 8, fontSize: 15,
                color: pathname === href ? "#a78bfa" : "#ccc",
                background: pathname === href ? "rgba(124,58,237,0.12)" : "transparent"
              }}>{label}</Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </header>
  )
}