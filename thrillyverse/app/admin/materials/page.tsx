'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const CLASSES = ['class10','class11']
const SUBJECTS = ['literature','language','maths','physics','chemistry','biology','history','geography','computer applications','commercial applications','physical education','economics','hindi','papers','accounts','business studies','computer science']

export default function AdminMaterials() {
  const supabase = createClient()
  const [items, setItems] = useState<any[]>([])
  const [form, setForm] = useState({ title:'', description:'', class_level:'class10', subject:'literature', drive_url:'', thumbnail_url:'', is_featured:false })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [editId, setEditId] = useState<string|null>(null)

  const load = async () => {
    const { data } = await supabase.from('materials').select('*').order('created_at', { ascending: false })
    setItems(data || [])
  }
  useEffect(() => { load() }, [])

  const reset = () => { setForm({ title:'', description:'', class_level:'class10', subject:'literature', drive_url:'', thumbnail_url:'', is_featured:false }); setEditId(null) }

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    const { error } = editId
      ? await supabase.from('materials').update(form).eq('id', editId)
      : await supabase.from('materials').insert(form)
    if (error) setMsg('❌ ' + error.message)
    else { setMsg(editId ? '✅ Updated!' : '✅ Added!'); reset(); load() }
    setSaving(false)
  }

  const startEdit = (m: any) => {
    setForm({ title:m.title||'', description:m.description||'', class_level:m.class_level||'class10', subject:m.subject||'literature', drive_url:m.drive_url||'', thumbnail_url:m.thumbnail_url||'', is_featured:m.is_featured||false })
    setEditId(m.id); window.scrollTo({ top:0, behavior:'smooth' })
  }

  const del = async (id: string) => {
    if (!confirm('Delete?')) return
    await supabase.from('materials').delete().eq('id', id); load()
  }

  const inp = 'w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500'

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-white mb-6">{editId ? '✏️ Edit Material' : '➕ Add Material'}</h1>
      {msg && <div className="mb-4 bg-gray-800 rounded-xl px-4 py-3 text-sm text-white">{msg}</div>}
      <form onSubmit={save} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="text-gray-400 text-xs block mb-1">Title *</label>
            <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required className={inp} /></div>
          <div><label className="text-gray-400 text-xs block mb-1">Drive URL *</label>
            <input value={form.drive_url} onChange={e=>setForm({...form,drive_url:e.target.value})} required className={inp} placeholder="https://drive.google.com/..." /></div>
          <div><label className="text-gray-400 text-xs block mb-1">Class</label>
            <select value={form.class_level} onChange={e=>setForm({...form,class_level:e.target.value})} className={inp}>
              {CLASSES.map(c=><option key={c}>{c}</option>)}</select></div>
          <div><label className="text-gray-400 text-xs block mb-1">Subject</label>
            <select value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} className={inp}>
              {SUBJECTS.map(s=><option key={s}>{s}</option>)}</select></div>
          <div><label className="text-gray-400 text-xs block mb-1">Thumbnail URL</label>
            <input value={form.thumbnail_url} onChange={e=>setForm({...form,thumbnail_url:e.target.value})} className={inp} placeholder="https://..." /></div>
          <div className="flex items-center gap-3 pt-5">
            <input type="checkbox" id="mfeat" checked={form.is_featured} onChange={e=>setForm({...form,is_featured:e.target.checked})} className="w-4 h-4 accent-purple-600" />
            <label htmlFor="mfeat" className="text-gray-300 text-sm">Featured</label></div>
        </div>
        <div><label className="text-gray-400 text-xs block mb-1">Description</label>
          <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={2} className={inp} /></div>
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="bg-purple-700 hover:bg-purple-600 disabled:bg-gray-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors">
            {saving ? 'Saving...' : editId ? 'Update' : 'Add Material'}</button>
          {editId && <button type="button" onClick={reset} className="bg-gray-700 text-white px-6 py-2.5 rounded-xl text-sm">Cancel</button>}
        </div>
      </form>
      <h2 className="text-lg font-bold text-white mb-4">All Materials ({items.length})</h2>
      <div className="space-y-2">
        {items.map(m=>(
          <div key={m.id} className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{m.title}</p>
              <p className="text-gray-500 text-xs">{m.class_level} · {m.subject}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>startEdit(m)} className="text-blue-400 text-xs px-3 py-1.5 bg-blue-900/30 rounded-lg">Edit</button>
              <button onClick={()=>del(m.id)} className="text-red-400 text-xs px-3 py-1.5 bg-red-900/30 rounded-lg">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}