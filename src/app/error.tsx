'use client'

import React from 'react'
import { Button } from '@/components/ui/button'

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Unerwarteter Fehler</h1>
      <p className="mb-6">{error.message}</p>
      <Button onClick={() => reset()}>Seite neu laden</Button>
    </div>
  )
}
