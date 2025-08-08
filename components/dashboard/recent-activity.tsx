'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  DollarSign,
  AlertTriangle 
} from 'lucide-react'
import { formatDateTime } from '@/lib/utils/time'

interface Activity {
  id: string
  type: 'time_log' | 'scope_request' | 'invoice' | 'payment'
  title: string
  description: string
  timestamp: Date
  status?: string
  project?: string
}

interface RecentActivityProps {
  activities: Activity[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'time_log':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'scope_request':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case 'invoice':
        return <DollarSign className="h-4 w-4 text-green-500" />
      case 'payment':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status?: string) => {
    if (!status) return null
    
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      paid: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
    }
    
    return (
      <Badge variant="secondary" className={statusColors[status as keyof typeof statusColors] || ''}>
        {status}
      </Badge>
    )
  }

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800 transition-colors">
              <div className="flex-shrink-0 mt-1">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {activity.title}
                  </h4>
                  {getStatusBadge(activity.status)}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {activity.description}
                </p>
                {activity.project && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    {activity.project}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {formatDateTime(activity.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Button variant="outline" className="w-full">
            View All Activity
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}