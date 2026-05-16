export const dynamic = 'force-dynamic'

import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { SettingsAdmin } from '@/components/admin/SettingsAdmin'

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const settings = await prisma.settings.findMany()
  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]))

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black" style={{ color: 'var(--foreground)' }}>Settings</h1>
          <p className="mt-1" style={{ color: 'var(--muted)' }}>Manage your portfolio information</p>
        </div>
        <SettingsAdmin settings={settingsMap} />
      </main>
    </div>
  )
}
