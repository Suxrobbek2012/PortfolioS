'use client'

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'
import { LanguageProvider } from '@/components/layout/LanguageProvider'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import type { Session } from 'next-auth'

export function SessionProvider({
  children,
  session,
}: {
  children: React.ReactNode
  session: Session | null
}) {
  return (
    <NextAuthSessionProvider session={session}>
      <LanguageProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </LanguageProvider>
    </NextAuthSessionProvider>
  )
}
