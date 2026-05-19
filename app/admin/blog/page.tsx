export const dynamic = 'force-dynamic'

import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { getAllPosts } from '@/lib/mdx'
import Link from 'next/link'
import { FileText, Calendar, Clock, Tag, ExternalLink } from 'lucide-react'
import { formatDate, safeHref } from '@/lib/utils'

export default async function AdminBlogPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const posts = getAllPosts()

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black" style={{ color: 'var(--foreground)' }}>Blog Posts</h1>
            <p className="mt-1" style={{ color: 'var(--muted)' }}>
              {posts.length} posts — edit MDX files in /content/blog/
            </p>
          </div>
        </div>

        <div
          className="p-4 rounded-xl mb-6 text-sm"
          style={{ background: 'rgba(var(--accent-rgb), 0.05)', border: '1px solid rgba(var(--accent-rgb), 0.2)', color: 'var(--muted)' }}
        >
          💡 Blog posts are managed as MDX files in <code className="font-mono" style={{ color: 'var(--accent)' }}>/content/blog/</code>.
          Create a new <code className="font-mono" style={{ color: 'var(--accent)' }}>.mdx</code> file to add a post.
        </div>

        <div className="flex flex-col gap-4">
          {posts.filter((p) => p.slug?.trim()).map((post) => (
            <div
              key={post.slug}
              className="p-5 rounded-2xl flex items-start justify-between gap-4"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg mt-0.5" style={{ background: 'rgba(var(--accent-rgb), 0.1)' }}>
                  <FileText size={16} style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <h3 className="font-bold" style={{ color: 'var(--foreground)' }}>{post.title}</h3>
                  <p className="text-sm mt-1 line-clamp-1" style={{ color: 'var(--muted)' }}>{post.excerpt}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: 'var(--muted)' }}>
                    <span className="flex items-center gap-1"><Calendar size={11} />{formatDate(post.date)}</span>
                    <span className="flex items-center gap-1"><Clock size={11} />{post.readTime} min</span>
                    <div className="flex gap-1">
                      {post.tags.map((t) => (
                        <span key={t} className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full"
                          style={{ background: 'rgba(var(--accent-rgb), 0.1)', color: 'var(--accent)' }}>
                          <Tag size={9} />{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <Link href={safeHref(`/blog/${post.slug}`, '/blog')} target="_blank" style={{ color: 'var(--muted)' }}
                className="flex-shrink-0 hover:text-[var(--accent)] transition-colors">
                <ExternalLink size={16} />
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
