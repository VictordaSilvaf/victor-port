import { useEffect, useState } from 'react'

export type MousePosition = {
  x: number
  y: number
}

export function useMousePosition() {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 })

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      setPosition({ x: event.clientX, y: event.clientY })
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', onPointerMove)
  }, [])

  return position
}
