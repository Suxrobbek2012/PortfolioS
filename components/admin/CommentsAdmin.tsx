'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Check, MessageCircle, Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Comment {
  id: string
  name: string
  email: string | null
  content: string
  approved: boolean
  createdAt: Date
  project: { title: string }
}

export function CommentsAdmin({ comments: initial }: { comments: Comment[] }) {
  const [comments, setComments] = useState(initial)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all')

  const approve = async (id: string) => {
    const res = await fetch(`/api/admin/comments/${id}/approve`, { method: 'PATCH' })
    if (res.ok) {
      setComments((c) => c.map((x) => (x.id === id ? { ...x, approved: true } : x)))
      toast.success('Comment approved')
    }
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this comment?')) return
    const res = await fetch(`/api/admin/comments/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setComments((c) => c.filter((x) => x.id !== id))
      toast.success('Comment deleted')
    }
  }

  const filtered = comments.filter((c) => {
    if (filter === 'pending') return !c.approved
    if (filter === 'approved') return c.approved
    return true
  })

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(['all', 'pending', 'approved'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all"
            style={{
              background: filter === f ? 'var(--accent)' : 'var(--surface)',
              color: filter === f ? 'var(--background)' : 'var(--muted)',
              border: `1px solid ${filter === f ? 'var(--accent)' : 'var(--border)'}`,
            }}
          >
            {f} {f === 'pending' && comments.filter((c) => !c.approved).length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-red-500 text-white">
                {comments.filter((c) => !c.approved).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16" style={{ color: 'var(--muted)' }}>
          <MessageCircle size={32} className="mx-auto mb-3 opacity-30" />
          <p>No comments found</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {filtered.map((comment) => (
              <motion.div
                key={comment.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-5 rounded-2xl"
                style={{
                  background: 'var(--surface)',
                  border: `1px solid ${!comment.approved ? 'rgba(245,158,11,0.3)' : 'var(--border)'}`,
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
                        {comment.name}
                      </span>
                      {comment.email && (
                        <span className="text-xs" style={{ color: 'var(--muted)' }}>
                          {comment.email}
                        </span>
                      )}
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: 'rgba(var(--accent-rgb), 0.1)',
                          color: 'var(--accent)',
                        }}
                      >
                        {comment.project.title}
                      </span>
                      {!comment.approved && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-500">
                          Pending
                        </span>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--muted)' }}>
                      {comment.content}
                    </p>
                    <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted)' }}>
                      <Clock size={10} />
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    {!comment.approved && (
                      <button
                        onClick={() => approve(comment.id)}
                        className="p-2 rounded-xl transition-colors"
                        style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}
                        title="Approve"
                      >
                        <Check size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => remove(comment.id)}
                      className="p-2 rounded-xl transition-colors"
                      style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
