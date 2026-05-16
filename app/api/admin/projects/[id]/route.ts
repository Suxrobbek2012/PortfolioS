import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { title, description, longDesc, image, tags, liveUrl, githubUrl, featured } = body

  const project = await prisma.project.update({
    where: { id: params.id },
    data: {
      title,
      description,
      longDesc: longDesc || null,
      image: image || null,
      tags: JSON.stringify(tags || []),
      liveUrl: liveUrl || null,
      githubUrl: githubUrl || null,
      featured: featured || false,
    },
  })

  return NextResponse.json(project)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.project.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
