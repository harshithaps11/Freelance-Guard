export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const clients = await prisma.client.findMany({ orderBy: { name: 'asc' } })
    return NextResponse.json(clients)
  } catch (err) {
    console.error('GET /api/clients error', err)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    if (!data || !data.email || !data.name) {
      return NextResponse.json({ error: 'name and email are required' }, { status: 400 })
    }
    const existing = await prisma.client.findFirst({ where: { email: data.email } })
    let client = existing
    if (!client) {
      client = await prisma.client.create({ data: { name: data.name, email: data.email, company: data.company || null } })
    }
    return NextResponse.json(client, { status: existing ? 200 : 201 })
  } catch (err) {
    console.error('POST /api/clients error', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}


