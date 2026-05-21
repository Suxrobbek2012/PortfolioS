import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <main style={{ padding: '6rem 1.5rem', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', maxWidth: 720 }}>
        <h1 style={{ fontSize: 48, marginBottom: 12 }}>401 — Unauthorized</h1>
        <p style={{ color: 'var(--muted)', marginBottom: 20 }}>You must be signed in to access this page. Please log in and try again.</p>
        <Link href="/admin/login" style={{ color: 'var(--accent)' }}>Go to Admin login</Link>
      </div>
    </main>
  )
}
