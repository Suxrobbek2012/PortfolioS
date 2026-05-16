'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, Briefcase } from 'lucide-react'
import toast from 'react-hot-toast'

interface Experience {
  id: string
  title: string
  company: string
  location: string | null
  startDate: string
  endDate: string | null
  current: boolean
  description: string
  order: number
}

export function ExperienceAdmin({ experience: initial }: { experience: Experience[] }) {
  const [experience, setExperience] = useState(initial)
  const [editing, setEditing] = useState<Experience | null>(null)
  const [showForm, setShowForm] = useState(false)

  const deleteExp = async (id: string) => {
    if (!confirm('Delete this experience?')) return
    const res = await fetch(`/api/admin/experience/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setExperience((e) => e.filter((x) => x.id !== id))
      toast.success('Experience deleted')
    }
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button onClick={() => { setEditing(null); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
          style={{ background: 'var(--accent)', color: 'var(--background)' }}>
          <Plus size={16} /> Add Experience
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {experience.map((exp) => (
          <div key={exp.id} className="p-5 rounded-2xl flex items-start justify-between gap-4"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg mt-0.5" style={{ background: 'rgba(var(--accent-rgb), 0.1)' }}>
                <Briefcase size={16} style={{ color: 'var(--accent)' }} />
              </div>
              <div>
                <h3 className="font-bold" style={{ color: 'var(--foreground)' }}>{exp.title}</h3>
                <p className="text-sm" style={{ color: 'var(--accent)' }}>{exp.company}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                  {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                  {exp.location && ` · ${exp.location}`}
                </p>
                <p className="text-sm mt-2 line-clamp-2" style={{ color: 'var(--muted)' }}>{exp.description}</p>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => { setEditing(exp); setShowForm(true) }} style={{ color: 'var(--muted)' }}><Edit2 size={14} /></button>
              <button onClick={() => deleteExp(exp.id)} style={{ color: 'var(--muted)' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#ef4444')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--muted)')}
              ><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showForm && (
          <ExperienceForm exp={editing} onClose={() => setShowForm(false)}
            onSave={(e) => {
              if (editing) setExperience((prev) => prev.map((x) => (x.id === e.id ? e : x)))
              else setExperience((prev) => [...prev, e])
              setShowForm(false)
            }} />
        )}
      </AnimatePresence>
    </div>
  )
}

function ExperienceForm({ exp, onClose, onSave }: { exp: Experience | null; onClose: () => void; onSave: (e: Experience) => void }) {
  const [form, setForm] = useState({
    title: exp?.title || '', company: exp?.company || '', location: exp?.location || '',
    startDate: exp?.startDate || '', endDate: exp?.endDate || '', current: exp?.current || false,
    description: exp?.description || '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch(exp ? `/api/admin/experience/${exp.id}` : '/api/admin/experience', {
      method: exp ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) { const data = await res.json(); onSave(data); toast.success(exp ? 'Updated' : 'Created') }
    setLoading(false)
  }

  const inputStyle = { background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--foreground)', borderRadius: '8px', padding: '0.6rem 0.75rem', width: '100%', fontSize: '0.875rem', outline: 'none' }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
        className="w-full max-w-lg rounded-2xl p-6"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }} onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>{exp ? 'Edit Experience' : 'New Experience'}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input style={inputStyle} placeholder="Job Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
          <input style={inputStyle} placeholder="Company" value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} required />
          <input style={inputStyle} placeholder="Location" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <input style={inputStyle} placeholder="Start (2022-01)" value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} required />
            <input style={inputStyle} placeholder="End (2024-01)" value={form.endDate} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} disabled={form.current} />
          </div>
          <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--foreground)' }}>
            <input type="checkbox" checked={form.current} onChange={(e) => setForm((f) => ({ ...f, current: e.target.checked }))} />
            Current position
          </label>
          <textarea style={{ ...inputStyle, resize: 'none' }} rows={3} placeholder="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} required />
          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-xl text-sm" style={{ background: 'var(--surface-2)', color: 'var(--muted)', border: '1px solid var(--border)' }}>Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-2 rounded-xl text-sm font-medium" style={{ background: 'var(--accent)', color: 'var(--background)' }}>{loading ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
