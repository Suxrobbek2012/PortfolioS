import Link from 'next/link'

export default function ServerError() {
  return (
    <main style={{ padding: '6rem 1.5rem', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', maxWidth: 720 }}>
        <h1 style={{ fontSize: 48, marginBottom: 12 }}>500 — Server Error</h1>
        <p style={{ color: 'var(--muted)', marginBottom: 20 }}>Something went wrong on the server. Try again later or contact the site administrator.</p>
        <Link href="/" style={{ color: 'var(--accent)' }}>Return home</Link>
      </div>
    </main>
  )
}
