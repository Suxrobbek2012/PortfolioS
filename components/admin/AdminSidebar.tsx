'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  MessageSquare,
  Zap,
  Briefcase,
  Settings,
  LogOut,
  Code2,
} from 'lucide-react'
import { motion } from 'framer-motion'

const NAV_ITEMS = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/projects', icon: FolderOpen, label: 'Projects' },
  { href: '/admin/blog', icon: FileText, label: 'Blog' },
  { href: '/admin/messages', icon: MessageSquare, label: 'Messages' },
  { href: '/admin/comments', icon: MessageSquare, label: 'Comments' },
  { href: '/admin/skills', icon: Zap, label: 'Skills' },
  { href: '/admin/experience', icon: Briefcase, label: 'Experience' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="w-64 min-h-screen flex flex-col"
      style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)' }}
    >
      {/* Logo */}
      <div className="p-6" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--accent)', color: 'var(--background)' }}
          >
            <Code2 size={18} />
          </div>
          <div>
            <div className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>
              Admin Panel
            </div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              Portfolio CMS
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 flex flex-col gap-1">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href}>
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
                style={{
                  background: active ? 'rgba(var(--accent-rgb), 0.1)' : 'transparent',
                  color: active ? 'var(--accent)' : 'var(--muted)',
                  border: active ? '1px solid rgba(var(--accent-rgb), 0.2)' : '1px solid transparent',
                }}
              >
                <Icon size={16} />
                {label}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* Sign Out */}
      <div className="p-4" style={{ borderTop: '1px solid var(--border)' }}>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
          style={{ color: 'var(--muted)' }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLElement).style.color = '#ef4444'
            ;(e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLElement).style.color = 'var(--muted)'
            ;(e.currentTarget as HTMLElement).style.background = 'transparent'
          }}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
