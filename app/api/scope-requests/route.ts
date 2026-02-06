export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const requests = await prisma.scopeRequest.findMany({
    include: { project: { include: { client: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(requests)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  if (!data.userId) {
    const user = await prisma.user.findFirst({ where: { email: 'demo@freelanceguard.dev' } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 400 })
    data.userId = user.id
  }
  const request = await prisma.scopeRequest.create({ data })
  return NextResponse.json(request, { status: 201 })
}


