'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'
import type { Language } from '@/lib/i18n'

const LANGUAGES: { id: Language; label: string; flag: string }[] = [
  { id: 'uz', label: 'Ўзбек', flag: '🇺🇿' },
  { id: 'ru', label: 'Русский', flag: '🇷🇺' },
  { id: 'en', label: 'English', flag: '🇬🇧' },
]

export function LanguageSwitcher() {
  const { lang, setLang, t } = useTranslations()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang)
    setOpen(false)
  }

  const currentLang = LANGUAGES.find((l) => l.id === lang)

  if (!mounted) return null

  return (
    <div className="relative">
      <motion.button
        ref={btnRef}
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: open ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className="p-2 rounded-lg transition-colors flex items-center gap-2"
        style={{
          background: 'var(--surface)',
          color: 'var(--accent)',
          border: '1px solid var(--border)',
        }}
        aria-label="Switch language"
        title={`Current: ${currentLang?.label}`}
      >
        <Globe size={18} />
        <span className="text-xs font-semibold">{lang.toUpperCase()}</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-12 z-50 rounded-xl p-3 min-w-[160px]"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              }}
            >
              <p className="text-xs font-semibold mb-2 px-2" style={{ color: 'var(--muted)' }}>
                {t('languageMenuTitle').toUpperCase()}
              </p>
              {LANGUAGES.map((l) => (
                <button
                  key={l.id}
                  onClick={() => handleLanguageChange(l.id)}
                  className="w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-colors text-left hover:bg-opacity-50"
                  style={{
                    background: lang === l.id ? 'rgba(var(--accent-rgb), 0.1)' : 'transparent',
                    color: lang === l.id ? 'var(--accent)' : 'var(--foreground)',
                  }}
                >
                  <span className="text-lg">{l.flag}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{l.label}</div>
                    <div className="text-xs" style={{ color: 'var(--muted)' }}>
                      {l.id.toUpperCase()}
                    </div>
                  </div>
                  {lang === l.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 rounded-full"
                      style={{ background: 'var(--accent)' }}
                    />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
