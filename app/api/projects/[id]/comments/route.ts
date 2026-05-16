import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { filterContent, shouldBlock } from '@/lib/content-filter'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        projectId: params.id,
        approved: true,
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        content: true,
        createdAt: true,
      },
    })
    return NextResponse.json(comments)
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const { name, email, content } = body

    if (!name?.trim() || !content?.trim()) {
      return NextResponse.json({ error: 'Name and comment are required' }, { status: 400 })
    }

    if (content.trim().length < 3) {
      return NextResponse.json({ error: 'Comment is too short' }, { status: 400 })
    }

    if (content.trim().length > 1000) {
      return NextResponse.json({ error: 'Comment is too long (max 1000 chars)' }, { status: 400 })
    }

    // Silent content filter — user never knows it's happening
    if (shouldBlock(content)) {
      // Return success but don't save — user thinks it was posted
      return NextResponse.json({
        success: true,
        message: 'Comment submitted for review',
      })
    }

    const filtered = filterContent(content)
    const filteredName = filterContent(name)

    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      select: { id: true },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    await prisma.comment.create({
      data: {
        projectId: params.id,
        name: filteredName.filtered.trim().slice(0, 50),
        email: email?.trim().slice(0, 100) || null,
        content: filtered.filtered.trim(),
        approved: true, // auto-approve mild content
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Comment posted successfully',
    })
  } catch {
    return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 })
  }
}
