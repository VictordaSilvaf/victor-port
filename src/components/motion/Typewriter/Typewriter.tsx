import { useEffect, useState } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils/cn'

type Phase = 'typing' | 'deleting' | 'idle'

type TypewriterProps = {
  words: readonly string[]
  typeSpeed?: number
  deleteSpeed?: number
  pauseDuration?: number
  nextWordDelay?: number
  random?: boolean
  /**
   * When false, keeps the typed word until `words` changes,
   * then deletes and retypes the new value.
   */
  loop?: boolean
  /** Reserve the width of the widest word so surrounding layout never shifts. */
  reserveSpace?: boolean
  /** Extra sample used only to reserve width (e.g. "00:00" for clocks). */
  placeholder?: string
  align?: 'start' | 'center' | 'end'
  showCaret?: boolean
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
  deleteSpeed = 40,
  pauseDuration = 2200,
  nextWordDelay = 300,
  random = false,
  loop = true,
  reserveSpace = true,
  placeholder,
  align = 'start',
  showCaret = true,
  className,
  caretClassName,
}: TypewriterProps) {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const safeIndexMax = Math.max(words.length - 1, 0)
  const [index, setIndex] = useState(0)
  const clampedIndex = Math.min(index, safeIndexMax)
  const word = words[clampedIndex] ?? ''

  const [text, setText] = useState(words[0] ?? '')
  const [phase, setPhase] = useState<Phase>(() => (loop ? 'typing' : 'idle'))
  const [trackedWord, setTrackedWord] = useState(word)

  // Sync rewrite when the target word changes (clock tick, new list item, etc.).
  if (word !== trackedWord) {
    setTrackedWord(word)
    if (reducedMotion) {
      setText(word)
      setPhase('idle')
    } else {
      setPhase(text === '' ? 'typing' : 'deleting')
    }
  }

  useEffect(() => {
    if (words.length === 0 || phase === 'idle') return

    let timeout: number

    if (phase === 'typing') {
      if (text === word) {
        if (loop) {
          timeout = window.setTimeout(() => setPhase('deleting'), pauseDuration)
        } else {
          timeout = window.setTimeout(() => setPhase('idle'), 0)
        }
      } else {
        timeout = window.setTimeout(() => {
          setText(reducedMotion ? word : word.slice(0, text.length + 1))
        }, typeSpeed)
      }
    } else if (text === '') {
      timeout = window.setTimeout(() => {
        if (loop) {
          setIndex((current) => pickNextIndex(current, words.length, random))
        }
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
    loop,
    reducedMotion,
  ])

  const ghosts = placeholder ? [...words, placeholder] : [...words]

  const caret = showCaret ? (
    <span
      aria-hidden="true"
      className={cn(
        'ml-[0.05em] inline-block h-[0.85em] w-[0.08em] translate-y-[0.08em] bg-current animate-caret-blink',
        caretClassName,
      )}
    />
  ) : null

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
      {ghosts.map((ghost) => (
        <span
          key={ghost}
          aria-hidden="true"
          className="invisible col-start-1 row-start-1"
        >
          {ghost}
          {showCaret ? (
            <span className="ml-[0.05em] inline-block w-[0.08em]" />
          ) : null}
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
