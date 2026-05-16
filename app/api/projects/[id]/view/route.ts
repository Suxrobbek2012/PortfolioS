import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Track views — only real unique visits (IP + project)
const viewedSessions = new Map<string, Set<string>>()

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown'

    const sessionKey = `${ip}:${params.id}`

    // Check if already viewed in this session (in-memory, resets on restart)
    if (!viewedSessions.has(ip)) {
      viewedSessions.set(ip, new Set())
    }

    const ipSessions = viewedSessions.get(ip)!

    if (ipSessions.has(params.id)) {
      // Already counted — return current count without incrementing
      const project = await prisma.project.findUnique({
        where: { id: params.id },
        select: { views: true },
      })
      return NextResponse.json({ views: project?.views ?? 0 })
    }

    // Mark as viewed
    ipSessions.add(params.id)

    // Increment view count
    const project = await prisma.project.update({
      where: { id: params.id },
      data: { views: { increment: 1 } },
      select: { views: true },
    })

    return NextResponse.json({ views: project.views })
  } catch {
    return NextResponse.json({ views: 0 })
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      select: { views: true },
    })
    return NextResponse.json({ views: project?.views ?? 0 })
  } catch {
    return NextResponse.json({ views: 0 })
  }
}
