export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

async function getDemoUserId() {
  const user = await prisma.user.findFirst({ where: { email: 'demo@freelanceguard.dev' } })
  return user?.id || null
}

export async function GET() {
  const logs = await prisma.timeLog.findMany({
    include: { project: { include: { client: true } } },
    orderBy: { startTime: 'desc' },
  })
  return NextResponse.json(logs)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  if (!data.userId) {
    const userId = await getDemoUserId()
    if (!userId) return NextResponse.json({ error: 'User not found' }, { status: 400 })
    data.userId = userId
  }
  const log = await prisma.timeLog.create({ data })
  return NextResponse.json(log, { status: 201 })
}


