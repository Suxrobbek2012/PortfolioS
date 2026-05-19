'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, MailOpen, Trash2, Calendar } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Message {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  read: boolean
  createdAt: Date
}

export function MessagesClient({ messages: initial }: { messages: Message[] }) {
  const [messages, setMessages] = useState(initial)
  const [selected, setSelected] = useState<Message | null>(null)

  const markRead = async (id: string) => {
    await fetch(`/api/admin/messages/${id}/read`, { method: 'PATCH' })
    setMessages((msgs) => msgs.map((m) => (m.id === id ? { ...m, read: true } : m)))
  }

  const deleteMessage = async (id: string) => {
    await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' })
    setMessages((msgs) => msgs.filter((m) => m.id !== id))
    if (selected?.id === id) setSelected(null)
    toast.success('Message deleted')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* List */}
      <div className="lg:col-span-1 flex flex-col gap-2">
        {messages.length === 0 && (
          <div className="text-center py-12" style={{ color: 'var(--muted)' }}>
            No messages yet
          </div>
        )}
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onClick={() => { setSelected(msg); markRead(msg.id) }}
              className="p-4 rounded-xl cursor-pointer transition-all"
              style={{
                background: selected?.id === msg.id ? 'rgba(var(--accent-rgb), 0.1)' : 'var(--surface)',
                border: `1px solid ${selected?.id === msg.id ? 'var(--accent)' : 'var(--border)'}`,
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  {msg.read ? (
                    <MailOpen size={14} style={{ color: 'var(--muted)', flexShrink: 0 }} />
                  ) : (
                    <Mail size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                  )}
                  <span
                    className="text-sm font-semibold truncate"
                    style={{ color: msg.read ? 'var(--muted)' : 'var(--foreground)' }}
                  >
                    {msg.name}
                  </span>
                </div>
                {!msg.read && (
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                    style={{ background: 'var(--accent)' }}
                  />
                )}
              </div>
              <p className="text-xs mt-1 truncate" style={{ color: 'var(--muted)' }}>
                {msg.subject || msg.message}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                {formatDate(msg.createdAt)}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Detail */}
      <div className="lg:col-span-2">
        {selected ? (
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl h-full"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
                  {selected.subject || 'No Subject'}
                </h2>
                <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
                  From: <span style={{ color: 'var(--accent)' }}>{selected.name}</span> &lt;{selected.email}&gt;
                </p>
                <p className="text-xs mt-1 flex items-center gap-1" style={{ color: 'var(--muted)' }}>
                  <Calendar size={11} />
                  {formatDate(selected.createdAt)}
                </p>
              </div>
              <button
                onClick={() => deleteMessage(selected.id)}
                className="p-2 rounded-lg transition-colors"
                style={{ color: 'var(--muted)' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#ef4444')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--muted)')}
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div
              className="p-4 rounded-xl text-sm leading-relaxed"
              style={{
                background: 'var(--surface-2)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
              }}
            >
              {selected.message}
            </div>

            <a
              href={selected.email?.trim() ? `mailto:${selected.email.trim()}` : '#'}
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl text-sm font-medium"
              style={{
                background: 'var(--accent)',
                color: 'var(--background)',
                pointerEvents: selected.email?.trim() ? 'auto' : 'none',
                opacity: selected.email?.trim() ? 1 : 0.5,
              }}
            >
              <Mail size={14} />
              Reply via Email
            </a>
          </motion.div>
        ) : (
          <div
            className="flex items-center justify-center h-64 rounded-2xl"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)' }}
          >
            Select a message to read
          </div>
        )}
      </div>
    </div>
  )
}
