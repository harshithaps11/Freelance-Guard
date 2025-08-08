'use client'

import { useState } from 'react'
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

// Mock data
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'E-commerce Website Redesign',
    client: {
      id: 'c1',
      name: 'John Smith',
      company: 'TechCorp Inc.',
      email: 'john@techcorp.com'
    },
    description: 'Complete redesign of the company website with modern UI/UX and mobile optimization',
    status: 'active',
    type: 'hourly',
    hourlyRate: 75,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-02-15'),
    estimatedHours: 80,
    actualHours: 42.5,
    createdAt: new Date('2023-12-15'),
  },
  {
    id: '2',
    name: 'Mobile App Development',
    client: {
      id: 'c2',
      name: 'Sarah Johnson',
      company: 'StartupXYZ',
      email: 'sarah@startupxyz.com'
    },
    description: 'Native iOS and Android app for food delivery service',
    status: 'active',
    type: 'fixed',
    fixedPrice: 5000,
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-03-01'),
    estimatedHours: 60,
    actualHours: 28,
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '3',
    name: 'Brand Identity Package',
    client: {
      id: 'c3',
      name: 'Mike Davis',
      company: 'LocalBiz',
      email: 'mike@localbiz.com'
    },
    description: 'Complete brand identity including logo, business cards, and marketing materials',
    status: 'completed',
    type: 'fixed',
    fixedPrice: 2500,
    startDate: new Date('2023-12-01'),
    endDate: new Date('2024-01-10'),
    estimatedHours: 40,
    actualHours: 38,
    createdAt: new Date('2023-11-15'),
  },
  {
    id: '4',
    name: 'WordPress Plugin Development',
    client: {
      id: 'c4',
      name: 'Emily Chen',
      company: 'WebAgency Pro',
      email: 'emily@webagencypro.com'
    },
    description: 'Custom WordPress plugin for advanced SEO management',
    status: 'paused',
    type: 'hourly',
    hourlyRate: 60,
    startDate: new Date('2023-11-15'),
    estimatedHours: 30,
    actualHours: 12,
    createdAt: new Date('2023-11-10'),
  },
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState(mockProjects)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')

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
      project.client.company?.toLowerCase().includes(searchTerm.toLowerCase())
    
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
        <Dialog>
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
            <div className="p-4">
              <p className="text-gray-600">Project creation form would go here...</p>
            </div>
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