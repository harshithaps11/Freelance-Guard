import { PrismaClient, ProjectStatus, ProjectType, InvoiceStatus, ScopeStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'demo@freelanceguard.dev' },
    update: {},
    create: {
      email: 'demo@freelanceguard.dev',
      name: 'Demo User',
      company: 'Freelance Guard',
      settings: {
        create: {
          hourlyRate: 75,
          currency: 'USD',
          monthlyGoal: 6000,
        },
      },
    },
    include: { settings: true },
  })

  let client1 = await prisma.client.findFirst({ where: { email: 'john@techcorp.com' } })
  if (!client1) {
    client1 = await prisma.client.create({
      data: { name: 'John Smith', company: 'TechCorp Inc.', email: 'john@techcorp.com' },
    })
  }

  let client2 = await prisma.client.findFirst({ where: { email: 'sarah@startupxyz.com' } })
  if (!client2) {
    client2 = await prisma.client.create({
      data: { name: 'Sarah Johnson', company: 'StartupXYZ', email: 'sarah@startupxyz.com' },
    })
  }

  const project1 = await prisma.project.create({
    data: {
      name: 'E-commerce Website Redesign',
      description: 'Modernize storefront and checkout flow',
      clientId: client1.id,
      userId: user.id,
      status: ProjectStatus.active,
      type: ProjectType.hourly,
      hourlyRate: 75,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-02-15'),
      estimatedHours: 80,
      actualHours: 42.5,
    },
  })

  const project2 = await prisma.project.create({
    data: {
      name: 'Mobile App Development',
      description: 'Delivery app (iOS + Android)',
      clientId: client2.id,
      userId: user.id,
      status: ProjectStatus.active,
      type: ProjectType.fixed,
      fixedPrice: 5000,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-03-01'),
      estimatedHours: 60,
      actualHours: 28,
    },
  })

  await prisma.timeLog.createMany({
    data: [
      {
        projectId: project1.id,
        userId: user.id,
        description: 'Frontend layouts and responsive design',
        startTime: new Date('2024-01-15T09:00:00Z'),
        endTime: new Date('2024-01-15T12:30:00Z'),
        duration: 210,
        isRunning: false,
      },
      {
        projectId: project2.id,
        userId: user.id,
        description: 'Auth flow implementation',
        startTime: new Date('2024-01-15T14:00:00Z'),
        endTime: new Date('2024-01-15T16:00:00Z'),
        duration: 120,
        isRunning: false,
      },
    ],
  })

  await prisma.scopeRequest.createMany({
    data: [
      {
        projectId: project1.id,
        userId: user.id,
        title: 'Additional Payment Gateway Integration',
        description: 'Add PayPal and Apple Pay',
        estimatedHours: 8,
        hourlyRate: 75,
        totalCost: 600,
        status: ScopeStatus.approved,
        clientApproved: true,
      },
      {
        projectId: project2.id,
        userId: user.id,
        title: 'Custom Admin Dashboard',
        description: 'Analytics and reporting',
        estimatedHours: 20,
        hourlyRate: 75,
        totalCost: 1500,
        status: ScopeStatus.pending,
        clientApproved: false,
      },
    ],
  })

  await prisma.invoice.createMany({
    data: [
      {
        invoiceNumber: 'INV-2024-001',
        projectId: project1.id,
        userId: user.id,
        amount: 3187.5,
        hours: 42.5,
        scopeCharges: 600,
        status: InvoiceStatus.paid,
        dueDate: new Date('2024-01-30'),
        paidAt: new Date('2024-01-28'),
      },
      {
        invoiceNumber: 'INV-2024-002',
        projectId: project2.id,
        userId: user.id,
        amount: 2100,
        hours: 28,
        scopeCharges: 0,
        status: InvoiceStatus.sent,
        dueDate: new Date('2024-02-15'),
      },
    ],
  })

  console.log('Seed complete')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


