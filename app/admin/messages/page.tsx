export const dynamic = 'force-dynamic'

import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { MessagesClient } from '@/components/admin/MessagesClient'

export default async function MessagesPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const messages = await prisma.message.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black" style={{ color: 'var(--foreground)' }}>
            Messages
          </h1>
          <p className="mt-1" style={{ color: 'var(--muted)' }}>
            {messages.filter((m) => !m.read).length} unread messages
          </p>
        </div>
        <MessagesClient messages={messages} />
      </main>
    </div>
  )
}
