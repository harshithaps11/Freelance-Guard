'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog'
import { DialogFooter } from '@/components/ui/dialog'
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
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  Clock,
  User
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils/time'

interface Project {
  id: string
  name: string
  client: {
    id: string
    name: string
    company?: string
    email: string
  }
  description?: string
  status: 'active' | 'completed' | 'paused' | 'cancelled'
  type: 'hourly' | 'fixed'
  hourlyRate?: number
  fixedPrice?: number
  startDate: Date
  endDate?: Date
  estimatedHours?: number
  actualHours: number
  createdAt: Date
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [newOpen, setNewOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newProject, setNewProject] = useState({
    name: '',
    clientName: '',
    clientEmail: '',
    clientCompany: '',
    type: 'hourly',
    hourlyRate: '75',
    fixedPrice: '',
    estimatedHours: '',
  })

  useEffect(() => {
    fetch('/api/projects')
      .then(async (r) => {
        const text = await r.text()
        return text ? JSON.parse(text) : []
      })
      .then((rows) => {
        const mapped: Project[] = rows.map((p: any) => ({
          id: p.id,
          name: p.name,
          client: {
            id: p.client?.id || '',
            name: p.client?.name || 'Unknown',
            company: p.client?.company || undefined,
            email: p.client?.email || ''
          },
          description: p.description || '',
          status: p.status,
          type: p.type,
          hourlyRate: p.hourlyRate || undefined,
          fixedPrice: p.fixedPrice || undefined,
          startDate: new Date(p.startDate),
          endDate: p.endDate ? new Date(p.endDate) : undefined,
          estimatedHours: p.estimatedHours || undefined,
          actualHours: p.actualHours || 0,
          createdAt: new Date(p.createdAt),
        }))
        setProjects(mapped)
      })
      .catch(() => setProjects([]))
  }, [])

  const handleCreate = async () => {
    if (!newProject.name || !newProject.clientName || !newProject.clientEmail) return
    setCreating(true)
    try {
      const fetchJsonSafe = async (url: string, init?: RequestInit) => {
        try {
          const res = await fetch(url, init)
          if (!res.ok) return null
          const text = await res.text()
          try {
            return text ? JSON.parse(text) : null
          } catch {
            return null
          }
        } catch {
          return null
        }
      }
      // ensure client exists or create minimal client
      const client =
        (await fetchJsonSafe('/api/clients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: newProject.clientName,
            email: newProject.clientEmail,
            company: newProject.clientCompany || undefined,
          }),
        })) ||
        ((await fetchJsonSafe('/api/clients')) || []).find((c: any) => c.email === newProject.clientEmail) ||
        null
      if (!client) throw new Error('Failed to create or find client')

      const payload: any = {
        name: newProject.name,
        clientId: client.id,
        type: newProject.type,
        hourlyRate: newProject.type === 'hourly' ? Number(newProject.hourlyRate || 0) : undefined,
        fixedPrice: newProject.type === 'fixed' ? Number(newProject.fixedPrice || 0) : undefined,
        estimatedHours: newProject.estimatedHours ? Number(newProject.estimatedHours) : undefined,
        startDate: new Date().toISOString(),
      }

      const created = await fetchJsonSafe('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!created) throw new Error('Failed to create project')

      const mapped: Project = {
        id: created.id,
        name: created.name,
        client: {
          id: created.client?.id || '',
          name: created.client?.name || 'Unknown',
          company: created.client?.company || undefined,
          email: created.client?.email || '',
        },
        description: created.description || '',
        status: created.status,
        type: created.type,
        hourlyRate: created.hourlyRate || undefined,
        fixedPrice: created.fixedPrice || undefined,
        startDate: new Date(created.startDate),
        endDate: created.endDate ? new Date(created.endDate) : undefined,
        estimatedHours: created.estimatedHours || undefined,
        actualHours: created.actualHours || 0,
        createdAt: new Date(created.createdAt),
      }
      setProjects((prev) => [mapped, ...prev])
      setNewOpen(false)
      setNewProject({ name: '', clientName: '', clientEmail: '', clientCompany: '', type: 'hourly', hourlyRate: '75', fixedPrice: '', estimatedHours: '' })
    } catch (err) {
      console.error('Create project failed', err)
      alert('Failed to create project. Please check your inputs and try again.')
    } finally {
      setCreating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    }
  }

  const calculateProgress = (project: Project) => {
    if (!project.estimatedHours) return 0
    return Math.min((project.actualHours / project.estimatedHours) * 100, 100)
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.client.company || '').toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = !statusFilter || project.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage your client projects and track progress.
          </p>
        </div>
        <Dialog open={newOpen} onOpenChange={setNewOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3">
              <div>
                <label className="text-sm">Project Name</label>
                <Input value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} />
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm">Client Name</label>
                  <Input value={newProject.clientName} onChange={(e) => setNewProject({ ...newProject, clientName: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm">Client Email</label>
                  <Input type="email" value={newProject.clientEmail} onChange={(e) => setNewProject({ ...newProject, clientEmail: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-sm">Client Company</label>
                <Input value={newProject.clientCompany} onChange={(e) => setNewProject({ ...newProject, clientCompany: e.target.value })} />
              </div>
              <div className="grid md:grid-cols-3 gap-3">
                <div>
                  <label className="text-sm">Type</label>
                  <select className="w-full border rounded h-9 px-2 bg-transparent" value={newProject.type} onChange={(e) => setNewProject({ ...newProject, type: e.target.value })}>
                    <option value="hourly">Hourly</option>
                    <option value="fixed">Fixed</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm">Hourly Rate</label>
                  <Input type="number" value={newProject.hourlyRate} onChange={(e) => setNewProject({ ...newProject, hourlyRate: e.target.value })} disabled={newProject.type !== 'hourly'} />
                </div>
                <div>
                  <label className="text-sm">Fixed Price</label>
                  <Input type="number" value={newProject.fixedPrice} onChange={(e) => setNewProject({ ...newProject, fixedPrice: e.target.value })} disabled={newProject.type !== 'fixed'} />
                </div>
              </div>
              <div>
                <label className="text-sm">Estimated Hours</label>
                <Input type="number" value={newProject.estimatedHours} onChange={(e) => setNewProject({ ...newProject, estimatedHours: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={creating || !newProject.name || !newProject.clientName || !newProject.clientEmail}>
                {creating ? 'Creating...' : 'Create Project'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Status: {statusFilter || 'All'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter('')}>
                  All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('active')}>
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('completed')}>
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('paused')}>
                  Paused
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('cancelled')}>
                  Cancelled
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
            Showing {filteredProjects.length} of {projects.length} projects
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                    <User className="h-3 w-3" />
                    <span>{project.client.name}</span>
                    {project.client.company && (
                      <span className="text-gray-400">({project.client.company})</span>
                    )}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDeleteProject(project.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className={getStatusColor(project.status)}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </Badge>
                <div className="text-sm text-gray-500">
                  Created {formatDate(project.createdAt)}
                </div>
              </div>

              {project.description && (
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {project.description}
                </p>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span>
                    {project.type === 'hourly' 
                      ? `${formatCurrency(project.hourlyRate || 0)}/hr`
                      : formatCurrency(project.fixedPrice || 0)
                    }
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>{project.actualHours}h logged</span>
                </div>
              </div>

              {project.startDate && (
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>
                    {formatDate(project.startDate)}
                    {project.endDate && ` - ${formatDate(project.endDate)}`}
                  </span>
                </div>
              )}

              {project.estimatedHours && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>
                      {project.actualHours}h / {project.estimatedHours}h
                    </span>
                  </div>
                  <Progress value={calculateProgress(project)} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500 dark:text-gray-400">
              No projects found matching your criteria.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}