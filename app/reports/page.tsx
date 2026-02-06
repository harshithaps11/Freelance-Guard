import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function ReportsPage() {
  // Placeholder server component; can fetch aggregates via server actions later.
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">Insights across projects, time, and revenue.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Hours (Last 7d)</CardTitle>
          </CardHeader>
          <CardContent>
            Coming soon
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Earnings (Month)</CardTitle>
          </CardHeader>
          <CardContent>
            Coming soon
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Collection Rate</CardTitle>
          </CardHeader>
          <CardContent>
            Coming soon
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


