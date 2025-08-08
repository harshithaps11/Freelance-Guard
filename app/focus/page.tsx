'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select'
import { Play, Pause, Square, RotateCcw } from 'lucide-react'
import { formatDuration } from '@/lib/utils/time'

// Mock data
const mockProjects = [
  { id: '1', name: 'E-commerce Website Redesign', client: { name: 'TechCorp Inc.' } },
  { id: '2', name: 'Mobile App Development', client: { name: 'StartupXYZ' } },
  { id: '3', name: 'Brand Identity Package', client: { name: 'LocalBiz' } },
]

export default function FocusPage() {
  const [selectedProject, setSelectedProject] = useState('')
  const [elapsed, setElapsed] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setElapsed(prev => prev + 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, isPaused])

  const handleStart = () => {
    if (!selectedProject) return
    setIsRunning(true)
    setIsPaused(false)
  }

  const handlePause = () => {
    setIsPaused(!isPaused)
  }

  const handleStop = () => {
    setIsRunning(false)
    setIsPaused(false)
    setElapsed(0)
  }

  const handleReset = () => {
    setElapsed(0)
    setIsRunning(false)
    setIsPaused(false)
  }

  const currentProject = mockProjects.find(p => p.id === selectedProject)

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center space-y-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Focus Mode
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Minimize distractions and track your time
              </p>
            </div>

            {!isRunning && !isPaused ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                    Select Project
                  </label>
                  <Select value={selectedProject} onValueChange={setSelectedProject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a project..." />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProjects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleStart} 
                  disabled={!selectedProject}
                  className="w-full"
                  size="lg"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Start Focus Session
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="text-6xl font-mono font-bold text-blue-600 dark:text-blue-400">
                    {formatDuration(Math.floor(elapsed / 60))}
                  </div>
                  <div className="text-lg font-medium text-gray-900 dark:text-white">
                    {currentProject?.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {currentProject?.client.name}
                  </div>
                  {isPaused && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 mt-2">
                      Paused
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    onClick={handlePause}
                    size="sm"
                  >
                    {isPaused ? (
                      <>
                        <Play className="h-4 w-4 mr-1" />
                        Resume
                      </>
                    ) : (
                      <>
                        <Pause className="h-4 w-4 mr-1" />
                        Pause
                      </>
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleStop}
                    size="sm"
                  >
                    <Square className="h-4 w-4 mr-1" />
                    Stop
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    size="sm"
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reset
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}