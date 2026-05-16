'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, Star, ExternalLink, GitBranch, Eye, Upload, X, ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'

interface Project {
  id: string
  title: string
  description: string
  longDesc: string | null
  image: string | null
  tags: string[]
  liveUrl: string | null
  githubUrl: string | null
  featured: boolean
  order: number
  views?: number
}

export function ProjectsAdmin({ projects: initial }: { projects: Project[] }) {
  const [projects, setProjects] = useState(initial)
  const [editing, setEditing] = useState<Project | null>(null)
  const [showForm, setShowForm] = useState(false)

  const deleteProject = async (id: string) => {
    if (!confirm('Delete this project?')) return
    const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setProjects((p) => p.filter((proj) => proj.id !== id))
      toast.success('Project deleted')
    }
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => { setEditing(null); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
          style={{ background: 'var(--accent)', color: 'var(--background)' }}
        >
          <Plus size={16} /> New Project
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence>
          {projects.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="rounded-2xl overflow-hidden"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              {/* Image preview */}
              <div
                className="h-32 relative flex items-center justify-center"
                style={{ background: 'var(--surface-2)' }}
              >
                {project.image ? (
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={28} style={{ color: 'var(--muted)', opacity: 0.4 }} />
                )}
                {project.featured && (
                  <div className="absolute top-2 left-2">
                    <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(var(--accent-rgb), 0.9)', color: 'var(--background)' }}>
                      <Star size={9} fill="currentColor" /> Featured
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{project.title}</h3>
                  <div className="flex gap-1.5 flex-shrink-0 ml-2">
                    <button onClick={() => { setEditing(project); setShowForm(true) }}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: 'var(--muted)', background: 'var(--surface-2)' }}>
                      <Edit2 size={13} />
                    </button>
                    <button onClick={() => deleteProject(project.id)}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: 'var(--muted)', background: 'var(--surface-2)' }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#ef4444')}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--muted)')}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--muted)' }}>{project.description}</p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {project.tags.slice(0, 3).map((t) => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-md"
                      style={{ background: 'var(--surface-2)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs" style={{ color: 'var(--muted)' }}>
                  <div className="flex gap-3">
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" className="flex items-center gap-1 hover:text-[var(--accent)] transition-colors">
                        <ExternalLink size={11} /> Live
                      </a>
                    )}
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" className="flex items-center gap-1 hover:text-[var(--accent)] transition-colors">
                        <GitBranch size={11} /> Code
                      </a>
                    )}
                  </div>
                  {(project.views ?? 0) > 0 && (
                    <span className="flex items-center gap-1">
                      <Eye size={11} /> {project.views}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showForm && (
          <ProjectForm
            project={editing}
            onClose={() => setShowForm(false)}
            onSave={(p) => {
              if (editing) setProjects((prev) => prev.map((x) => (x.id === p.id ? p : x)))
              else setProjects((prev) => [...prev, p])
              setShowForm(false)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function ImageUploader({
  value,
  onChange,
}: {
  value: string
  onChange: (url: string) => void
}) {
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.url) {
        onChange(data.url)
        toast.success('Image uploaded!')
      } else {
        toast.error(data.error || 'Upload failed')
      }
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>
        Project Image
      </label>
      <div
        className="relative rounded-xl overflow-hidden"
        style={{ border: '2px dashed var(--border)', background: 'var(--surface-2)' }}
      >
        {value ? (
          <div className="relative h-36">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-2 right-2 p-1.5 rounded-lg"
              style={{ background: 'rgba(0,0,0,0.6)', color: 'white' }}
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-full h-28 flex flex-col items-center justify-center gap-2 transition-colors"
            style={{ color: 'var(--muted)' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--accent)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--muted)')}
          >
            {uploading ? (
              <div className="animate-spin w-6 h-6 border-2 border-current border-t-transparent rounded-full" />
            ) : (
              <>
                <Upload size={22} />
                <span className="text-xs">Click to upload image</span>
                <span className="text-xs opacity-60">JPEG, PNG, WebP — max 5MB</span>
              </>
            )}
          </button>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFile}
        className="hidden"
      />
      {/* Or URL input */}
      <input
        type="text"
        placeholder="Or paste image URL or relative path..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-2 px-3 py-2 rounded-xl text-xs outline-none"
        style={{
          background: 'var(--surface-2)',
          border: '1px solid var(--border)',
          color: 'var(--foreground)',
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
        onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
      />
    </div>
  )
}

function ProjectForm({
  project,
  onClose,
  onSave,
}: {
  project: Project | null
  onClose: () => void
  onSave: (p: Project) => void
}) {
  const [form, setForm] = useState({
    title: project?.title || '',
    description: project?.description || '',
    longDesc: project?.longDesc || '',
    image: project?.image || '',
    tags: project?.tags.join(', ') || '',
    liveUrl: project?.liveUrl || '',
    githubUrl: project?.githubUrl || '',
    featured: project?.featured || false,
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    }

    const res = await fetch(
      project ? `/api/admin/projects/${project.id}` : '/api/admin/projects',
      {
        method: project ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    )

    if (res.ok) {
      const data = await res.json()
      onSave({ ...data, tags: payload.tags })
      toast.success(project ? 'Project updated' : 'Project created')
    } else {
      toast.error('Something went wrong')
    }

    setLoading(false)
  }

  const inputStyle = {
    background: 'var(--surface-2)',
    border: '1px solid var(--border)',
    color: 'var(--foreground)',
    borderRadius: '10px',
    padding: '0.6rem 0.75rem',
    width: '100%',
    fontSize: '0.875rem',
    outline: 'none',
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: 'blur(12px)', background: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-lg rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
            {project ? 'Edit Project' : 'New Project'}
          </h2>
          <button onClick={onClose} style={{ color: 'var(--muted)' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Image Upload */}
          <ImageUploader
            value={form.image}
            onChange={(url) => setForm((f) => ({ ...f, image: url }))}
          />

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted)' }}>Title *</label>
            <input style={inputStyle} placeholder="Project title" value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')} />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted)' }}>Short Description *</label>
            <textarea style={{ ...inputStyle, resize: 'none' }} rows={2} placeholder="Brief description"
              value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} required
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')} />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted)' }}>Full Description</label>
            <textarea style={{ ...inputStyle, resize: 'none' }} rows={3} placeholder="Detailed description (shown in modal)"
              value={form.longDesc} onChange={(e) => setForm((f) => ({ ...f, longDesc: e.target.value }))}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')} />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted)' }}>Tags (comma separated)</label>
            <input style={inputStyle} placeholder="React, Next.js, TypeScript" value={form.tags}
              onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted)' }}>Live URL</label>
              <input style={inputStyle} placeholder="https://..." value={form.liveUrl}
                onChange={(e) => setForm((f) => ({ ...f, liveUrl: e.target.value }))}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted)' }}>GitHub URL</label>
              <input style={inputStyle} placeholder="https://github.com/..." value={form.githubUrl}
                onChange={(e) => setForm((f) => ({ ...f, githubUrl: e.target.value }))}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')} />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--foreground)' }}>
            <input type="checkbox" checked={form.featured}
              onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
              className="w-4 h-4 rounded" style={{ accentColor: 'var(--accent)' }} />
            Mark as Featured project
          </label>

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium"
              style={{ background: 'var(--surface-2)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
              Cancel
            </button>
            <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium"
              style={{ background: 'var(--accent)', color: 'var(--background)', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
