'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  Calendar,
  Filter,
  Download
} from 'lucide-react'
import { formatDuration, formatDateTime } from '@/lib/utils/time'

interface TimeLog {
  id: string
  project: {
    name: string
    client: { name: string }
  }
  description?: string
  startTime: Date
  endTime: Date
  duration: number // in minutes
  isRunning: boolean
}

interface TimeLogsProps {
  timeLogs: TimeLog[]
  onEdit: (logId: string) => void
  onDelete: (logId: string) => void
  onExport: () => void
}

export function TimeLogs({ timeLogs, onEdit, onDelete, onExport }: TimeLogsProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterProject, setFilterProject] = useState('')

  const filteredLogs = timeLogs.filter(log => {
    const matchesSearch = log.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.project.client.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesProject = !filterProject || log.project.name === filterProject
    
    return matchesSearch && matchesProject
  })

  const totalHours = filteredLogs.reduce((sum, log) => sum + log.duration, 0)
  const uniqueProjects = Array.from(new Set(timeLogs.map(log => log.project.name)))

  return (
    <div className="space-y-6">
      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
            <CardTitle>Time Logs</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={onExport}>
                <Download className="h-4 w-4 mr-1" />
                Export CSV
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-1" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilterProject('')}>
                    All Projects
                  </DropdownMenuItem>
                  {uniqueProjects.map(project => (
                    <DropdownMenuItem key={project} onClick={() => setFilterProject(project)}>
                      {project}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:max-w-sm"
            />
            {filterProject && (
              <Badge variant="secondary" className="w-fit">
                {filterProject}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => setFilterProject('')}
                >
                  ×
                </Button>
              </Badge>
            )}
          </div>
          
          <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
            <div>
              <strong>{filteredLogs.length}</strong> entries
            </div>
            <div>
              Total: <strong>{formatDuration(totalHours)}</strong>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Logs Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{log.project.name}</div>
                      <div className="text-sm text-gray-500">
                        {log.project.client.name}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[300px] truncate">
                      {log.description || (
                        <span className="text-gray-400 italic">No description</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {formatDateTime(log.startTime)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {formatDuration(log.duration)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {log.isRunning ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Running
                      </Badge>
                    ) : (
                      <Badge variant="outline">Completed</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(log.id)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onDelete(log.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredLogs.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No time logs found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}