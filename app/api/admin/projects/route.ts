import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { title, description, longDesc, image, tags, liveUrl, githubUrl, featured } = body

  const project = await prisma.project.create({
    data: {
      title,
      description,
      longDesc: longDesc || null,
      image: image || null,
      tags: JSON.stringify(tags || []),
      liveUrl: liveUrl || null,
      githubUrl: githubUrl || null,
      featured: featured || false,
      order: 99,
    },
  })

  return NextResponse.json(project)
}
