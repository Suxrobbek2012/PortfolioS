export const dynamic = 'force-dynamic'

import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { ProjectsAdmin } from '@/components/admin/ProjectsAdmin'
import { parseJsonSafe } from '@/lib/utils'

export default async function AdminProjectsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const projects = await prisma.project.findMany({ orderBy: { order: 'asc' } })
  const parsed = projects.map((p) => ({ ...p, tags: parseJsonSafe<string[]>(p.tags, []) }))

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black" style={{ color: 'var(--foreground)' }}>Projects</h1>
          <p className="mt-1" style={{ color: 'var(--muted)' }}>Manage your portfolio projects</p>
        </div>
        <ProjectsAdmin projects={parsed} />
      </main>
    </div>
  )
}
