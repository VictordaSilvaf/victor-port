import { useEffect, useState, type RefObject } from 'react'

function getPageProgress() {
  const scrollTop = window.scrollY
  const height = document.documentElement.scrollHeight - window.innerHeight
  if (height <= 0) return 0
  return Math.min(1, Math.max(0, scrollTop / height))
}

function getElementProgress(element: HTMLElement) {
  const rect = element.getBoundingClientRect()
  const total = rect.height - window.innerHeight
  if (total <= 0) return rect.top <= 0 ? 1 : 0
  return Math.min(1, Math.max(0, -rect.top / total))
}

export function useScrollProgress(ref?: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      if (ref?.current) {
        setProgress(getElementProgress(ref.current))
        return
      }
      setProgress(getPageProgress())
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [ref])

  return progress
}
