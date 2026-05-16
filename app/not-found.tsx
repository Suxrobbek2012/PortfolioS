import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-6 px-6"
      style={{ background: 'var(--background)' }}
    >
      <div
        className="text-8xl font-black"
        style={{ color: 'var(--accent)' }}
      >
        404
      </div>
      <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
        Page Not Found
      </h1>
      <p style={{ color: 'var(--muted)' }}>
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl font-semibold text-sm"
        style={{ background: 'var(--accent)', color: 'var(--background)' }}
      >
        Go Home
      </Link>
    </div>
  )
}
