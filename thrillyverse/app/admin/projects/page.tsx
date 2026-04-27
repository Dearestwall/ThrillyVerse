'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminProjects() {
  const supabase = createClient()
  const [projects, setProjects] = useState<any[]>([])
  const [form, setForm] = useState({ title:'', description:'', logo_url:'', project_url:'', sort_order:'0' })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [editId, setEditId] = useState<string|null>(null)

  const load = async () => {
    const { data } = await supabase.from('projects').select('*').order('sort_order')
    setProjects(data || [])
  }
  useEffect(() => { load() }, [])

  const reset = () => { setForm({ title:'', description:'', logo_url:'', project_url:'', sort_order:'0' }); setEditId(null) }

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    const payload = { ...form, sort_order: parseInt(form.sort_order) || 0 }
    const { error } = editId
      ? await supabase.from('projects').update(payload).eq('id', editId)
      : await supabase.from('projects').insert(payload)
    if (error) setMsg('❌ ' + error.message)
    else { setMsg(editId ? '✅ Updated!' : '✅ Added!'); reset(); load() }
    setSaving(false)
  }

  const startEdit = (p: any) => {
    setForm({ title:p.title||'', description:p.description||'', logo_url:p.logo_url||'', project_url:p.project_url||'', sort_order:p.sort_order?.toString()||'0' })
    setEditId(p.id); window.scrollTo({ top:0, behavior:'smooth' })
  }

  // Fixed: was "deletsupabase" — now correctly uses .delete()
  const del = async (id: string) => {
    if (!confirm('Delete this project?')) return
    await supabase.from('projects').delete().eq('id', id)
    load()
  }

  const inp = 'w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500'

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-white mb-6">{editId ? '✏️ Edit Project' : '➕ Add Project'}</h1>
      {msg && <div className="mb-4 bg-gray-800 rounded-xl px-4 py-3 text-sm text-white">{msg}</div>}
      <form onSubmit={save} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="text-gray-400 text-xs block mb-1">Project Name *</label>
            <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required className={inp} /></div>
          <div><label className="text-gray-400 text-xs block mb-1">Project URL *</label>
            <input value={form.project_url} onChange={e=>setForm({...form,project_url:e.target.value})} required className={inp} placeholder="https://..." /></div>
          <div><label className="text-gray-400 text-xs block mb-1">Logo URL</label>
            <input value={form.logo_url} onChange={e=>setForm({...form,logo_url:e.target.value})} className={inp} placeholder="https://..." /></div>
          <div><label className="text-gray-400 text-xs block mb-1">Sort Order</label>
            <input value={form.sort_order} onChange={e=>setForm({...form,sort_order:e.target.value})} type="number" className={inp} /></div>
        </div>
        <div><label className="text-gray-400 text-xs block mb-1">Description</label>
          <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={2} className={inp} /></div>
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="bg-purple-700 hover:bg-purple-600 disabled:bg-gray-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors">
            {saving ? 'Saving...' : editId ? 'Update' : 'Add Project'}</button>
          {editId && <button type="button" onClick={reset} className="bg-gray-700 text-white px-6 py-2.5 rounded-xl text-sm">Cancel</button>}
        </div>
      </form>
      <div className="space-y-2">
        {projects.map(p=>(
          <div key={p.id} className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex items-center gap-3">
            {p.logo_url && <img src={p.logo_url} alt="" className="w-10 h-10 rounded-lg object-cover" />}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium">{p.title}</p>
              <a href={p.project_url} target="_blank" rel="noopener" className="text-purple-400 text-xs">{p.project_url}</a>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>startEdit(p)} className="text-blue-400 text-xs px-3 py-1.5 bg-blue-900/30 rounded-lg">Edit</button>
              <button onClick={()=>del(p.id)} className="text-red-400 text-xs px-3 py-1.5 bg-red-900/30 rounded-lg">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
