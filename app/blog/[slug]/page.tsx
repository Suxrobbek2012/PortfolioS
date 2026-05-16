import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPosts } from '@/lib/mdx'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { formatDate } from '@/lib/utils'
import { Calendar, Clock, ArrowLeft, Tag } from 'lucide-react'
import Link from 'next/link'
import { ReadingProgress } from '@/components/ui/ReadingProgress'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
    },
  }
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug)
  if (!post) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: 'Suhrobbek Baxtiyorov',
    },
  }

  return (
    <>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="min-h-screen pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Back */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm mb-8 transition-colors hover:text-[var(--accent)]"
            style={{ color: 'var(--muted)' }}
          >
            <ArrowLeft size={16} />
            Back to Blog
          </Link>

          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 text-xs px-3 py-1 rounded-full"
                  style={{
                    background: 'rgba(var(--accent-rgb), 0.1)',
                    color: 'var(--accent)',
                    border: '1px solid rgba(var(--accent-rgb), 0.2)',
                  }}
                >
                  <Tag size={10} />
                  {tag}
                </span>
              ))}
            </div>

            <h1
              className="text-4xl md:text-5xl font-black leading-tight mb-6"
              style={{ color: 'var(--foreground)' }}
            >
              {post.title}
            </h1>

            <div className="flex items-center gap-6 text-sm" style={{ color: 'var(--muted)' }}>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {post.readTime} min read
              </span>
            </div>

            <div
              className="mt-6 pt-6"
              style={{ borderTop: '1px solid var(--border)' }}
            />
          </header>

          {/* Content */}
          <div className="prose max-w-none">
            <MDXRemote source={post.content} />
          </div>
        </div>
      </article>
    </>
  )
}
