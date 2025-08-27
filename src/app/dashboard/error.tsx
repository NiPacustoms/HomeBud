'use client'

import React from 'react'
import { Button } from '@/components/ui/button'

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Etwas ist schiefgelaufen</h1>
      <p className="mb-4">{error.message}</p>
      <Button onClick={() => reset()}>Erneut versuchen</Button>
    </div>
  )
}
