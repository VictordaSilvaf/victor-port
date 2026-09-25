export const POINT_COUNT = 40

export const CURSOR_CONFIG = {
  /** Base radius in CSS pixels. */
  radius: 15,

  /* ---- center follow ---------------------------------------------------- */
  /** Exponential follow rate toward the pointer (higher = tighter). */
  centerFollow: 17,

  /* ---- surface spring (radial) ------------------------------------------ */
  /** Mass of each surface sample. */
  mass: 1,
  /** Radial spring stiffness pulling the surface back to a perfect circle. */
  stiffness: 165,
  /** Viscous damping coefficient (critical ~ 2*sqrt(stiffness*mass)). */
  damping: 13,
  /** Wave propagation across neighboring samples. */
  neighborDiffusion: 30,

  /* ---- pointer velocity ------------------------------------------------- */
  /** EMA applied to raw pointer velocity. */
  velocitySmoothing: 0.22,
  /** Per-frame velocity decay when the pointer idles. */
  velocityDecay: 0.9,

  /* ---- brush tail ------------------------------------------------------- */
  /** Number of nodes in the tail chain (more = smoother curves). */
  brushSegments: 12,
  /** Follow rate of each node toward the previous one (lower = longer tail). */
  brushFollow: 34,
  /** Max distance between two nodes, caps the tail length on fast strokes. */
  brushMaxSegment: 7,
  /** Taper exponent: >1 thins the tail faster, <1 keeps it thick longer. */
  brushTaper: 1.35,
  /** Tail length (px) below which it is not drawn. */
  brushMinLength: 1.5,

  /* ---- interactive (links, buttons) ------------------------------------- */
  /** Gentle surface shimmer amplitude in px. */
  interactionAmplitude: 1.2,
  /** Shimmer speed. */
  interactionFrequency: 1.5,
  /** Slight swell of the whole bubble on interactive targets. */
  interactionSwell: 2.5,

  /* ---- interference (.cursor-interference) ------------------------------ */
  /** Stronger, noisier distortion amplitude in px. */
  interferenceAmplitude: 3.4,
  /** Distortion speed. */
  interferenceFrequency: 5.2,
  /** Swell while interfering. */
  interferenceSwell: 4,

  /** Blend rate between cursor states (0-1 per frame @60fps). */
  stateLerp: 0.07,

  /* ---- label pill (e.g. "Ver projeto") ---------------------------------- */
  /** Exponential rate the pill grows in (higher = snappier). */
  labelShowRate: 11,
  /** Exponential rate the pill shrinks back into the bubble. */
  labelHideRate: 14,
  /** Rotation (deg) per px/s of horizontal pointer velocity. */
  labelTilt: 0.006,
  /** Max tilt in degrees. */
  labelMaxTilt: 9,
  /** Stretch along X per px/s of pointer speed. */
  labelStretch: 0.00005,
  /** Max stretch factor added to scaleX. */
  labelMaxStretch: 0.12,

  /* ---- viewport exit ---------------------------------------------------- */
  /** Seconds of velocity projected forward when the pointer leaves. */
  exitProjection: 0.28,
  /** Fade-out duration in ms after leaving the viewport. */
  exitFade: 320,
  /** Re-entry distance (px) beyond which the bubble teleports instead of flying. */
  reentryTeleportDistance: 260,

  /** Overrides applied when prefers-reduced-motion is set. */
  reducedMotion: {
    centerFollow: 30,
    stiffness: 320,
    damping: 34,
    neighborDiffusion: 8,
    interactionAmplitude: 0,
    interferenceAmplitude: 0,
    brushEnabled: false,
  },
} as const

export type CursorConfig = typeof CURSOR_CONFIG
