"use client"
import { useEffect, useState } from "react"
import { subscribeToPush } from "@/lib/push"

export default function PushNotificationBell() {
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [supported, setSupported] = useState(false)

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setSupported(true)
      navigator.serviceWorker.ready.then(reg =>
        reg.pushManager.getSubscription().then(sub => setSubscribed(!!sub))
      )
    }
  }, [])

  if (!supported) return null

  const toggle = async () => {
    setLoading(true)
    try {
      if (subscribed) {
        await subscribeToPush()
        setSubscribed(false)
      } else {
        await subscribeToPush(["all", "movies", "materials"])
        setSubscribed(true)
      }
    } catch (err: any) {
      alert(err.message || "Could not toggle notifications.")
    }
    setLoading(false)
  }

  return (
    <button onClick={toggle} disabled={loading} aria-label="Toggle push notifications"
      title={subscribed ? "Notifications ON — click to disable" : "Enable push notifications"}
      style={{
        background: subscribed ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.05)",
        border: subscribed ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(255,255,255,0.1)",
        borderRadius: 8, padding: "6px 10px", fontSize: 16,
        transition: "all 0.18s", cursor: loading ? "wait" : "pointer",
        opacity: loading ? 0.6 : 1
      }}>
      {subscribed ? "🔔" : "🔕"}
    </button>
  )
}