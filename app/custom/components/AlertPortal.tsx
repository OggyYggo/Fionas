'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react'

interface AlertPortalProps {
  type: 'warning' | 'success' | 'error'
  message: string
}

export default function AlertPortal({ type, message }: AlertPortalProps) {
  const portalRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // Create a dedicated container for the alert
    if (!portalRef.current) {
      portalRef.current = document.createElement('div')
      portalRef.current.id = 'alert-portal'
      document.body.appendChild(portalRef.current)
    }

    return () => {
      if (portalRef.current && portalRef.current.parentNode) {
        portalRef.current.parentNode.removeChild(portalRef.current)
      }
    }
  }, [])

  if (!portalRef.current) return null

  return createPortal(
    <div 
      className="fixed top-20 right-4 z-[9999] max-w-md animate-in slide-in-from-top-2"
      style={{ 
        position: 'fixed', 
        right: '16px', 
        left: 'auto', 
        top: '80px', 
        zIndex: 9999,
        transform: 'none',
        pointerEvents: 'auto'
      }}
    >
      <Alert variant={type === 'error' ? 'destructive' : 'default'} className="shadow-xl border-2">
        <div className="flex items-center">
          {type === 'warning' && <AlertCircle className="h-4 w-4 flex-shrink-0" />}
          {type === 'success' && <CheckCircle className="h-4 w-4 flex-shrink-0" />}
          {type === 'error' && <XCircle className="h-4 w-4 flex-shrink-0" />}
          <AlertDescription className="ml-2">
            {message}
          </AlertDescription>
        </div>
      </Alert>
    </div>,
    portalRef.current
  )
}
