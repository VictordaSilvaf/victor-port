import { CURSOR_CONFIG } from './config'
import { getTailLength, type CursorPhysics } from './CursorPhysics'

export type CursorRenderer = {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  width: number
  height: number
  dpr: number
  /** Brush outline scratch buffer: both sides of the tail, interleaved x/y. */
  outline: Float32Array
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
    outline: new Float32Array(CURSOR_CONFIG.brushSegments * 4),
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

/**
 * Tapered brush stroke along the tail chain. Width starts at the head radius
 * (so the outline meets the bubble tangentially) and thins to a point.
 */
function drawBrush(renderer: CursorRenderer, physics: CursorPhysics): void {
  const cfg = CURSOR_CONFIG
  const { tailX, tailY } = physics
  const count = tailX.length
  if (count < 2 || getTailLength(physics) < cfg.brushMinLength) return

  const outline = renderer.outline
  const headRadius = physics.radius + physics.swell
  const last = count - 1

  // Seed the normal from the overall stroke direction so collapsed nodes
  // near the head never produce a zero-width segment.
  let dirX = tailX[0]! - tailX[last]!
  let dirY = tailY[0]! - tailY[last]!
  const dirLen = Math.hypot(dirX, dirY) || 1
  let nx = -dirY / dirLen
  let ny = dirX / dirLen

  for (let i = 0; i < count; i++) {
    const a = i === 0 ? 0 : i - 1
    const b = i === last ? last : i + 1
    dirX = tailX[a]! - tailX[b]!
    dirY = tailY[a]! - tailY[b]!
    const len = Math.hypot(dirX, dirY)
    if (len > 0.001) {
      nx = -dirY / len
      ny = dirX / len
    }

    const width = headRadius * Math.pow(1 - i / last, cfg.brushTaper)
    const x = tailX[i]!
    const y = tailY[i]!

    const left = i * 2
    const right = (count * 2 - 1 - i) * 2
    outline[left] = x + nx * width
    outline[left + 1] = y + ny * width
    outline[right] = x - nx * width
    outline[right + 1] = y - ny * width
  }

  traceClosedSmooth(renderer.ctx, outline, count * 2)
  renderer.ctx.fill()
}

/** Closed quadratic-midpoint curve through interleaved [x, y, ...] coords. */
function traceClosedSmooth(
  ctx: CanvasRenderingContext2D,
  coords: Float32Array,
  total: number,
): void {
  const lastIndex = (total - 1) * 2
  ctx.beginPath()
  ctx.moveTo(
    (coords[lastIndex]! + coords[0]!) * 0.5,
    (coords[lastIndex + 1]! + coords[1]!) * 0.5,
  )

  for (let i = 0; i < total; i++) {
    const cx = coords[i * 2]!
    const cy = coords[i * 2 + 1]!
    const n = ((i + 1) % total) * 2
    ctx.quadraticCurveTo(cx, cy, (cx + coords[n]!) * 0.5, (cy + coords[n + 1]!) * 0.5)
  }

  ctx.closePath()
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
  drawBrush(renderer, physics)
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
