'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select'
import { Play, Pause, Square, Clock, Calendar } from 'lucide-react'
import { formatDuration } from '@/lib/utils/time'

interface Project {
  id: string
  name: string
  client: { name: string }
}

interface ActiveTimer {
  projectId: string
  startTime: Date
  description: string
}

interface TimeTrackerProps {
  projects: Project[]
  activeTimer?: ActiveTimer | null
  onStartTimer: (projectId: string, description: string) => void
  onStopTimer: (description: string) => void
  onPauseTimer: () => void
}

export function TimeTracker({ 
  projects, 
  activeTimer, 
  onStartTimer, 
  onStopTimer,
  onPauseTimer 
}: TimeTrackerProps) {
  const [selectedProject, setSelectedProject] = useState('')
  const [description, setDescription] = useState('')
  const [elapsed, setElapsed] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (activeTimer && !isPaused) {
      interval = setInterval(() => {
        const now = new Date()
        const start = new Date(activeTimer.startTime)
        setElapsed(Math.floor((now.getTime() - start.getTime()) / 1000))
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [activeTimer, isPaused])

  const handleStart = () => {
    if (!selectedProject) return
    onStartTimer(selectedProject, description)
    setElapsed(0)
    setIsPaused(false)
  }

  const handleStop = () => {
    onStopTimer(description)
    setElapsed(0)
    setDescription('')
    setIsPaused(false)
  }

  const handlePause = () => {
    setIsPaused(!isPaused)
    onPauseTimer()
  }

  const currentProject = projects.find(p => p.id === activeTimer?.projectId)

  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
      {/* Timer Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Time Tracker</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!activeTimer ? (
            <>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select Project
                </label>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choose a project..." />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name} - {project.client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Task Description (Optional)
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What are you working on?"
                  className="mt-1"
                  rows={3}
                />
              </div>

              <Button 
                onClick={handleStart} 
                disabled={!selectedProject}
                className="w-full"
                size="lg"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Timer
              </Button>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <div className="text-4xl font-mono font-bold text-blue-600 dark:text-blue-400">
                  {formatDuration(Math.floor(elapsed / 60))}
                </div>
                <div className="text-lg font-medium text-gray-900 dark:text-white">
                  {currentProject?.name}
                </div>
                <div className="text-sm text-gray-500">
                  {currentProject?.client.name}
                </div>
                {activeTimer.description && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                    {activeTimer.description}
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={handlePause}
                  className="flex-1"
                >
                  {isPaused ? (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Resume
                    </>
                  ) : (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </>
                  )}
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleStop}
                  className="flex-1"
                >
                  <Square className="h-4 w-4 mr-2" />
                  Stop
                </Button>
              </div>

              {isPaused && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Timer Paused
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Start</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {projects.slice(0, 5).map((project) => (
              <Button
                key={project.id}
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  setSelectedProject(project.id)
                  onStartTimer(project.id, '')
                }}
                disabled={!!activeTimer}
              >
                <Play className="h-4 w-4 mr-2" />
                <div className="text-left">
                  <div className="font-medium">{project.name}</div>
                  <div className="text-sm text-gray-500">{project.client.name}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}