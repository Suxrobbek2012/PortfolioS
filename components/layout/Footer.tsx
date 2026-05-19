'use client'

import Link from 'next/link'
import { GitBranch, Send, Heart, ExternalLink, MessageCircle } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'
import { safeHref } from '@/lib/utils'

const SOCIAL_LINKS = [
  { href: 'https://github.com/suhrobbek', icon: GitBranch, label: 'GitHub' },
  { href: 'https://linkedin.com/in/suhrobbek', icon: ExternalLink, label: 'LinkedIn' },
  { href: 'https://twitter.com/suhrobbek', icon: MessageCircle, label: 'Twitter' },
  { href: 'https://t.me/suhrobbek', icon: Send, label: 'Telegram' },
]

export function Footer() {
  const { t } = useTranslations()
  return (
    <footer
      className="py-12 mt-20"
      style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)' }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div>
            <span className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
              SB<span style={{ color: 'var(--accent)' }}>.</span>
            </span>
            <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
              {t('footerTagline')}
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={safeHref(href, '#')}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="p-2 rounded-lg transition-all duration-200 hover:scale-110 footer-social-link"
                style={{
                  color: 'var(--muted)',
                  background: 'var(--surface-2)',
                }}
              >
                <Icon size={18} />
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-sm flex items-center gap-1 flex-wrap justify-center" style={{ color: 'var(--muted)' }}>
            {t('footerLove')}{' '}
            <Heart size={14} style={{ color: 'var(--accent)' }} fill="currentColor" />{' '}
            {t('footerBy') ? `${t('footerBy')} ` : ''}
            <span style={{ color: 'var(--accent)' }}>Suhrobbek</span> © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  )
}
