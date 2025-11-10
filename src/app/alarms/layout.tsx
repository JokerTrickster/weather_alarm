'use client'

import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AlarmsProvider } from '@/context/AlarmsContext'

export default function AlarmsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <AlarmsProvider>{children}</AlarmsProvider>
    </ProtectedRoute>
  )
}
