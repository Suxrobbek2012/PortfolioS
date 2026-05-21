import Link from 'next/link'

export default function ForbiddenPage() {
  return (
    <main style={{ padding: '6rem 1.5rem', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', maxWidth: 720 }}>
        <h1 style={{ fontSize: 48, marginBottom: 12 }}>403 — Forbidden</h1>
        <p style={{ color: 'var(--muted)', marginBottom: 20 }}>You don't have permission to access this resource.</p>
        <Link href="/" style={{ color: 'var(--accent)' }}>Return home</Link>
      </div>
    </main>
  )
}
