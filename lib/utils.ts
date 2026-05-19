import type { BlogPost } from '@/lib/mdx'
export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(' ')
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function parseJsonSafe<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T
  } catch {
    return fallback
  }
}

/** Next.js <Link> must not receive null, undefined, or whitespace-only href (runtime error / 500). */
export function safeHref(href: string | null | undefined, fallback = '#'): string {
  if (href == null) return fallback
  const s = String(href).trim()
  return s.length > 0 ? s : fallback
}

/**
 * Admin/DB often stores URLs without scheme ("github.com/..."). Next.js treats that as an internal path.
 * Normalize to an absolute http(s) URL for external links.
 */
export function projectExternalHref(url: string | null | undefined): string {
  const raw = url == null ? '' : String(url).trim()
  if (!raw || raw === '#') return '#'
  if (raw.startsWith('mailto:') || raw.startsWith('tel:')) return raw
  if (raw.startsWith('/')) return raw
  if (/^https?:\/\//i.test(raw)) return raw
  return `https://${raw}`
}

export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor
}
