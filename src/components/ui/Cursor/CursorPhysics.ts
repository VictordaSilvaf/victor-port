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
  /** Lagging anchor used to draw the trail. */
  trailX: number
  trailY: number
  mouseX: number
  mouseY: number
  /** Smoothed pointer velocity (px/s). */
  mouseVx: number
  mouseVy: number
  /** Smoothed elongation amount. */
  stretch: number
  /** Direction of travel, smoothed alongside the stretch. */
  motionX: number
  motionY: number
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

  return {
    points,
    centerX: startX,
    centerY: startY,
    trailX: startX,
    trailY: startY,
    mouseX: startX,
    mouseY: startY,
    mouseVx: 0,
    mouseVy: 0,
    stretch: 0,
    motionX: 0,
    motionY: 0,
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
  physics.trailX = x
  physics.trailY = y
  physics.mouseX = x
  physics.mouseY = y
  physics.mouseVx = 0
  physics.mouseVy = 0
  physics.stretch = 0
  physics.motionX = 0
  physics.motionY = 0

  for (const p of physics.points) {
    p.r = 0
    p.rv = 0
    p.impulse = 0
    p.x = x + p.cos * physics.radius
    p.y = y + p.sin * physics.radius
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
  const mouseInfluence = reduced
    ? cfg.reducedMotion.mouseInfluence
    : cfg.mouseInfluence
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

  // --- center + trail follow (exponential, never overshoots) --------------
  const follow = 1 - Math.exp(-centerFollow * t)
  physics.centerX += (physics.mouseX - physics.centerX) * follow
  physics.centerY += (physics.mouseY - physics.centerY) * follow

  const trailFollow = 1 - Math.exp(-cfg.trailFollow * t)
  physics.trailX += (physics.centerX - physics.trailX) * trailFollow
  physics.trailY += (physics.centerY - physics.trailY) * trailFollow

  // --- elongation along the travel axis -----------------------------------
  const speed = Math.hypot(physics.mouseVx, physics.mouseVy)
  const targetStretch = Math.min(cfg.maxStretch, speed * mouseInfluence)
  const stretchLerp = 1 - Math.exp(-cfg.stretchFollow * t)
  physics.stretch += (targetStretch - physics.stretch) * stretchLerp
  if (physics.stretch < 0.0015) physics.stretch = 0

  if (speed > 1) {
    const targetX = physics.mouseVx / speed
    const targetY = physics.mouseVy / speed
    physics.motionX += (targetX - physics.motionX) * stretchLerp
    physics.motionY += (targetY - physics.motionY) * stretchLerp
  }

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

  // --- resolve screen positions -------------------------------------------
  const stretch = physics.stretch
  const mx = physics.motionX
  const my = physics.motionY
  const baseRadius = radius + physics.swell

  for (let i = 0; i < count; i++) {
    const p = points[i]!
    // Volume-preserving ellipse: extend along travel, squash across it.
    const along = p.cos * mx + p.sin * my
    const scale = 1 + stretch * (along * along * 2 - 1)
    const len = (baseRadius + p.r) * scale

    p.x = physics.centerX + p.cos * len
    p.y = physics.centerY + p.sin * len
    p.impulse = 0
  }
}

/** True when the surface has fully settled back into a circle. */
export function isPhysicsAtRest(physics: CursorPhysics): boolean {
  if (physics.stretch > 0.001) return false
  for (const p of physics.points) {
    if (Math.abs(p.r) > 0.05 || Math.abs(p.rv) > 0.05) return false
  }
  return true
}
