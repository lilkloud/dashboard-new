'use client'

import dynamic from 'next/dynamic'

// Import Sidebar with SSR disabled to avoid hydration issues
const Sidebar = dynamic<{}>(
  () => import('./sidebar').then(mod => mod.default || mod),
  {
    ssr: false,
    loading: () => <div className="hidden border-r bg-muted/40 md:block w-64" />
  }
)

export default function SidebarClient() {
  return <Sidebar />
}
