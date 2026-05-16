import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const skill = await prisma.skill.create({
    data: { name: body.name, level: body.level, category: body.category, icon: body.icon || null, order: 99 },
  })
  return NextResponse.json(skill)
}
