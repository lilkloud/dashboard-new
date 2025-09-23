'use client'

import { useEffect } from 'react'

export default function ClientRoot({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Clean up any problematic attributes added by extensions
    const cleanExtensionAttributes = () => {
      if (typeof window === 'undefined') return
      
      const attributes = ['bis_skin_checked', 'bis_register']
      attributes.forEach(attr => {
        document.querySelectorAll(`[${attr}]`).forEach(el => {
          el.removeAttribute(attr)
        })
      })
    }

    cleanExtensionAttributes()
    const timer = setTimeout(cleanExtensionAttributes, 100)
    
    return () => clearTimeout(timer)
  }, [])

  return <>{children}</>
}
