'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Import Sidebar with SSR disabled to avoid hydration issues
const Sidebar = dynamic(() => import('@/components/sidebar'), {
  ssr: false,
  loading: () => <div className="hidden border-r bg-muted/40 md:block w-64" />
})

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Suspense fallback={<div className="hidden border-r bg-muted/40 md:block w-64" />}>
        <Sidebar />
      </Suspense>
      <div className="relative flex-1 overflow-y-auto overflow-x-hidden">
        {children}
      </div>
    </div>
  )
}
