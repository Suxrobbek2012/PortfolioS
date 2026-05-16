import { SessionProvider } from '@/components/admin/SessionProvider'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen" style={{ background: 'var(--background)' }}>
        {children}
      </div>
    </SessionProvider>
  )
}
