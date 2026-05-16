import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/mdx'
import { BlogList } from '@/components/sections/BlogList'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Thoughts on web development, design, and technology.',
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <span
            className="text-sm font-semibold tracking-widest uppercase"
            style={{ color: 'var(--accent)' }}
          >
            Writing
          </span>
          <h1
            className="text-4xl md:text-5xl font-black mt-2"
            style={{ color: 'var(--foreground)' }}
          >
            Blog <span style={{ color: 'var(--accent)' }}>Posts</span>
          </h1>
          <p className="mt-4" style={{ color: 'var(--muted)' }}>
            Thoughts on web development, design patterns, and the craft of building software.
          </p>
        </div>

        <BlogList posts={posts} />
      </div>
    </div>
  )
}
