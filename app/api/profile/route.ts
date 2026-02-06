export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const user = await prisma.user.findFirst({ where: { email: 'demo@freelanceguard.dev' } })
  return NextResponse.json(user)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const user = await prisma.user.update({ where: { id: data.id }, data: { name: data.name, company: data.company } })
  return NextResponse.json(user)
}



