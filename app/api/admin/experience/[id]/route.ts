import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const exp = await prisma.experience.update({
    where: { id: params.id },
    data: {
      title: body.title, company: body.company, location: body.location || null,
      startDate: body.startDate, endDate: body.endDate || null, current: body.current || false,
      description: body.description,
    },
  })
  return NextResponse.json(exp)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.experience.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
