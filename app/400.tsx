import Link from 'next/link'

export default function BadRequest() {
  return (
    <main style={{ padding: '6rem 1.5rem', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', maxWidth: 720 }}>
        <h1 style={{ fontSize: 48, marginBottom: 12 }}>400 — Bad Request</h1>
        <p style={{ color: 'var(--muted)', marginBottom: 20 }}>The request was invalid or cannot be served. Check the URL or request payload and try again.</p>
        <Link href="/" style={{ color: 'var(--accent)' }}>Go back home</Link>
      </div>
    </main>
  )
}
