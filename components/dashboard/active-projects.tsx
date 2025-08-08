'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  User,
  Play,
  Pause
} from 'lucide-react'
import { formatCurrency, formatDuration } from '@/lib/utils/time'

interface Project {
  id: string
  name: string
  client: {
    name: string
    company?: string
  }
  status: string
  type: 'hourly' | 'fixed'
  hourlyRate?: number
  fixedPrice?: number
  estimatedHours?: number
  actualHours: number
  dueDate?: Date
  isTimerRunning: boolean
}

interface ActiveProjectsProps {
  projects: Project[]
  onStartTimer: (projectId: string) => void
  onStopTimer: (projectId: string) => void
}

export function ActiveProjects({ projects, onStartTimer, onStopTimer }: ActiveProjectsProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const calculateProgress = (project: Project) => {
    if (!project.estimatedHours) return 0
    return Math.min((project.actualHours / project.estimatedHours) * 100, 100)
  }

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Active Projects</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow dark:border-gray-700">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {project.name}
                    </h3>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{project.client.name}</span>
                      {project.client.company && (
                        <span className="text-gray-400">({project.client.company})</span>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={project.isTimerRunning ? "destructive" : "default"}
                  onClick={() => 
                    project.isTimerRunning 
                      ? onStopTimer(project.id)
                      : onStartTimer(project.id)
                  }
                >
                  {project.isTimerRunning ? (
                    <>
                      <Pause className="h-3 w-3 mr-1" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3 mr-1" />
                      Start
                    </>
                  )}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">
                    {formatDuration(project.actualHours * 60)} logged
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">
                    {project.type === 'hourly' 
                      ? `${formatCurrency(project.hourlyRate || 0)}/hr`
                      : formatCurrency(project.fixedPrice || 0)
                    }
                  </span>
                </div>
                {project.dueDate && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      Due {project.dueDate.toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {project.estimatedHours && (
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Progress</span>
                    <span className="text-gray-600 dark:text-gray-300">
                      {project.actualHours}h / {project.estimatedHours}h
                    </span>
                  </div>
                  <Progress value={calculateProgress(project)} className="h-2" />
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}