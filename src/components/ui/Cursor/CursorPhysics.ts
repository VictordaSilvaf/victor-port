import { CURSOR_CONFIG, POINT_COUNT } from './config'

/** One sample of the bubble surface, stored in polar space. */
export type Point = {
  angle: number
  cos: number
  sin: number
  /** Radial offset from the base radius (0 = perfect circle). */
  r: number
  /** Radial velocity. */
  rv: number
  /** Target radial offset requested by the active behavior this frame. */
  impulse: number
  /** Resolved screen position, written by the physics step. */
  x: number
  y: number
}

export type CursorPhysics = {
  points: Point[]
  centerX: number
  centerY: number
  /** Brush tail chain; index 0 is always the head center. */
  tailX: Float32Array
  tailY: Float32Array
  mouseX: number
  mouseY: number
  /** Smoothed pointer velocity (px/s). */
  mouseVx: number
  mouseVy: number
  /** Uniform radial swell requested by behaviors (e.g. hover). */
  swell: number
  radius: number
  reducedMotion: boolean
  /** Scratch buffer for the surface laplacian (avoids per-frame allocation). */
  laplacian: Float32Array
}

const FIXED_DT = 1 / 120
const MAX_SUBSTEPS = 5

export function createCursorPhysics(startX = 0, startY = 0): CursorPhysics {
  const radius = CURSOR_CONFIG.radius
  const points: Point[] = []

  for (let i = 0; i < POINT_COUNT; i++) {
    const angle = (i / POINT_COUNT) * Math.PI * 2
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    points.push({
      angle,
      cos,
      sin,
      r: 0,
      rv: 0,
      impulse: 0,
      x: startX + cos * radius,
      y: startY + sin * radius,
    })
  }

  const tailX = new Float32Array(CURSOR_CONFIG.brushSegments).fill(startX)
  const tailY = new Float32Array(CURSOR_CONFIG.brushSegments).fill(startY)

  return {
    points,
    centerX: startX,
    centerY: startY,
    tailX,
    tailY,
    mouseX: startX,
    mouseY: startY,
    mouseVx: 0,
    mouseVy: 0,
    swell: 0,
    radius,
    reducedMotion: false,
    laplacian: new Float32Array(POINT_COUNT),
  }
}

export function setPhysicsMousePosition(
  physics: CursorPhysics,
  x: number,
  y: number,
): void {
  physics.mouseX = x
  physics.mouseY = y
}

/** Feed raw instantaneous velocity; the physics EMA-smooths it. */
export function pushMouseVelocity(
  physics: CursorPhysics,
  rawVx: number,
  rawVy: number,
): void {
  const s = CURSOR_CONFIG.velocitySmoothing
  physics.mouseVx += (rawVx - physics.mouseVx) * s
  physics.mouseVy += (rawVy - physics.mouseVy) * s
}

/** Snap the whole bubble to a position with no motion — used on re-entry. */
export function resetPhysicsTo(
  physics: CursorPhysics,
  x: number,
  y: number,
): void {
  physics.centerX = x
  physics.centerY = y
  physics.mouseX = x
  physics.mouseY = y
  physics.mouseVx = 0
  physics.mouseVy = 0
  physics.tailX.fill(x)
  physics.tailY.fill(y)

  for (const p of physics.points) {
    p.r = 0
    p.rv = 0
    p.impulse = 0
    p.x = x + p.cos * physics.radius
    p.y = y + p.sin * physics.radius
  }
}

function updateTail(physics: CursorPhysics, t: number): void {
  const cfg = CURSOR_CONFIG
  const { tailX, tailY } = physics
  const count = tailX.length

  tailX[0] = physics.centerX
  tailY[0] = physics.centerY

  if (physics.reducedMotion && !cfg.reducedMotion.brushEnabled) {
    tailX.fill(physics.centerX)
    tailY.fill(physics.centerY)
    return
  }

  const link = 1 - Math.exp(-cfg.brushFollow * t)
  const maxSegment = cfg.brushMaxSegment

  for (let i = 1; i < count; i++) {
    const px = tailX[i - 1]!
    const py = tailY[i - 1]!
    let x = tailX[i]! + (px - tailX[i]!) * link
    let y = tailY[i]! + (py - tailY[i]!) * link

    const dx = x - px
    const dy = y - py
    const distance = Math.hypot(dx, dy)
    if (distance > maxSegment) {
      const k = maxSegment / distance
      x = px + dx * k
      y = py + dy * k
    }

    tailX[i] = x
    tailY[i] = y
  }
}

export function updateCursorPhysics(physics: CursorPhysics, dt: number): void {
  const cfg = CURSOR_CONFIG
  const reduced = physics.reducedMotion
  const t = Math.min(Math.max(dt, 0.0005), 0.05)

  const stiffness = reduced ? cfg.reducedMotion.stiffness : cfg.stiffness
  const damping = reduced ? cfg.reducedMotion.damping : cfg.damping
  const diffusion = reduced
    ? cfg.reducedMotion.neighborDiffusion
    : cfg.neighborDiffusion
  const centerFollow = reduced
    ? cfg.reducedMotion.centerFollow
    : cfg.centerFollow

  const { points, laplacian } = physics
  const count = points.length
  const radius = physics.radius

  // --- pointer velocity settles to zero when idle -------------------------
  const decay = Math.pow(cfg.velocityDecay, t * 60)
  physics.mouseVx *= decay
  physics.mouseVy *= decay
  if (Math.abs(physics.mouseVx) < 1) physics.mouseVx = 0
  if (Math.abs(physics.mouseVy) < 1) physics.mouseVy = 0

  // --- head follows the pointer (exponential, never overshoots) -----------
  const follow = 1 - Math.exp(-centerFollow * t)
  physics.centerX += (physics.mouseX - physics.centerX) * follow
  physics.centerY += (physics.mouseY - physics.centerY) * follow

  updateTail(physics, t)

  // --- radial wave equation, fixed substeps for stability -----------------
  const substeps = Math.min(MAX_SUBSTEPS, Math.max(1, Math.ceil(t / FIXED_DT)))
  const h = t / substeps
  const invMass = 1 / cfg.mass
  const maxOffset = radius * 1.6
  const minOffset = -radius * 0.55

  for (let s = 0; s < substeps; s++) {
    for (let i = 0; i < count; i++) {
      const prev = points[(i - 1 + count) % count]!
      const next = points[(i + 1) % count]!
      laplacian[i] = prev.r + next.r - 2 * points[i]!.r
    }

    for (let i = 0; i < count; i++) {
      const p = points[i]!
      const spring = (p.impulse - p.r) * stiffness * invMass
      const wave = laplacian[i]! * diffusion
      const drag = p.rv * damping
      p.rv += (spring + wave - drag) * h
      p.r += p.rv * h

      if (p.r > maxOffset) {
        p.r = maxOffset
        p.rv = 0
      } else if (p.r < minOffset) {
        p.r = minOffset
        p.rv = 0
      }
    }
  }

  // --- resolve screen positions: the head always stays round --------------
  const baseRadius = radius + physics.swell

  for (let i = 0; i < count; i++) {
    const p = points[i]!
    const len = baseRadius + p.r
    p.x = physics.centerX + p.cos * len
    p.y = physics.centerY + p.sin * len
    p.impulse = 0
  }
}

export function getTailLength(physics: CursorPhysics): number {
  const { tailX, tailY } = physics
  let length = 0
  for (let i = 1; i < tailX.length; i++) {
    length += Math.hypot(tailX[i]! - tailX[i - 1]!, tailY[i]! - tailY[i - 1]!)
  }
  return length
}

/** True when the surface is a circle and the tail has fully retracted. */
export function isPhysicsAtRest(physics: CursorPhysics): boolean {
  if (getTailLength(physics) > 0.25) return false
  for (const p of physics.points) {
    if (Math.abs(p.r) > 0.05 || Math.abs(p.rv) > 0.05) return false
  }
  return true
}
