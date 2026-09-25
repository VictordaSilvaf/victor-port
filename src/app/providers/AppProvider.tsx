import type { ReactNode } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { MotionProvider } from '@/app/providers/MotionProvider'
import { JsonLd } from '@/components/seo'
import { Cursor } from '@/components/ui/Cursor'

type AppProviderProps = {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <HelmetProvider>
      <MotionProvider>
        <JsonLd />
        <Cursor />
        {children}
      </MotionProvider>
    </HelmetProvider>
  )
}
