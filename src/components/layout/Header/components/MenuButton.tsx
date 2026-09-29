import { useEffect, useRef, useState } from 'react'
import { LayoutGridIcon, XIcon } from 'lucide-react'
import { useReducedMotion } from 'motion/react'
import { gsap } from '@/lib/animations/gsap'
import { cn } from '@/lib/utils/cn'

type MenuButtonProps = {
  open: boolean
  onClick: () => void
}

type Phase = 'idle' | 'hold' | 'short'

const PUFFS = [
  { x: -16, y: -36, scale: 1.45, delay: 0.02, size: 8, ember: false },
  { x: 6, y: -48, scale: 1.9, delay: 0.08, size: 13, ember: false },
  { x: 18, y: -30, scale: 1.15, delay: 0, size: 7, ember: false },
  { x: -6, y: -58, scale: 2.2, delay: 0.14, size: 16, ember: false },
  { x: 2, y: -24, scale: 1.05, delay: 0.05, size: 6, ember: false },
  { x: -18, y: -20, scale: 1.25, delay: 0.18, size: 9, ember: true },
  { x: 22, y: -52, scale: 1.55, delay: 0.1, size: 11, ember: false },
  { x: 0, y: -68, scale: 2.35, delay: 0.2, size: 18, ember: false },
  { x: 12, y: 16, scale: 0.7, delay: 0.06, size: 4, ember: true },
  { x: -10, y: 18, scale: 0.55, delay: 0.12, size: 3, ember: true },
] as const

const SPARKS = [-28, 18, 62, 108, 154, 206, -78] as const

function playShortSound() {
  const AudioContextCtor =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext
  if (!AudioContextCtor) return

  const ctx = new AudioContextCtor()
  const now = ctx.currentTime
  const master = ctx.createGain()
  master.gain.setValueAtTime(0.16, now)
  master.connect(ctx.destination)

  const buzz = ctx.createOscillator()
  const buzzGain = ctx.createGain()
  buzz.type = 'sawtooth'
  buzz.frequency.setValueAtTime(520, now)
  buzz.frequency.exponentialRampToValueAtTime(55, now + 0.2)
  buzzGain.gain.setValueAtTime(0.1, now)
  buzzGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22)
  buzz.connect(buzzGain)
  buzzGain.connect(master)
  buzz.start(now)
  buzz.stop(now + 0.24)

  const length = Math.floor(ctx.sampleRate * 0.26)
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < length; i += 1) {
    const env = (1 - i / length) ** 1.35
    const unit = Math.sin(i * 12.9898) * 43758.5453
    const white = (unit - Math.floor(unit)) * 2 - 1
    const crackle = i % 5 === 0 || i % 11 === 0 ? 1 : 0.05
    data[i] = white * env * crackle
  }
  const noise = ctx.createBufferSource()
  noise.buffer = buffer
  const filter = ctx.createBiquadFilter()
  filter.type = 'highpass'
  filter.frequency.value = 1400
  const noiseGain = ctx.createGain()
  noiseGain.gain.setValueAtTime(0.45, now)
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28)
  noise.connect(filter)
  filter.connect(noiseGain)
  noiseGain.connect(master)
  noise.start(now)

  const tick = ctx.createOscillator()
  const tickGain = ctx.createGain()
  tick.type = 'triangle'
  tick.frequency.setValueAtTime(1800, now + 0.06)
  tick.frequency.exponentialRampToValueAtTime(240, now + 0.16)
  tickGain.gain.setValueAtTime(0.0001, now + 0.06)
  tickGain.gain.exponentialRampToValueAtTime(0.09, now + 0.075)
  tickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18)
  tick.connect(tickGain)
  tickGain.connect(master)
  tick.start(now + 0.06)
  tick.stop(now + 0.2)

  window.setTimeout(() => {
    void ctx.close()
  }, 700)
}

function ShortBurst() {
  const rootRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-puff]',
        { xPercent: -50, yPercent: -50, x: 0, y: 0, scale: 0.2, opacity: 0.7 },
        {
          xPercent: -50,
          yPercent: -50,
          x: (index) => PUFFS[index]?.x ?? 0,
          y: (index) => PUFFS[index]?.y ?? -40,
          scale: (index) => PUFFS[index]?.scale ?? 1,
          opacity: 0,
          delay: (index) => PUFFS[index]?.delay ?? 0,
          duration: 1.25,
          ease: 'power2.out',
          stagger: 0,
        },
      )
      gsap.utils.toArray<HTMLElement>('[data-spark]').forEach((spark, index) => {
        const angle = SPARKS[index] ?? 0
        gsap.fromTo(
          spark,
          { rotation: angle, scaleX: 0.15, opacity: 1 },
          {
            rotation: angle,
            scaleX: 1.7,
            opacity: 0,
            duration: 0.32,
            delay: index * 0.02,
            ease: 'power2.out',
            transformOrigin: '0% 50%',
          },
        )
      })
      gsap.fromTo(
        '[data-flash]',
        { xPercent: -50, yPercent: -50, scale: 0.35, opacity: 0.95 },
        {
          xPercent: -50,
          yPercent: -50,
          scale: 2.4,
          opacity: 0,
          duration: 0.48,
          ease: 'power2.out',
        },
      )
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <span
      ref={rootRef}
      className="pointer-events-none absolute top-1/2 left-1/2 z-10 size-0"
      aria-hidden="true"
    >
      <span
        data-flash
        className="absolute top-0 left-0 size-8 rounded-full bg-white shadow-[0_0_18px_4px_rgba(255,214,150,0.85)]"
      />
      {SPARKS.map((angle) => (
        <span
          key={angle}
          data-spark
          className="absolute top-0 left-0 h-px w-6 origin-left bg-amber-100"
        />
      ))}
      {PUFFS.map((puff) => (
        <span
          key={`${puff.x}-${puff.y}`}
          data-puff
          className={cn(
            'absolute top-0 left-0 rounded-full blur-[1.5px]',
            puff.ember ? 'bg-amber-200/90' : 'bg-foreground/40',
          )}
          style={{ width: puff.size, height: puff.size }}
        />
      ))}
    </span>
  )
}

export default function MenuButton({ open, onClick }: MenuButtonProps) {
  const reducedMotion = useReducedMotion()
  const spinRef = useRef<HTMLSpanElement>(null)
  const shakeRef = useRef<HTMLSpanElement>(null)
  const chargeRef = useRef<HTMLSpanElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const recoveryRef = useRef<gsap.core.Timeline | null>(null)
  const phaseRef = useRef<Phase>('idle')
  const suppressClickRef = useRef(false)
  const startedAtRef = useRef(0)
  const [phase, setPhase] = useState<Phase>('idle')
  const [fx, setFx] = useState(false)

  const movePhase = (next: Phase) => {
    phaseRef.current = next
    setPhase(next)
  }

  const settle = (spin: HTMLSpanElement, shake: HTMLSpanElement) => {
    const current = Number(gsap.getProperty(spin, 'rotation')) || 0
    const finish = current < 50 ? 0 : Math.ceil(current / 360) * 360
    gsap.killTweensOf([spin, shake])
    gsap.to(spin, {
      rotation: finish,
      scale: 1,
      filter: 'none',
      duration: current < 50 ? 0.45 : 0.75,
      ease: 'power3.out',
      onComplete: () => gsap.set(spin, { clearProps: 'all' }),
    })
    gsap.to(shake, {
      x: 0,
      y: 0,
      duration: 0.45,
      ease: 'power3.out',
      onComplete: () => gsap.set(shake, { clearProps: 'x,y' }),
    })
  }

  const releaseHold = () => {
    if (phaseRef.current !== 'hold') return
    const elapsed = (performance.now() - startedAtRef.current) / 1000
    movePhase('idle')
    tlRef.current?.kill()
    tlRef.current = null
    if (elapsed > 0.28) suppressClickRef.current = true

    const spin = spinRef.current
    const shake = shakeRef.current
    if (!spin || !shake) return

    if (elapsed < 0.28) {
      gsap.killTweensOf([spin, shake, chargeRef.current].filter(Boolean))
      gsap.set([spin, shake], { clearProps: 'all' })
      if (chargeRef.current) gsap.set(chargeRef.current, { clearProps: 'all' })
      return
    }

    settle(spin, shake)
    if (chargeRef.current) {
      gsap.to(chargeRef.current, {
        opacity: 0,
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
        onComplete: () => gsap.set(chargeRef.current, { clearProps: 'all' }),
      })
    }
  }

  const triggerShort = () => {
    if (phaseRef.current !== 'hold') return
    const spin = spinRef.current
    const shake = shakeRef.current
    if (!spin || !shake) return

    movePhase('short')
    suppressClickRef.current = true
    tlRef.current?.kill()
    tlRef.current = null
    playShortSound()
    setFx(true)

    const current = Number(gsap.getProperty(spin, 'rotation')) || 0
    gsap.set(spin, { rotation: ((current % 360) + 360) % 360 })
    gsap.killTweensOf([spin, shake])

    const recovery = gsap.timeline({
      onComplete: () => {
        gsap.set([spin, shake], { clearProps: 'all' })
        if (chargeRef.current) gsap.set(chargeRef.current, { clearProps: 'all' })
        setFx(false)
        movePhase('idle')
      },
    })
    recovery.to(spin, {
      opacity: 0.15,
      duration: 0.045,
      yoyo: true,
      repeat: 5,
      ease: 'none',
    })
    recovery.to(spin, { opacity: 1, duration: 0.04 })
    recovery.fromTo(
      spin,
      { scale: 1.45 },
      { scale: 0.68, duration: 0.08, ease: 'power2.in' },
      0,
    )
    recovery.to(
      spin,
      {
        rotation: 0,
        scale: 1,
        filter: 'none',
        duration: 0.9,
        ease: 'elastic.out(1, 0.5)',
      },
      0.28,
    )
    recovery.to(shake, { x: 0, y: 0, duration: 0.4, ease: 'power3.out' }, 0)
    recoveryRef.current = recovery
  }

  const startHold = () => {
    if (reducedMotion || open || phaseRef.current !== 'idle') return
    const spin = spinRef.current
    const shake = shakeRef.current
    const charge = chargeRef.current
    if (!spin || !shake || !charge) return

    gsap.killTweensOf([spin, shake, charge])
    startedAtRef.current = performance.now()
    movePhase('hold')

    const tl = gsap.timeline()
    tl.to(spin, { scale: 1.08, duration: 0.95, ease: 'sine.inOut' }, 0)
    tl.to(spin, { scale: 1, duration: 0.8, ease: 'sine.inOut' }, 0.95)
    tl.fromTo(
      charge,
      { opacity: 0, scale: 0.85 },
      { opacity: 0.45, scale: 1.28, duration: 1.6, ease: 'sine.out' },
      0,
    )
    tl.to(charge, { opacity: 0, scale: 1.55, duration: 0.35 }, 1.7)
    tl.to(spin, { rotation: 240, duration: 1.2, ease: 'power2.in' }, 1.9)
    tl.to(spin, { rotation: 980, duration: 1.1, ease: 'power2.in' }, 3.1)
    tl.to(
      spin,
      {
        keyframes: [
          { scale: 1.16, duration: 0.18 },
          { scale: 0.88, duration: 0.14 },
          { scale: 1.3, duration: 0.16 },
          { scale: 0.78, duration: 0.12 },
          { scale: 1.42, duration: 0.16 },
          { scale: 0.7, duration: 0.12 },
          { scale: 1.24, duration: 0.14 },
        ],
        ease: 'power1.inOut',
      },
      3.25,
    )
    tl.to(
      shake,
      {
        keyframes: [
          { x: -1.5, y: 1, duration: 0.08 },
          { x: 2, y: -1.2, duration: 0.07 },
          { x: -2.2, y: 1.6, duration: 0.07 },
          { x: 1.4, y: -1.8, duration: 0.08 },
          { x: 0, y: 0, duration: 0.06 },
        ],
        repeat: 2,
        ease: 'none',
      },
      3.3,
    )
    tl.to(
      spin,
      {
        keyframes: [
          { rotation: '+=90', duration: 0.12 },
          { rotation: '-=24', duration: 0.08 },
          { rotation: '+=160', duration: 0.14 },
          { rotation: '-=36', duration: 0.07 },
          { rotation: '+=240', duration: 0.15 },
          { rotation: '-=16', duration: 0.05 },
          { rotation: '+=280', duration: 0.16 },
        ],
      },
      4.2,
    )
    tl.to(
      shake,
      {
        keyframes: [
          { x: -6, y: 3, duration: 0.05 },
          { x: 7, y: -4, duration: 0.05 },
          { x: -5, y: -3, duration: 0.045 },
          { x: 6, y: 5, duration: 0.05 },
          { x: -7, y: 2, duration: 0.04 },
          { x: 4, y: -6, duration: 0.05 },
        ],
        repeat: 3,
        ease: 'none',
      },
      4.15,
    )
    tl.to(
      spin,
      {
        keyframes: [
          { scale: 1.55, duration: 0.12 },
          { scale: 0.62, duration: 0.1 },
          { scale: 1.38, duration: 0.12 },
          { scale: 0.74, duration: 0.1 },
        ],
        ease: 'power1.inOut',
      },
      4.35,
    )
    tl.to(
      spin,
      {
        filter: 'drop-shadow(0 0 10px rgba(255, 186, 92, 0.95))',
        duration: 0.9,
      },
      4.2,
    )
    tl.call(triggerShort, [], 5.2)
    tlRef.current = tl
  }

  useEffect(() => {
    return () => {
      tlRef.current?.kill()
      recoveryRef.current?.kill()
    }
  }, [])

  useEffect(() => {
    if (!open) return
    if (phaseRef.current === 'hold') releaseHold()
    const spin = spinRef.current
    if (spin && phaseRef.current === 'idle') {
      gsap.set(spin, { clearProps: 'all' })
    }
    // releaseHold is intentionally tied to the open transition only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return (
    <button
      type="button"
      data-cursor="interactive"
      data-egg={phase}
      aria-expanded={open}
      aria-controls="site-menu"
      aria-label={open ? 'Fechar menu' : 'Abrir menu'}
      onContextMenu={(event) => event.preventDefault()}
      onPointerDown={(event) => {
        if (open || reducedMotion || phaseRef.current === 'short') return
        try {
          event.currentTarget.setPointerCapture(event.pointerId)
        } catch {
          // Pointer capture is unavailable for this event.
        }
        suppressClickRef.current = false
        startHold()
      }}
      onPointerUp={releaseHold}
      onPointerCancel={releaseHold}
      onPointerEnter={() => {
        if (phaseRef.current !== 'idle' || open || reducedMotion) return
        gsap.to(spinRef.current, {
          rotation: 45,
          duration: 0.35,
          ease: 'power3.out',
          overwrite: 'auto',
        })
      }}
      onPointerLeave={() => {
        if (phaseRef.current !== 'idle' || open || reducedMotion) return
        gsap.to(spinRef.current, {
          rotation: 0,
          duration: 0.4,
          ease: 'power3.out',
          overwrite: 'auto',
        })
      }}
      onClick={() => {
        if (suppressClickRef.current || phaseRef.current !== 'idle') {
          suppressClickRef.current = false
          return
        }
        onClick()
      }}
      className={cn(
        'group relative flex touch-none items-center justify-center overflow-visible transition-colors duration-300',
        open
          ? 'size-11 rounded-full bg-foreground text-background hover:scale-105'
          : 'rounded-full p-2 text-foreground/70 hover:text-foreground',
        phase === 'short' && 'text-amber-100',
      )}
    >
      <span
        ref={chargeRef}
        className="pointer-events-none absolute size-9 rounded-full border border-current opacity-0"
        aria-hidden="true"
      />
      <span ref={shakeRef} className="relative flex items-center justify-center">
        {fx ? <ShortBurst /> : null}
        <span
          ref={spinRef}
          className={cn(
            'relative size-6',
            phase === 'short' && 'text-amber-100',
          )}
        >
          <LayoutGridIcon
            className={cn(
              'absolute inset-0 size-6 transition-all duration-300',
              open
                ? 'scale-50 rotate-45 opacity-0'
                : 'scale-100 rotate-0 opacity-100',
            )}
          />
          <XIcon
            className={cn(
              'absolute inset-0 size-6 transition-all duration-300',
              open
                ? 'scale-100 rotate-0 opacity-100'
                : 'scale-50 -rotate-45 opacity-0',
            )}
          />
        </span>
      </span>
    </button>
  )
}
