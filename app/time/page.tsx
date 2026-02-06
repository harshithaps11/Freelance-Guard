'use client'

import { useEffect, useState } from 'react'
import { TimeTracker } from '@/components/time/time-tracker'
import { TimeLogs } from '@/components/time/time-logs'

export default function TimePage() {
  const [activeTimer, setActiveTimer] = useState<{
    projectId: string
    startTime: Date
    description: string
  } | null>(null)
  const [projects, setProjects] = useState<{ id: string; name: string; client: { name: string } }[]>([])
  const [timeLogs, setTimeLogs] = useState<any[]>([])

  useEffect(() => {
    const safeFetch = async (url: string) => {
      try {
        const res = await fetch(url)
        if (!res.ok) return []
        const text = await res.text()
        return text ? JSON.parse(text) : []
      } catch {
        return []
      }
    }

    Promise.all([safeFetch('/api/projects'), safeFetch('/api/time-logs')])
      .then(([projectsResp, logsResp]) => {
        const proj = (projectsResp || []).map((p: any) => ({ id: p.id, name: p.name, client: { name: p.client?.name || 'Unknown' } }))
        setProjects(proj)
        setTimeLogs(logsResp || [])
      })
      .catch(() => {
        setProjects([])
        setTimeLogs([])
      })
  }, [])

  const handleStartTimer = (projectId: string, description: string) => {
    setActiveTimer({ projectId, startTime: new Date(), description })
  }

  const handleStopTimer = async (description: string) => {
    if (!activeTimer) return
    const endTime = new Date()
    const duration = Math.floor((endTime.getTime() - activeTimer.startTime.getTime()) / (1000 * 60))

    const payload = {
      projectId: activeTimer.projectId,
      userId: undefined,
      description: description || activeTimer.description,
      startTime: activeTimer.startTime,
      endTime,
      duration,
      isRunning: false,
    }
    try {
      const res = await fetch('/api/time-logs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const saved = await res.json()
      setTimeLogs((prev) => [saved, ...prev])
    } finally {
      setActiveTimer(null)
    }
  }

  const handlePauseTimer = () => {}

  const handleEditLog = (logId: string) => {}

  const handleDeleteLog = (logId: string) => {
    setTimeLogs((prev) => prev.filter((l) => l.id !== logId))
  }

  const handleExportLogs = () => {}

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Time Tracker</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">Track your time across projects and manage your work logs.</p>
      </div>

      <TimeTracker
        projects={projects}
        activeTimer={activeTimer}
        onStartTimer={handleStartTimer}
        onStopTimer={handleStopTimer}
        onPauseTimer={handlePauseTimer}
      />

      <TimeLogs timeLogs={timeLogs} onEdit={handleEditLog} onDelete={handleDeleteLog} onExport={handleExportLogs} />
    </div>
  )
}