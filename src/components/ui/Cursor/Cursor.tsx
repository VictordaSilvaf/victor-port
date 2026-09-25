import { useEffect, useRef } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import {
  createCursorEngine,
  type CursorEngine,
} from './CursorEngine'

/**
 * React lifecycle shell for the liquid cursor engine.
 * Physics, rendering, and interaction run outside React's render cycle.
 */
export function Cursor() {
  const engineRef = useRef<CursorEngine | null>(null)
  const isFinePointer = useMediaQuery('(pointer: fine)')

  useEffect(() => {
    if (!isFinePointer) return

    const engine = createCursorEngine(document.body)
    engineRef.current = engine

    return () => {
      engine.destroy()
      engineRef.current = null
    }
  }, [isFinePointer])

  return null
}
