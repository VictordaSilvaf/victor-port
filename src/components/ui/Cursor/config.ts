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

  /* ---- motion deformation ----------------------------------------------- */
  /** Smoothed velocity -> stretch conversion. */
  mouseInfluence: 0.00055,
  /** Max elongation along the travel axis. */
  maxStretch: 0.46,
  /** EMA applied to raw pointer velocity. */
  velocitySmoothing: 0.22,
  /** Per-frame velocity decay when the pointer idles. */
  velocityDecay: 0.9,
  /** Exponential rate for the smoothed stretch value. */
  stretchFollow: 11,

  /* ---- trail ------------------------------------------------------------ */
  /** Follow rate of the lagging trail anchor (lower = longer trail). */
  trailFollow: 8,
  /** Number of echo blobs behind the cursor. */
  trailCount: 3,
  /** Peak alpha of the closest echo. */
  trailAlpha: 0.2,
  /** Distance (px) before the trail starts fading in. */
  trailMinDistance: 5,
  /** Distance (px) at which the trail reaches full alpha. */
  trailFullDistance: 42,

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
    mouseInfluence: 0,
    interactionAmplitude: 0,
    interferenceAmplitude: 0,
    trailAlpha: 0,
  },
} as const

export type CursorConfig = typeof CURSOR_CONFIG
