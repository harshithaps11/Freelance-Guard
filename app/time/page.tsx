'use client'

import { useState } from 'react'
import { TimeTracker } from '@/components/time/time-tracker'
import { TimeLogs } from '@/components/time/time-logs'

// Mock data
const mockProjects = [
  {
    id: '1',
    name: 'E-commerce Website Redesign',
    client: { name: 'TechCorp Inc.' },
  },
  {
    id: '2',
    name: 'Mobile App Development',
    client: { name: 'StartupXYZ' },
  },
  {
    id: '3',
    name: 'Brand Identity Package',
    client: { name: 'LocalBiz' },
  },
]

const mockTimeLogs = [
  {
    id: '1',
    project: { name: 'E-commerce Website Redesign', client: { name: 'TechCorp Inc.' } },
    description: 'Working on product page layouts and responsive design',
    startTime: new Date('2024-01-15T09:00:00'),
    endTime: new Date('2024-01-15T12:30:00'),
    duration: 210, // 3.5 hours
    isRunning: false,
  },
  {
    id: '2',
    project: { name: 'Mobile App Development', client: { name: 'StartupXYZ' } },
    description: 'Implementing user authentication flow',
    startTime: new Date('2024-01-15T14:00:00'),
    endTime: new Date('2024-01-15T16:00:00'),
    duration: 120, // 2 hours
    isRunning: false,
  },
  {
    id: '3',
    project: { name: 'Brand Identity Package', client: { name: 'LocalBiz' } },
    description: 'Logo design iterations and color palette development',
    startTime: new Date('2024-01-14T10:30:00'),
    endTime: new Date('2024-01-14T15:00:00'),
    duration: 270, // 4.5 hours
    isRunning: false,
  },
  {
    id: '4',
    project: { name: 'Mobile App Development', client: { name: 'StartupXYZ' } },
    description: 'API integration and data management',
    startTime: new Date('2024-01-13T13:00:00'),
    endTime: new Date('2024-01-13T17:30:00'),
    duration: 270, // 4.5 hours
    isRunning: false,
  },
]

export default function TimePage() {
  const [activeTimer, setActiveTimer] = useState<{
    projectId: string
    startTime: Date
    description: string
  } | null>(null)
  const [timeLogs, setTimeLogs] = useState(mockTimeLogs)

  const handleStartTimer = (projectId: string, description: string) => {
    setActiveTimer({
      projectId,
      startTime: new Date(),
      description,
    })
  }

  const handleStopTimer = (description: string) => {
    if (!activeTimer) return
    
    const endTime = new Date()
    const duration = Math.floor((endTime.getTime() - activeTimer.startTime.getTime()) / (1000 * 60))
    
    const newLog = {
      id: Date.now().toString(),
      project: mockProjects.find(p => p.id === activeTimer.projectId)!,
      description: description || activeTimer.description,
      startTime: activeTimer.startTime,
      endTime,
      duration,
      isRunning: false,
    }
    
    setTimeLogs(prev => [newLog, ...prev])
    setActiveTimer(null)
  }

  const handlePauseTimer = () => {
    // For now, just stop the timer
    // In a real app, you'd want to implement actual pause/resume logic
  }

  const handleEditLog = (logId: string) => {
    // TODO: Implement edit functionality
    console.log('Edit log:', logId)
  }

  const handleDeleteLog = (logId: string) => {
    setTimeLogs(prev => prev.filter(log => log.id !== logId))
  }

  const handleExportLogs = () => {
    // TODO: Implement CSV export
    console.log('Export logs')
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Time Tracker</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Track your time across projects and manage your work logs.
        </p>
      </div>

      <TimeTracker
        projects={mockProjects}
        activeTimer={activeTimer}
        onStartTimer={handleStartTimer}
        onStopTimer={handleStopTimer}
        onPauseTimer={handlePauseTimer}
      />

      <TimeLogs
        timeLogs={timeLogs}
        onEdit={handleEditLog}
        onDelete={handleDeleteLog}
        onExport={handleExportLogs}
      />
    </div>
  )
}