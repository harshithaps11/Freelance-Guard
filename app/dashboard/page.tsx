'use client'

import { useState, useEffect } from 'react'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { ActiveProjects } from '@/components/dashboard/active-projects'
import { RecentActivity } from '@/components/dashboard/recent-activity'

// Mock data for demonstration
const mockStats = {
  activeProjects: 4,
  weeklyHours: 32.5,
  pendingRequests: 3,
  overdueInvoices: 1,
  monthlyEarnings: 4200,
  monthlyGoal: 6000,
}

const mockProjects = [
  {
    id: '1',
    name: 'E-commerce Website Redesign',
    client: { name: 'TechCorp Inc.', company: 'TechCorp' },
    status: 'active',
    type: 'hourly' as const,
    hourlyRate: 75,
    estimatedHours: 80,
    actualHours: 42.5,
    dueDate: new Date('2024-02-15'),
    isTimerRunning: false,
  },
  {
    id: '2',
    name: 'Mobile App Development',
    client: { name: 'StartupXYZ', company: 'StartupXYZ' },
    status: 'active',
    type: 'fixed' as const,
    fixedPrice: 5000,
    estimatedHours: 60,
    actualHours: 28,
    dueDate: new Date('2024-03-01'),
    isTimerRunning: true,
  },
  {
    id: '3',
    name: 'Brand Identity Package',
    client: { name: 'LocalBiz', company: 'Local Business' },
    status: 'paused',
    type: 'fixed' as const,
    fixedPrice: 2500,
    estimatedHours: 40,
    actualHours: 15,
    isTimerRunning: false,
  },
]

const mockActivities = [
  {
    id: '1',
    type: 'scope_request' as const,
    title: 'Additional feature request approved',
    description: 'Client requested extra payment gateway integration',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    status: 'approved',
    project: 'E-commerce Website Redesign',
  },
  {
    id: '2',
    type: 'time_log' as const,
    title: 'Work session completed',
    description: 'Frontend development - 3.5 hours logged',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    project: 'Mobile App Development',
  },
  {
    id: '3',
    type: 'invoice' as const,
    title: 'Invoice sent',
    description: 'Invoice #2024-001 sent to TechCorp Inc.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: 'sent',
    project: 'E-commerce Website Redesign',
  },
  {
    id: '4',
    type: 'payment' as const,
    title: 'Payment received',
    description: '$1,250.00 received via Stripe',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
    status: 'paid',
    project: 'Brand Identity Package',
  },
]

export default function DashboardPage() {
  const [projects, setProjects] = useState(mockProjects)

  const handleStartTimer = (projectId: string) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId 
        ? { ...p, isTimerRunning: true }
        : { ...p, isTimerRunning: false }
    ))
  }

  const handleStopTimer = (projectId: string) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId 
        ? { ...p, isTimerRunning: false }
        : p
    ))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Welcome back! Here's what's happening with your freelance business.
        </p>
      </div>

      <StatsCards stats={mockStats} />

      <div className="grid gap-6 lg:grid-cols-3">
        <ActiveProjects
          projects={projects}
          onStartTimer={handleStartTimer}
          onStopTimer={handleStopTimer}
        />
        <RecentActivity activities={mockActivities} />
      </div>
    </div>
  )
}