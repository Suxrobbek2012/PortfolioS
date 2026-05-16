export const dynamic = 'force-dynamic'

import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { CommentsAdmin } from '@/components/admin/CommentsAdmin'

export default async function AdminCommentsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: 'desc' },
    include: { project: { select: { title: true } } },
  })

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black" style={{ color: 'var(--foreground)' }}>Comments</h1>
          <p className="mt-1" style={{ color: 'var(--muted)' }}>
            {comments.filter((c) => !c.approved).length} pending moderation
          </p>
        </div>
        <CommentsAdmin comments={comments} />
      </main>
    </div>
  )
}
