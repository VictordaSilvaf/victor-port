import type { ReactNode } from 'react'
import { MotionProvider } from '@/app/providers/MotionProvider'
import { Cursor } from '@/components/ui/Cursor'

type AppProviderProps = {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <MotionProvider>
      <Cursor />
      {children}
    </MotionProvider>
  )
}
