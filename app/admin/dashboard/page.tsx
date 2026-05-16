export const dynamic = 'force-dynamic'

import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { FolderOpen, FileText, MessageSquare, Zap, Eye, TrendingUp } from 'lucide-react'

async function getStats() {
  const [projects, messages, skills, unreadMessages] = await Promise.all([
    prisma.project.count(),
    prisma.message.count(),
    prisma.skill.count(),
    prisma.message.count({ where: { read: false } }),
  ])
  return { projects, messages, skills, unreadMessages }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const stats = await getStats()

  const cards = [
    { label: 'Total Projects', value: stats.projects, icon: FolderOpen, color: '#00ff88' },
    { label: 'Total Messages', value: stats.messages, icon: MessageSquare, color: '#6366f1' },
    { label: 'Unread Messages', value: stats.unreadMessages, icon: Eye, color: '#f59e0b' },
    { label: 'Skills Listed', value: stats.skills, icon: Zap, color: '#ec4899' },
  ]

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black" style={{ color: 'var(--foreground)' }}>
            Dashboard
          </h1>
          <p className="mt-1" style={{ color: 'var(--muted)' }}>
            Welcome back, Admin 👋
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cards.map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="p-6 rounded-2xl"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="p-2 rounded-xl"
                  style={{ background: `${color}20` }}
                >
                  <Icon size={20} style={{ color }} />
                </div>
                <TrendingUp size={14} style={{ color: 'var(--muted)' }} />
              </div>
              <div className="text-3xl font-black" style={{ color: 'var(--foreground)' }}>
                {value}
              </div>
              <div className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div
          className="p-6 rounded-2xl"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { href: '/admin/projects', label: 'Add Project', icon: FolderOpen },
              { href: '/admin/blog', label: 'New Post', icon: FileText },
              { href: '/admin/messages', label: 'View Messages', icon: MessageSquare },
              { href: '/admin/settings', label: 'Settings', icon: Zap },
            ].map(({ href, label, icon: Icon }) => (
              <a
                key={href}
                href={href}
                className="flex items-center gap-2 p-3 rounded-xl text-sm font-medium transition-all hover:scale-105"
                style={{
                  background: 'var(--surface-2)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)',
                }}
              >
                <Icon size={16} style={{ color: 'var(--accent)' }} />
                {label}
              </a>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
