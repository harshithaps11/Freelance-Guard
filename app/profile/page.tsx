'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface User {
  id: string
  name: string
  email: string
  company?: string | null
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/profile')
      .then((r) => r.json())
      .then(setUser)
  }, [])

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    })
    setSaving(false)
  }

  if (!user) return <div className="text-gray-500">Loading profile...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">Update your personal information.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Info</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm">Name</label>
            <Input value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
          </div>
          <div>
            <label className="text-sm">Email</label>
            <Input value={user.email} disabled />
          </div>
          <div>
            <label className="text-sm">Company</label>
            <Input value={user.company || ''} onChange={(e) => setUser({ ...user, company: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Profile'}</Button>
    </div>
  )
}



