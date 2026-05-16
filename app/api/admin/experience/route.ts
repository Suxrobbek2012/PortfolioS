import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const exp = await prisma.experience.create({
    data: {
      title: body.title, company: body.company, location: body.location || null,
      startDate: body.startDate, endDate: body.endDate || null, current: body.current || false,
      description: body.description, order: 99,
    },
  })
  return NextResponse.json(exp)
}
