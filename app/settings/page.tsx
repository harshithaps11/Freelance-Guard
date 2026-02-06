'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface UserSettings {
  id: string
  hourlyRate: number
  currency: string
  monthlyGoal: number
  stripePublicKey?: string | null
  stripeSecretKey?: string | null
  emailFrom?: string | null
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then(setSettings)
      .catch(() => setSettings(null))
  }, [])

  const handleSave = async () => {
    if (!settings) return
    setSaving(true)
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })
    setSaving(false)
  }

  if (!settings) return <div className="text-gray-500">Loading settings...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">Configure your preferences and integrations.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Billing</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="text-sm">Hourly Rate</label>
            <Input
              type="number"
              value={settings.hourlyRate}
              onChange={(e) => setSettings({ ...settings, hourlyRate: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="text-sm">Currency</label>
            <Input
              value={settings.currency}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm">Monthly Goal</label>
            <Input
              type="number"
              value={settings.monthlyGoal}
              onChange={(e) => setSettings({ ...settings, monthlyGoal: Number(e.target.value) })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm">Stripe Publishable Key</label>
            <Input
              value={settings.stripePublicKey || ''}
              onChange={(e) => setSettings({ ...settings, stripePublicKey: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm">Stripe Secret Key</label>
            <Input
              type="password"
              value={settings.stripeSecretKey || ''}
              onChange={(e) => setSettings({ ...settings, stripeSecretKey: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm">Email From</label>
            <Input
              value={settings.emailFrom || ''}
              onChange={(e) => setSettings({ ...settings, emailFrom: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save Settings'}
      </Button>
    </div>
  )
}


