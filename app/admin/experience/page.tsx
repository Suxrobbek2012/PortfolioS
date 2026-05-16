export const dynamic = 'force-dynamic'

import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { ExperienceAdmin } from '@/components/admin/ExperienceAdmin'

export default async function AdminExperiencePage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const experience = await prisma.experience.findMany({ orderBy: { order: 'asc' } })

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black" style={{ color: 'var(--foreground)' }}>Experience</h1>
          <p className="mt-1" style={{ color: 'var(--muted)' }}>Manage your work history</p>
        </div>
        <ExperienceAdmin experience={experience} />
      </main>
    </div>
  )
}
