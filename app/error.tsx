'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-6 px-6"
      style={{ background: 'var(--background)' }}
    >
      <div className="text-6xl font-black" style={{ color: '#ef4444' }}>
        500
      </div>
      <h2 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
        Something went wrong
      </h2>
      <p className="text-sm" style={{ color: 'var(--muted)' }}>
        {error.message || 'An unexpected error occurred'}
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-6 py-3 rounded-xl font-semibold text-sm"
          style={{ background: 'var(--accent)', color: 'var(--background)' }}
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl font-semibold text-sm"
          style={{
            background: 'var(--surface)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
          }}
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
