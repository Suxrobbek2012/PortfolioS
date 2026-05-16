'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette } from 'lucide-react'
import { useTheme, THEMES, type Theme } from './ThemeProvider'

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)

  const handleThemeChange = (newTheme: Theme, e: React.MouseEvent) => {
    setTheme(newTheme, e)
    setOpen(false)
  }

  return (
    <div className="relative">
      <motion.button
        ref={btnRef}
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: open ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className="p-2 rounded-lg transition-colors"
        style={{
          background: 'var(--surface)',
          color: 'var(--accent)',
          border: '1px solid var(--border)',
        }}
        aria-label="Switch theme"
      >
        <Palette size={18} />
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
              className="absolute right-0 top-12 z-50 rounded-xl p-3 min-w-[180px]"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              }}
            >
              <p className="text-xs font-semibold mb-2 px-2" style={{ color: 'var(--muted)' }}>
                THEME
              </p>
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={(e) => handleThemeChange(t.id, e)}
                  className="w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-colors text-left"
                  style={{
                    background: theme === t.id ? 'rgba(var(--accent-rgb), 0.1)' : 'transparent',
                    color: theme === t.id ? 'var(--accent)' : 'var(--foreground)',
                  }}
                >
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0 border-2"
                    style={{
                      background: t.accent,
                      borderColor: theme === t.id ? 'var(--foreground)' : 'transparent',
                    }}
                  />
                  <span className="text-sm font-medium">{t.label}</span>
                  {theme === t.id && (
                    <motion.div
                      layoutId="active-theme"
                      className="ml-auto w-1.5 h-1.5 rounded-full"
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
