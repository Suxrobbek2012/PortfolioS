'use client'

import { useCallback } from 'react'
import { useLanguage } from '@/components/layout/LanguageProvider'
import { getTranslation, formatTranslation, type TranslationKey } from '@/lib/i18n'

export function useTranslations() {
  const { lang, setLang } = useLanguage()
  const t = useCallback(
    (key: TranslationKey) => getTranslation(lang, key),
    [lang]
  )
  const tf = useCallback(
    (key: TranslationKey, vars: Record<string, string | number>) => formatTranslation(lang, key, vars),
    [lang]
  )
  return {
    lang,
    setLang,
    t,
    tf,
  }
}
