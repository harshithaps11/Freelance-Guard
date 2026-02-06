export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// TEMP: assume a single demo user; replace with auth session.
async function getDemoUserId() {
  const user = await prisma.user.findFirst({ where: { email: 'demo@freelanceguard.dev' } })
  return user?.id || null
}

export async function GET() {
  const userId = await getDemoUserId()
  if (!userId) return NextResponse.json({}, { status: 200 })
  let settings = await prisma.userSettings.findUnique({ where: { userId } })
  if (!settings) {
    settings = await prisma.userSettings.create({
      data: { userId, hourlyRate: 75, currency: 'USD', monthlyGoal: 6000 },
    })
  }
  return NextResponse.json(settings)
}

export async function POST(req: NextRequest) {
  const userId = await getDemoUserId()
  const data = await req.json()
  if (!userId) return NextResponse.json({ error: 'User not found' }, { status: 400 })
  const saved = await prisma.userSettings.upsert({
    where: { userId },
    create: { ...data, userId },
    update: data,
  })
  return NextResponse.json(saved)
}


