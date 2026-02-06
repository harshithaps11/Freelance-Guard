export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const projects = await prisma.project.findMany({
    include: { client: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(projects)
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json()
    const body: any = { ...raw }

    if (!body.clientId) {
      return NextResponse.json({ error: 'clientId is required' }, { status: 400 })
    }

    if (!body.userId) {
      const user = await prisma.user.findFirst({ where: { email: 'demo@freelanceguard.dev' } })
      if (!user) return NextResponse.json({ error: 'User not found' }, { status: 400 })
      body.userId = user.id
    }

    body.status = body.status || 'active'
    body.type = body.type || 'hourly'
    body.startDate = body.startDate ? new Date(body.startDate) : new Date()
    if (body.endDate) body.endDate = new Date(body.endDate)
    if (body.hourlyRate != null) body.hourlyRate = Number(body.hourlyRate)
    if (body.fixedPrice != null) body.fixedPrice = Number(body.fixedPrice)
    if (body.estimatedHours != null) body.estimatedHours = Number(body.estimatedHours)

    const project = await prisma.project.create({
      data: body,
      include: { client: true },
    })
    return NextResponse.json(project, { status: 201 })
  } catch (err) {
    console.error('POST /api/projects error', err)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}


