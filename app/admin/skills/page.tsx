export const dynamic = 'force-dynamic'

import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { SkillsAdmin } from '@/components/admin/SkillsAdmin'

export default async function AdminSkillsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const skills = await prisma.skill.findMany({ orderBy: { order: 'asc' } })

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black" style={{ color: 'var(--foreground)' }}>Skills</h1>
          <p className="mt-1" style={{ color: 'var(--muted)' }}>Manage your technical skills</p>
        </div>
        <SkillsAdmin skills={skills} />
      </main>
    </div>
  )
}
