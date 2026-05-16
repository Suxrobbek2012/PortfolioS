'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

export type Theme = 'dark-neon' | 'light-clean' | 'cyberpunk' | 'minimal-mono' | 'aurora'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme, event?: React.MouseEvent) => void
  themes: { id: Theme; label: string; accent: string; bg: string }[]
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark-neon',
  setTheme: () => {},
  themes: [],
})

export const THEMES: { id: Theme; label: string; accent: string; bg: string }[] = [
  { id: 'dark-neon', label: 'Dark Neon', accent: '#00ff88', bg: '#0a0a0a' },
  { id: 'light-clean', label: 'Light Clean', accent: '#6366f1', bg: '#ffffff' },
  { id: 'cyberpunk', label: 'Cyberpunk', accent: '#ff00ff', bg: '#1a0030' },
  { id: 'minimal-mono', label: 'Minimal Mono', accent: '#ffffff', bg: '#111111' },
  { id: 'aurora', label: 'Aurora', accent: '#a855f7', bg: '#0d1117' },
]

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark-neon')

  useEffect(() => {
    // Read from localStorage on mount
    try {
      const saved = localStorage.getItem('portfolio-theme') as Theme | null
      if (saved && THEMES.find((t) => t.id === saved)) {
        setThemeState(saved)
        document.documentElement.setAttribute('data-theme', saved)
      }
    } catch {
      // ignore
    }
  }, [])

  const setTheme = useCallback((newTheme: Theme, event?: React.MouseEvent) => {
    // Try View Transitions API for smooth theme switch
    if (
      event &&
      typeof document !== 'undefined' &&
      'startViewTransition' in document
    ) {
      const x = event.clientX
      const y = event.clientY
      const maxRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      )

      // @ts-ignore
      const transition = document.startViewTransition(() => {
        document.documentElement.setAttribute('data-theme', newTheme)
        setThemeState(newTheme)
        try { localStorage.setItem('portfolio-theme', newTheme) } catch {}
      })

      transition.ready
        .then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${maxRadius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 500,
              easing: 'ease-in-out',
              pseudoElement: '::view-transition-new(root)',
            }
          )
        })
        .catch(() => {})
    } else {
      document.documentElement.setAttribute('data-theme', newTheme)
      setThemeState(newTheme)
      try { localStorage.setItem('portfolio-theme', newTheme) } catch {}
    }
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
