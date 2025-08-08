'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
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
  Shield,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Mail
} from 'lucide-react'
import { formatCurrency, formatDateTime } from '@/lib/utils/time'

interface ScopeRequest {
  id: string
  title: string
  description: string
  project: {
    name: string
    client: { name: string }
  }
  estimatedHours: number
  hourlyRate: number
  totalCost: number
  status: 'pending' | 'approved' | 'rejected'
  clientApproved: boolean
  createdAt: Date
}

// Mock data
const mockScopeRequests: ScopeRequest[] = [
  {
    id: '1',
    title: 'Additional Payment Gateway Integration',
    description: 'Client wants to add PayPal and Apple Pay in addition to the originally planned Stripe integration.',
    project: {
      name: 'E-commerce Website Redesign',
      client: { name: 'TechCorp Inc.' }
    },
    estimatedHours: 8,
    hourlyRate: 75,
    totalCost: 600,
    status: 'approved',
    clientApproved: true,
    createdAt: new Date('2024-01-15T10:30:00'),
  },
  {
    id: '2',
    title: 'Custom Admin Dashboard',
    description: 'Request for a custom admin panel with advanced analytics and reporting features.',
    project: {
      name: 'Mobile App Development',
      client: { name: 'StartupXYZ' }
    },
    estimatedHours: 20,
    hourlyRate: 75,
    totalCost: 1500,
    status: 'pending',
    clientApproved: false,
    createdAt: new Date('2024-01-14T14:15:00'),
  },
  {
    id: '3',
    title: 'Social Media Integration',
    description: 'Adding Instagram and Facebook sharing functionality to the app.',
    project: {
      name: 'Mobile App Development',
      client: { name: 'StartupXYZ' }
    },
    estimatedHours: 6,
    hourlyRate: 75,
    totalCost: 450,
    status: 'rejected',
    clientApproved: false,
    createdAt: new Date('2024-01-12T09:20:00'),
  },
]

export default function ScopePage() {
  const [scopeRequests, setScopeRequests] = useState(mockScopeRequests)
  const [showNewRequestDialog, setShowNewRequestDialog] = useState(false)
  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    projectId: '',
    estimatedHours: '',
    hourlyRate: '75'
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const handleCreateRequest = () => {
    const request: ScopeRequest = {
      id: Date.now().toString(),
      title: newRequest.title,
      description: newRequest.description,
      project: {
        name: 'E-commerce Website Redesign',
        client: { name: 'TechCorp Inc.' }
      },
      estimatedHours: parseFloat(newRequest.estimatedHours),
      hourlyRate: parseFloat(newRequest.hourlyRate),
      totalCost: parseFloat(newRequest.estimatedHours) * parseFloat(newRequest.hourlyRate),
      status: 'pending',
      clientApproved: false,
      createdAt: new Date(),
    }
    
    setScopeRequests(prev => [request, ...prev])
    setShowNewRequestDialog(false)
    setNewRequest({
      title: '',
      description: '',
      projectId: '',
      estimatedHours: '',
      hourlyRate: '75'
    })
  }

  const handleUpdateStatus = (id: string, status: 'approved' | 'rejected') => {
    setScopeRequests(prev => prev.map(request =>
      request.id === id ? { ...request, status } : request
    ))
  }

  const handleSendEmail = (request: ScopeRequest) => {
    // TODO: Implement email sending
    console.log('Sending email for request:', request.id)
  }

  const totalPendingValue = scopeRequests
    .filter(req => req.status === 'pending')
    .reduce((sum, req) => sum + req.totalCost, 0)

  const totalApprovedValue = scopeRequests
    .filter(req => req.status === 'approved')
    .reduce((sum, req) => sum + req.totalCost, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <Shield className="h-8 w-8 text-blue-600 mr-3" />
            Scope Shield
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Track and manage scope creep requests with client approvals.
          </p>
        </div>
        <Dialog open={showNewRequestDialog} onOpenChange={setShowNewRequestDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Scope Request</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={newRequest.title}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Brief description of the request"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newRequest.description}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed description of the additional work"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Estimated Hours</label>
                  <Input
                    type="number"
                    value={newRequest.estimatedHours}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, estimatedHours: e.target.value }))}
                    placeholder="8"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Hourly Rate</label>
                  <Input
                    type="number"
                    value={newRequest.hourlyRate}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, hourlyRate: e.target.value }))}
                    placeholder="75"
                  />
                </div>
              </div>
              {newRequest.estimatedHours && newRequest.hourlyRate && (
                <div className="text-right">
                  <span className="text-lg font-bold text-green-600">
                    Total: {formatCurrency(parseFloat(newRequest.estimatedHours) * parseFloat(newRequest.hourlyRate))}
                  </span>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewRequestDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateRequest} disabled={!newRequest.title || !newRequest.estimatedHours}>
                Create Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {scopeRequests.filter(req => req.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(totalPendingValue)} potential revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {scopeRequests.filter(req => req.status === 'approved').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(totalApprovedValue)} additional revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {scopeRequests.length > 0 
                ? Math.round((scopeRequests.filter(req => req.status === 'approved').length / scopeRequests.length) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Approval rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Scope Requests</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scopeRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{request.title}</div>
                      <div className="text-sm text-gray-500 max-w-[300px] truncate">
                        {request.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{request.project.name}</div>
                      <div className="text-sm text-gray-500">
                        {request.project.client.name}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-bold">{formatCurrency(request.totalCost)}</div>
                      <div className="text-sm text-gray-500">
                        {request.estimatedHours}h @ {formatCurrency(request.hourlyRate)}/h
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(request.status)}
                      <Badge className={getStatusColor(request.status)}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-500">
                      {formatDateTime(request.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {request.status === 'pending' && (
                          <>
                            <DropdownMenuItem 
                              onClick={() => handleUpdateStatus(request.id, 'approved')}
                              className="text-green-600"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleUpdateStatus(request.id, 'rejected')}
                              className="text-red-600"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem onClick={() => handleSendEmail(request)}>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {scopeRequests.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No scope requests yet. Create one to get started!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}