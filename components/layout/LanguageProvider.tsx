'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import type { Language } from '@/lib/i18n'

interface LanguageContextType {
  lang: Language
  setLang: (language: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('en')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('portfolio-language') as Language
      if (saved && ['uz', 'ru', 'en'].includes(saved)) {
        setLangState(saved)
        return
      }
      const browserLang = navigator.language.split('-')[0].toLowerCase()
      if (browserLang === 'uz') setLangState('uz')
      else if (browserLang === 'ru') setLangState('ru')
      else setLangState('en')
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang
    }
  }, [lang])

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang)
    try {
      localStorage.setItem('portfolio-language', newLang)
    } catch {
      /* ignore */
    }
  }, [])

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
