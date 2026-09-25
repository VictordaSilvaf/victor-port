import { CURSOR_CONFIG } from './config'
import type { BehaviorContext, CursorBehavior } from './CursorBehavior'
import {
  applyBehaviorTransition,
  getActiveBehavior,
  sampleInteraction,
} from './CursorInteraction'
import {
  createCursorPhysics,
  isPhysicsAtRest,
  pushMouseVelocity,
  resetPhysicsTo,
  setPhysicsMousePosition,
  updateCursorPhysics,
  type CursorPhysics,
} from './CursorPhysics'
import {
  clearCursorRenderer,
  createCursorRenderer,
  drawCursor,
  resizeCursorRenderer,
  styleCursorCanvas,
  type CursorRenderer,
} from './CursorRenderer'
import {
  createCursorState,
  setCursorState,
  updateInteractionStrength,
  type CursorStateId,
  type CursorStateMachine,
} from './CursorState'
import { registerBuiltInBehaviors } from './registerBehaviors'

export type CursorEngine = {
  setState: (id: CursorStateId) => void
  destroy: () => void
}

type EngineInternal = {
  physics: CursorPhysics
  renderer: CursorRenderer
  state: CursorStateMachine
  activeBehavior: CursorBehavior | undefined
  rafId: number
  fadeTimeout: number
  lastFrameTime: number
  lastMoveX: number
  lastMoveY: number
  lastMoveTime: number
  hasPointerSample: boolean
  awaitingReentry: boolean
  visible: boolean
  reducedMotion: boolean
  destroyed: boolean
}

const MAX_POINTER_SPEED = 4000

export function createCursorEngine(
  parent: HTMLElement = document.body,
): CursorEngine {
  registerBuiltInBehaviors()

  const cfg = CURSOR_CONFIG
  const canvas = document.createElement('canvas')
  styleCursorCanvas(canvas)
  parent.appendChild(canvas)

  const renderer = createCursorRenderer(canvas)
  const physics = createCursorPhysics(-200, -200)
  const state = createCursorState('default')

  const reducedMotionMq = window.matchMedia('(prefers-reduced-motion: reduce)')
  physics.reducedMotion = reducedMotionMq.matches

  const internal: EngineInternal = {
    physics,
    renderer,
    state,
    activeBehavior: getActiveBehavior('default'),
    rafId: 0,
    fadeTimeout: 0,
    lastFrameTime: performance.now(),
    lastMoveX: 0,
    lastMoveY: 0,
    lastMoveTime: performance.now(),
    hasPointerSample: false,
    awaitingReentry: false,
    visible: false,
    reducedMotion: reducedMotionMq.matches,
    destroyed: false,
  }

  const buildContext = (time: number, dt: number): BehaviorContext => ({
    physics,
    state,
    time,
    dt,
    reducedMotion: internal.reducedMotion,
  })

  const switchState = (next: CursorStateId, time: number, dt: number) => {
    if (!setCursorState(state, next)) return
    const nextBehavior = getActiveBehavior(next)
    const ctx = buildContext(time, dt)
    applyBehaviorTransition(internal.activeBehavior, nextBehavior, ctx)
    internal.activeBehavior = nextBehavior
  }

  const show = () => {
    window.clearTimeout(internal.fadeTimeout)
    internal.fadeTimeout = 0
    internal.visible = true
    canvas.style.transition = 'opacity 140ms ease-out'
    canvas.style.opacity = '1'
  }

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return

    const now = performance.now()
    const dtSec = Math.max((now - internal.lastMoveTime) / 1000, 1 / 240)
    const x = event.clientX
    const y = event.clientY

    if (!internal.hasPointerSample) {
      internal.hasPointerSample = true
      resetPhysicsTo(physics, x, y)
    } else if (internal.awaitingReentry) {
      // Coming back into the viewport: only teleport when we re-enter far
      // from where the bubble drifted off, otherwise let it flow back in.
      const drift = Math.hypot(physics.centerX - x, physics.centerY - y)
      if (drift > cfg.reentryTeleportDistance) {
        resetPhysicsTo(physics, x, y)
      }
    } else {
      const rawVx = (x - internal.lastMoveX) / dtSec
      const rawVy = (y - internal.lastMoveY) / dtSec
      const speed = Math.hypot(rawVx, rawVy)
      const scale = speed > MAX_POINTER_SPEED ? MAX_POINTER_SPEED / speed : 1
      pushMouseVelocity(physics, rawVx * scale, rawVy * scale)
    }

    internal.awaitingReentry = false
    internal.lastMoveX = x
    internal.lastMoveY = y
    internal.lastMoveTime = now

    setPhysicsMousePosition(physics, x, y)
    show()

    switchState(sampleInteraction(x, y).stateId, now / 1000, dtSec)
  }

  const onDocumentLeave = () => {
    if (!internal.hasPointerSample) return

    // Carry the motion past the viewport edge instead of cutting it off.
    physics.mouseX += physics.mouseVx * cfg.exitProjection
    physics.mouseY += physics.mouseVy * cfg.exitProjection
    internal.awaitingReentry = true

    canvas.style.transition = `opacity ${cfg.exitFade}ms ease-out`
    canvas.style.opacity = '0'

    window.clearTimeout(internal.fadeTimeout)
    internal.fadeTimeout = window.setTimeout(() => {
      internal.visible = false
      internal.fadeTimeout = 0
      clearCursorRenderer(renderer)
    }, cfg.exitFade)
  }

  const onDocumentEnter = () => {
    if (!internal.hasPointerSample) return
    show()
  }

  const onResize = () => {
    resizeCursorRenderer(renderer)
  }

  const onReducedMotionChange = (event: MediaQueryListEvent) => {
    internal.reducedMotion = event.matches
    physics.reducedMotion = event.matches
  }

  const onWindowBlur = () => {
    // Avoid a huge catch-up jump when the tab regains focus.
    physics.mouseVx = 0
    physics.mouseVy = 0
  }

  const tick = (now: number) => {
    if (internal.destroyed) return

    const dt = Math.min((now - internal.lastFrameTime) / 1000, 0.05)
    internal.lastFrameTime = now

    // Fully settled and hidden: nothing to integrate or paint.
    if (!internal.visible && isPhysicsAtRest(physics)) {
      internal.rafId = requestAnimationFrame(tick)
      return
    }

    updateInteractionStrength(state, cfg.stateLerp)

    physics.swell = 0
    internal.activeBehavior?.apply(buildContext(now / 1000, dt))
    updateCursorPhysics(physics, dt)

    if (internal.visible) {
      drawCursor(renderer, physics)
    }

    internal.rafId = requestAnimationFrame(tick)
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true })
  document.documentElement.addEventListener('mouseleave', onDocumentLeave)
  document.documentElement.addEventListener('mouseenter', onDocumentEnter)
  window.addEventListener('resize', onResize, { passive: true })
  window.addEventListener('blur', onWindowBlur)
  reducedMotionMq.addEventListener('change', onReducedMotionChange)

  internal.rafId = requestAnimationFrame(tick)

  return {
    setState(id) {
      switchState(id, performance.now() / 1000, 1 / 60)
    },
    destroy() {
      if (internal.destroyed) return
      internal.destroyed = true
      cancelAnimationFrame(internal.rafId)
      window.clearTimeout(internal.fadeTimeout)
      window.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('mouseleave', onDocumentLeave)
      document.documentElement.removeEventListener('mouseenter', onDocumentEnter)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('blur', onWindowBlur)
      reducedMotionMq.removeEventListener('change', onReducedMotionChange)
      canvas.remove()
    },
  }
}
