import { CURSOR_CONFIG } from './config'
import type { CursorPhysics } from './CursorPhysics'

export type CursorRenderer = {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  width: number
  height: number
  dpr: number
}

export function createCursorRenderer(
  canvas: HTMLCanvasElement,
): CursorRenderer {
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Canvas 2D context unavailable')
  }

  const renderer: CursorRenderer = {
    canvas,
    ctx,
    width: 0,
    height: 0,
    dpr: 1,
  }

  resizeCursorRenderer(renderer)
  return renderer
}

export function resizeCursorRenderer(renderer: CursorRenderer): void {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const width = window.innerWidth
  const height = window.innerHeight

  renderer.dpr = dpr
  renderer.width = width
  renderer.height = height

  renderer.canvas.width = Math.floor(width * dpr)
  renderer.canvas.height = Math.floor(height * dpr)
  renderer.canvas.style.width = `${width}px`
  renderer.canvas.style.height = `${height}px`
  renderer.ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}

export function clearCursorRenderer(renderer: CursorRenderer): void {
  renderer.ctx.clearRect(0, 0, renderer.width, renderer.height)
}

function drawTrail(renderer: CursorRenderer, physics: CursorPhysics): void {
  const cfg = CURSOR_CONFIG
  const peakAlpha = physics.reducedMotion
    ? cfg.reducedMotion.trailAlpha
    : cfg.trailAlpha
  if (peakAlpha <= 0) return

  const dx = physics.centerX - physics.trailX
  const dy = physics.centerY - physics.trailY
  const distance = Math.hypot(dx, dy)
  if (distance <= cfg.trailMinDistance) return

  const fade = Math.min(
    1,
    (distance - cfg.trailMinDistance) /
      (cfg.trailFullDistance - cfg.trailMinDistance),
  )

  const { ctx } = renderer
  const steps = cfg.trailCount

  for (let k = steps; k >= 1; k--) {
    const ratio = k / (steps + 1)
    const x = physics.centerX - dx * ratio
    const y = physics.centerY - dy * ratio
    const radius = physics.radius * (1 - ratio * 0.62)

    ctx.globalAlpha = peakAlpha * (1 - ratio) * fade
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.globalAlpha = 1
}

/** Closed smooth blob through the surface samples via quadratic midpoints. */
function drawBubble(renderer: CursorRenderer, physics: CursorPhysics): void {
  const { ctx } = renderer
  const { points } = physics
  const count = points.length

  const first = points[0]!
  const last = points[count - 1]!

  ctx.beginPath()
  ctx.moveTo((last.x + first.x) * 0.5, (last.y + first.y) * 0.5)

  for (let i = 0; i < count; i++) {
    const current = points[i]!
    const next = points[(i + 1) % count]!
    ctx.quadraticCurveTo(
      current.x,
      current.y,
      (current.x + next.x) * 0.5,
      (current.y + next.y) * 0.5,
    )
  }

  ctx.closePath()
  ctx.fill()
}

export function drawCursor(
  renderer: CursorRenderer,
  physics: CursorPhysics,
): void {
  if (physics.points.length < 3) return

  clearCursorRenderer(renderer)
  renderer.ctx.fillStyle = '#ffffff'
  drawTrail(renderer, physics)
  drawBubble(renderer, physics)
}

export function styleCursorCanvas(canvas: HTMLCanvasElement): void {
  Object.assign(canvas.style, {
    position: 'fixed',
    inset: '0',
    width: '100vw',
    height: '100vh',
    pointerEvents: 'none',
    zIndex: '9999',
    mixBlendMode: 'difference',
    willChange: 'transform',
    opacity: '0',
    transition: 'opacity 140ms ease-out',
  } satisfies Partial<CSSStyleDeclaration>)
  canvas.setAttribute('aria-hidden', 'true')
}
