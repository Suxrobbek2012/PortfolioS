'use client'

import { useEffect, useState } from 'react'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ThemeSwitcher } from './ThemeSwitcher'

export function AdminControls() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="flex items-center gap-2">
      <LanguageSwitcher />
      <ThemeSwitcher />
    </div>
  )
}
