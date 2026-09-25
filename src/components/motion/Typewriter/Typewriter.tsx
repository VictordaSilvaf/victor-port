import { useEffect, useState } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils/cn'

type Phase = 'typing' | 'deleting'

type TypewriterProps = {
  words: readonly string[]
  typeSpeed?: number
  deleteSpeed?: number
  pauseDuration?: number
  nextWordDelay?: number
  random?: boolean
  /** Reserve the width of the widest word so surrounding layout never shifts. */
  reserveSpace?: boolean
  align?: 'start' | 'center' | 'end'
  className?: string
  caretClassName?: string
}

const ALIGN_CLASS = {
  start: 'justify-self-start',
  center: 'justify-self-center',
  end: 'justify-self-end',
} as const

function pickNextIndex(current: number, total: number, random: boolean) {
  if (total <= 1) return 0
  if (!random) return (current + 1) % total

  const next = Math.floor(Math.random() * (total - 1))
  return next >= current ? next + 1 : next
}

export function Typewriter({
  words,
  typeSpeed = 70,
  deleteSpeed = 120,
  pauseDuration = 2200,
  nextWordDelay = 300,
  random = false,
  reserveSpace = true,
  align = 'start',
  className,
  caretClassName,
}: TypewriterProps) {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [index, setIndex] = useState(0)
  const [text, setText] = useState(words[0] ?? '')
  const [phase, setPhase] = useState<Phase>('typing')

  const word = words[index] ?? ''

  useEffect(() => {
    if (words.length === 0) return

    let timeout: number

    if (phase === 'typing') {
      if (text === word) {
        timeout = window.setTimeout(() => setPhase('deleting'), pauseDuration)
      } else {
        timeout = window.setTimeout(() => {
          setText(reducedMotion ? word : word.slice(0, text.length + 1))
        }, typeSpeed)
      }
    } else if (text === '') {
      timeout = window.setTimeout(() => {
        setIndex((current) => pickNextIndex(current, words.length, random))
        setPhase('typing')
      }, nextWordDelay)
    } else {
      timeout = window.setTimeout(() => {
        setText(reducedMotion ? '' : text.slice(0, -1))
      }, deleteSpeed)
    }

    return () => window.clearTimeout(timeout)
  }, [
    text,
    phase,
    word,
    words.length,
    typeSpeed,
    deleteSpeed,
    pauseDuration,
    nextWordDelay,
    random,
    reducedMotion,
  ])

  const caret = (
    <span
      aria-hidden="true"
      className={cn(
        'ml-[0.05em] inline-block h-[0.85em] w-[0.08em] translate-y-[0.08em] bg-current animate-caret-blink',
        caretClassName,
      )}
    />
  )

  if (!reserveSpace) {
    return (
      <span className={cn('inline', className)}>
        <span className="sr-only">{word}</span>
        <span aria-hidden="true">{text}</span>
        {caret}
      </span>
    )
  }

  return (
    <span className={cn('inline-grid whitespace-nowrap', className)}>
      <span className="sr-only">{word}</span>
      {words.map((ghost) => (
        <span
          key={ghost}
          aria-hidden="true"
          className="invisible col-start-1 row-start-1"
        >
          {ghost}
          <span className="ml-[0.05em] inline-block w-[0.08em]" />
        </span>
      ))}
      <span
        aria-hidden="true"
        className={cn('col-start-1 row-start-1', ALIGN_CLASS[align])}
      >
        {text}
        {caret}
      </span>
    </span>
  )
}
