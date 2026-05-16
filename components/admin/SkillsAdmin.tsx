'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Skill {
  id: string
  name: string
  level: number
  category: string
  icon: string | null
  order: number
}

export function SkillsAdmin({ skills: initial }: { skills: Skill[] }) {
  const [skills, setSkills] = useState(initial)
  const [editing, setEditing] = useState<Skill | null>(null)
  const [showForm, setShowForm] = useState(false)

  const deleteSkill = async (id: string) => {
    if (!confirm('Delete this skill?')) return
    const res = await fetch(`/api/admin/skills/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setSkills((s) => s.filter((sk) => sk.id !== id))
      toast.success('Skill deleted')
    }
  }

  const categories = ['frontend', 'backend', 'tools']

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button
          onClick={() => { setEditing(null); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
          style={{ background: 'var(--accent)', color: 'var(--background)' }}
        >
          <Plus size={16} /> Add Skill
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat} className="p-5 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <h3 className="font-bold capitalize mb-4" style={{ color: 'var(--foreground)' }}>{cat}</h3>
            <div className="flex flex-col gap-3">
              {skills.filter((s) => s.category === cat).map((skill) => (
                <div key={skill.id} className="flex items-center justify-between">
                  <div className="flex-1 mr-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span style={{ color: 'var(--foreground)' }}>{skill.name}</span>
                      <span style={{ color: 'var(--accent)' }}>{skill.level}%</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: 'var(--surface-2)' }}>
                      <div className="h-full rounded-full" style={{ width: `${skill.level}%`, background: 'var(--accent)' }} />
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditing(skill); setShowForm(true) }} style={{ color: 'var(--muted)' }}><Edit2 size={13} /></button>
                    <button onClick={() => deleteSkill(skill.id)} style={{ color: 'var(--muted)' }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#ef4444')}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--muted)')}
                    ><Trash2 size={13} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showForm && (
          <SkillForm
            skill={editing}
            onClose={() => setShowForm(false)}
            onSave={(s) => {
              if (editing) setSkills((prev) => prev.map((x) => (x.id === s.id ? s : x)))
              else setSkills((prev) => [...prev, s])
              setShowForm(false)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function SkillForm({ skill, onClose, onSave }: { skill: Skill | null; onClose: () => void; onSave: (s: Skill) => void }) {
  const [form, setForm] = useState({
    name: skill?.name || '',
    level: skill?.level || 50,
    category: skill?.category || 'frontend',
    icon: skill?.icon || '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch(skill ? `/api/admin/skills/${skill.id}` : '/api/admin/skills', {
      method: skill ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      const data = await res.json()
      onSave(data)
      toast.success(skill ? 'Skill updated' : 'Skill created')
    }
    setLoading(false)
  }

  const inputStyle = { background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--foreground)', borderRadius: '8px', padding: '0.6rem 0.75rem', width: '100%', fontSize: '0.875rem', outline: 'none' }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
        className="w-full max-w-sm rounded-2xl p-6"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }} onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>{skill ? 'Edit Skill' : 'New Skill'}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input style={inputStyle} placeholder="Skill name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Level: {form.level}%</label>
            <input type="range" min={0} max={100} value={form.level} onChange={(e) => setForm((f) => ({ ...f, level: parseInt(e.target.value) }))} className="w-full" style={{ accentColor: 'var(--accent)' }} />
          </div>
          <select style={inputStyle} value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="tools">Tools</option>
          </select>
          <input style={inputStyle} placeholder="Icon key (e.g. react)" value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} />
          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-xl text-sm" style={{ background: 'var(--surface-2)', color: 'var(--muted)', border: '1px solid var(--border)' }}>Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-2 rounded-xl text-sm font-medium" style={{ background: 'var(--accent)', color: 'var(--background)' }}>{loading ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
