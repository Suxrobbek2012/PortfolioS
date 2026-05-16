import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') || 'Suhrobbek Baxtiyorov'
  const subtitle = searchParams.get('subtitle') || 'Full Stack Developer & UI/UX Designer'

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          padding: '60px',
        }}
      >
        {/* Accent border */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #00ff88, #00cc6a)',
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            borderRadius: '16px',
            background: '#00ff88',
            marginBottom: '32px',
            fontSize: '36px',
            fontWeight: 900,
            color: '#0a0a0a',
          }}
        >
          SB
        </div>

        <div
          style={{
            fontSize: '56px',
            fontWeight: 900,
            color: '#e2e8f0',
            textAlign: 'center',
            lineHeight: 1.1,
            marginBottom: '16px',
            maxWidth: '900px',
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontSize: '28px',
            color: '#00ff88',
            textAlign: 'center',
          }}
        >
          {subtitle}
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            fontSize: '18px',
            color: '#4a5568',
          }}
        >
          portfolio.dev
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
