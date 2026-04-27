'use client'
import { useState } from 'react'

export default function AdminPush() {
  const [form, setForm] = useState({ title:'', body:'', url:'/', topic:'all' })
  const [sending, setSending] = useState(false)
  const [msg, setMsg] = useState('')

  const send = async (e: React.FormEvent) => {
    e.preventDefault(); setSending(true)
    const res = await fetch('/api/push/send', {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'x-admin-secret': process.env.NEXT_PUBLIC_ADMIN_SECRET || '' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setMsg(res.ok ? `✅ Sent to ${data.sent} subscribers!` : '❌ ' + (data.error || 'Failed'))
    setSending(false)
  }

  const inp = 'w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500'

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-white mb-6">🔔 Send Push Notification</h1>
      {msg && <div className="mb-4 bg-gray-800 rounded-xl px-4 py-3 text-sm text-white">{msg}</div>}
      <form onSubmit={send} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
        <div><label className="text-gray-400 text-xs block mb-1">Title *</label>
          <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required className={inp} placeholder="🎬 New Movie Added!" /></div>
        <div><label className="text-gray-400 text-xs block mb-1">Message *</label>
          <textarea value={form.body} onChange={e=>setForm({...form,body:e.target.value})} required rows={3} className={inp} placeholder="Housefull 5 is now available..." /></div>
        <div><label className="text-gray-400 text-xs block mb-1">Link on Click</label>
          <input value={form.url} onChange={e=>setForm({...form,url:e.target.value})} className={inp} placeholder="/movies" /></div>
        <div><label className="text-gray-400 text-xs block mb-1">Topic (who receives it)</label>
          <select value={form.topic} onChange={e=>setForm({...form,topic:e.target.value})} className={inp}>
            <option value="all">All Subscribers</option>
            <option value="movies">Movies Subscribers</option>
            <option value="materials">Materials Subscribers</option>
          </select></div>
        <button type="submit" disabled={sending}
          className="w-full bg-purple-700 hover:bg-purple-600 disabled:bg-gray-700 text-white py-3 rounded-xl text-sm font-medium transition-colors">
          {sending ? 'Sending...' : '🚀 Send Notification'}
        </button>
      </form>
    </div>
  )
}