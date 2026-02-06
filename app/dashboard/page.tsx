'use client'

import { useState, useEffect } from 'react'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { ActiveProjects } from '@/components/dashboard/active-projects'
import { RecentActivity } from '@/components/dashboard/recent-activity'

// Derived demo stats from API responses

const initialProjects: any[] = []

const initialActivities: any[] = []

export default function DashboardPage() {
  const [projects, setProjects] = useState(initialProjects)
  const [stats, setStats] = useState({ activeProjects: 0, weeklyHours: 0, pendingRequests: 0, overdueInvoices: 0, monthlyEarnings: 0, monthlyGoal: 6000 })
  const [activities, setActivities] = useState(initialActivities)

  useEffect(() => {
    const safeFetchJson = async (url: string) => {
      try {
        const res = await fetch(url)
        if (!res.ok) return []
        const text = await res.text()
        return text ? JSON.parse(text) : []
      } catch {
        return []
      }
    }

    Promise.all([
      safeFetchJson('/api/projects'),
      safeFetchJson('/api/time-logs'),
      safeFetchJson('/api/scope-requests'),
      safeFetchJson('/api/invoices'),
    ]).then(([p, t, s, i]) => {
      const mappedProjects = (p || []).map((x: any) => ({
        id: x.id,
        name: x.name,
        client: { name: x.client?.name || 'Unknown', company: x.client?.company },
        status: x.status,
        type: x.type,
        hourlyRate: x.hourlyRate,
        fixedPrice: x.fixedPrice,
        estimatedHours: x.estimatedHours,
        actualHours: x.actualHours,
        dueDate: x.endDate ? new Date(x.endDate) : undefined,
        isTimerRunning: false,
      }))
      setProjects(mappedProjects)

      // Expose first project id for quick demo create in Scope page
      if (mappedProjects[0]) (window as any).__firstProjectId = mappedProjects[0].id

      const weeklyMs = 7 * 24 * 60 * 60 * 1000
      const now = Date.now()
      const weeklyHours = (t || [])
        .filter((log: any) => new Date(log.startTime).getTime() > now - weeklyMs)
        .reduce((sum: number, log: any) => sum + (log.duration || 0), 0) / 60
      const pendingRequests = (s || []).filter((x: any) => x.status === 'pending').length
      const overdueInvoices = (i || []).filter((x: any) => x.status === 'overdue').length
      const monthlyEarnings = (i || [])
        .filter((x: any) => x.status === 'paid' && new Date(x.paidAt || x.createdAt).getMonth() === new Date().getMonth())
        .reduce((sum: number, inv: any) => sum + inv.amount, 0)
      setStats({
        activeProjects: mappedProjects.filter((p: any) => p.status === 'active').length,
        weeklyHours,
        pendingRequests,
        overdueInvoices,
        monthlyEarnings,
        monthlyGoal: 6000,
      })

      const recentActivities = [
        ...(t || []).slice(0, 3).map((log: any) => ({ id: 't' + log.id, type: 'time_log' as const, title: 'Work session completed', description: log.description || 'Time logged', timestamp: new Date(log.startTime), project: log.project?.name })),
        ...(s || []).slice(0, 3).map((req: any) => ({ id: 's' + req.id, type: 'scope_request' as const, title: 'Scope request updated', description: req.title, timestamp: new Date(req.createdAt), status: req.status, project: req.project?.name })),
        ...(i || []).slice(0, 3).map((inv: any) => ({ id: 'i' + inv.id, type: 'invoice' as const, title: 'Invoice status', description: inv.invoiceNumber, timestamp: new Date(inv.createdAt), status: inv.status, project: inv.project?.name })),
      ]
      setActivities(recentActivities)
    })
  }, [])

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

      <StatsCards stats={stats} />

      <div className="grid gap-6 lg:grid-cols-3">
        <ActiveProjects projects={projects} onStartTimer={handleStartTimer} onStopTimer={handleStopTimer} />
        <RecentActivity activities={activities} />
      </div>
    </div>
  )
}