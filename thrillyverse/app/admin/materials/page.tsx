'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Material } from '@/lib/types'

const CLASS10_SUBJECTS = ['language','literature','maths','physics','chemistry','biology','history','geography','computer applications','commercial applications','secondlanguage','hindi','physical education','economics','papers','oswaal']
const CLASS11_SUBJECTS = ['english','maths','physics','chemistry','biology','accountancy','business studies','economics','history','geography','computer science','physical education']

export default function AdminMaterialsPage() {
  const supabase = createClient()
  const [materials, setMaterials] = useState<Material[]>([])
  const [classLevel, setClassLevel] = useState<'class10' | 'class11'>('class10')
  const [form, setForm] = useState({ title: '', description: '', class_level: 'class10', subject: 'literature', drive_url: '', thumbnail_url: '', is_featured: false })
  const [message, setMessage] = useState('')

  const fetchMaterials = async () => {
    const { data } = await supabase.from('materials').select('*').eq('class_level', classLevel).order('created_at', { ascending: false }).limit(50)
    setMaterials((data as Material[]) ?? [])
  }

  useEffect(() => { fetchMaterials() }, [classLevel])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('materials').insert({ ...form, class_level: form.class_level, thumbnail_url: form.thumbnail_url || null })
    if (error) { setMessage(`❌ ${error.message}`) } else {
      setMessage(`✅ "${form.title}" added!`)
      setForm({ title: '', description: '', class_level: 'class10', subject: 'literature', drive_url: '', thumbnail_url: '', is_featured: false })
      await fetch('/api/revalidate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ secret: process.env.NEXT_PUBLIC_ADMIN_SECRET, path: '/material' }) })
      fetchMaterials()
    }
  }

  const subjects = form.class_level === 'class10' ? CLASS10_SUBJECTS : CLASS11_SUBJECTS

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Materials</h1>
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Add Material</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input required placeholder="Material Title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="input-field" />
          <select value={form.class_level} onChange={e => setForm(p => ({ ...p, class_level: e.target.value as 'class10' | 'class11', subject: 'literature' }))} className="input-field">
            <option value="class10">Class 10</option>
            <option value="class11">Class 11</option>
          </select>
          <select value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} className="input-field">
            {subjects.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <input required placeholder="Google Drive URL" value={form.drive_url} onChange={e => setForm(p => ({ ...p, drive_url: e.target.value }))} className="input-field" />
          <input placeholder="Thumbnail URL (optional)" value={form.thumbnail_url} onChange={e => setForm(p => ({ ...p, thumbnail_url: e.target.value }))} className="input-field" />
          <textarea placeholder="Description" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} className="input-field md:col-span-2" />
          <button type="submit" className="px-6 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-xl font-semibold">+ Add Material</button>
          {message && <p className="text-sm text-green-400">{message}</p>}
        </form>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {(['class10', 'class11'] as const).map(c => (
          <button key={c} onClick={() => setClassLevel(c)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${classLevel === c ? 'bg-brand text-white' : 'bg-gray-800 text-gray-300'}`}>
            {c === 'class10' ? 'Class 10' : 'Class 11'}
          </button>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 text-gray-400">
            <tr>
              <th className="text-left px-4 py-3">Title</th>
              <th className="text-left px-4 py-3">Subject</th>
              <th className="text-left px-4 py-3">Class</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {materials.map(m => (
              <tr key={m.id} className="border-t border-gray-800 hover:bg-gray-800/50">
                <td className="px-4 py-3 font-medium">{m.title}</td>
                <td className="px-4 py-3 text-gray-400 capitalize">{m.subject}</td>
                <td className="px-4 py-3 text-gray-400">{m.class_level}</td>
                <td className="px-4 py-3 text-center">
                  <button onClick={async () => { if (confirm(`Delete "${m.title}"?`)) { await supabase.from('materials').delete().eq('id', m.id); fetchMaterials() } }} className="text-red-400 hover:text-red-300 text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style>{`.input-field { width: 100%; background: #111827; border: 1px solid #374151; border-radius: 0.75rem; padding: 0.75rem 1rem; color: white; outline: none; } .input-field:focus { border-color: #6d28d9; }`}</style>
    </div>
  )
}