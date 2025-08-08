'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
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
  FileText,
  MoreHorizontal,
  Download,
  Send,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils/time'

interface Invoice {
  id: string
  invoiceNumber: string
  project: {
    name: string
    client: { name: string; company?: string }
  }
  amount: number
  hours: number
  scopeCharges: number
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  dueDate: Date
  paidAt?: Date
  stripePaymentUrl?: string
  createdAt: Date
}

// Mock data
const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    project: {
      name: 'E-commerce Website Redesign',
      client: { name: 'John Smith', company: 'TechCorp Inc.' }
    },
    amount: 3187.50,
    hours: 42.5,
    scopeCharges: 600,
    status: 'paid',
    dueDate: new Date('2024-01-30'),
    paidAt: new Date('2024-01-28'),
    stripePaymentUrl: 'https://checkout.stripe.com/pay/test123',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    project: {
      name: 'Mobile App Development',
      client: { name: 'Sarah Johnson', company: 'StartupXYZ' }
    },
    amount: 2100,
    hours: 28,
    scopeCharges: 0,
    status: 'sent',
    dueDate: new Date('2024-02-15'),
    stripePaymentUrl: 'https://checkout.stripe.com/pay/test456',
    createdAt: new Date('2024-01-20'),
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    project: {
      name: 'Brand Identity Package',
      client: { name: 'Mike Davis', company: 'LocalBiz' }
    },
    amount: 2500,
    hours: 38,
    scopeCharges: 0,
    status: 'overdue',
    dueDate: new Date('2024-01-10'),
    stripePaymentUrl: 'https://checkout.stripe.com/pay/test789',
    createdAt: new Date('2023-12-20'),
  },
  {
    id: '4',
    invoiceNumber: 'INV-2024-004',
    project: {
      name: 'WordPress Plugin Development',
      client: { name: 'Emily Chen', company: 'WebAgency Pro' }
    },
    amount: 720,
    hours: 12,
    scopeCharges: 0,
    status: 'draft',
    dueDate: new Date('2024-02-28'),
    createdAt: new Date('2024-01-25'),
  },
]

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState(mockInvoices)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'sent':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-600" />
    }
  }

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.project.client.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = !statusFilter || invoice.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleSendInvoice = (invoiceId: string) => {
    setInvoices(prev => prev.map(invoice =>
      invoice.id === invoiceId ? { ...invoice, status: 'sent' as const } : invoice
    ))
  }

  const handleMarkPaid = (invoiceId: string) => {
    setInvoices(prev => prev.map(invoice =>
      invoice.id === invoiceId ? { 
        ...invoice, 
        status: 'paid' as const, 
        paidAt: new Date() 
      } : invoice
    ))
  }

  const handleDownloadInvoice = (invoiceId: string) => {
    console.log('Download invoice:', invoiceId)
  }

  const totalAmount = filteredInvoices.reduce((sum, invoice) => sum + invoice.amount, 0)
  const paidAmount = filteredInvoices
    .filter(invoice => invoice.status === 'paid')
    .reduce((sum, invoice) => sum + invoice.amount, 0)
  const overdueAmount = filteredInvoices
    .filter(invoice => invoice.status === 'overdue')
    .reduce((sum, invoice) => sum + invoice.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Invoices</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage and track your client invoices.
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Invoice</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <p className="text-gray-600">Invoice creation form would go here...</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {filteredInvoices.length} invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(paidAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {filteredInvoices.filter(inv => inv.status === 'paid').length} invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(overdueAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {filteredInvoices.filter(inv => inv.status === 'overdue').length} invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Payment success rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Status: {statusFilter || 'All'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter('')}>
                  All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('draft')}>
                  Draft
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('sent')}>
                  Sent
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('paid')}>
                  Paid
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('overdue')}>
                  Overdue
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{invoice.invoiceNumber}</div>
                      <div className="text-sm text-gray-500">
                        {invoice.project.name}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{invoice.project.client.name}</div>
                      {invoice.project.client.company && (
                        <div className="text-sm text-gray-500">
                          {invoice.project.client.company}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-bold">{formatCurrency(invoice.amount)}</div>
                      <div className="text-sm text-gray-500">
                        {invoice.hours}h
                        {invoice.scopeCharges > 0 && ` + ${formatCurrency(invoice.scopeCharges)}`}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(invoice.status)}
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={`text-sm ${invoice.status === 'overdue' ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                      {formatDate(invoice.dueDate)}
                      {invoice.paidAt && (
                        <div className="text-green-600">
                          Paid {formatDate(invoice.paidAt)}
                        </div>
                      )}
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
                        <DropdownMenuItem onClick={() => handleDownloadInvoice(invoice.id)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </DropdownMenuItem>
                        {invoice.status === 'draft' && (
                          <DropdownMenuItem onClick={() => handleSendInvoice(invoice.id)}>
                            <Send className="h-4 w-4 mr-2" />
                            Send to Client
                          </DropdownMenuItem>
                        )}
                        {invoice.status !== 'paid' && (
                          <DropdownMenuItem onClick={() => handleMarkPaid(invoice.id)}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark as Paid
                          </DropdownMenuItem>
                        )}
                        {invoice.stripePaymentUrl && (
                          <DropdownMenuItem 
                            onClick={() => window.open(invoice.stripePaymentUrl, '_blank')}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            View Payment Link
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredInvoices.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No invoices found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}