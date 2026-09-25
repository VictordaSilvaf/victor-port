/**
 * Continuous, wrap-safe surface distortion helpers.
 *
 * Only integer angular harmonics are used so the value at angle 0 and 2π
 * match exactly — otherwise the blob would show a visible seam.
 */

/** Smooth organic ripple around the circumference. */
export function surfaceRipple(angle: number, time: number): number {
  return (
    Math.sin(angle * 3 + time * 1.7) * 0.5 +
    Math.sin(angle * 5 - time * 1.1) * 0.3 +
    Math.sin(angle * 2 + time * 2.3) * 0.2
  )
}

/** Denser, less predictable distortion used for interference. */
export function surfaceInterference(angle: number, time: number): number {
  return (
    Math.sin(angle * 4 + time * 2.6) * 0.4 +
    Math.sin(angle * 7 - time * 3.4) * 0.3 +
    Math.sin(angle * 11 + time * 1.9) * 0.2 +
    Math.sin(angle * 3 - time * 4.7) * 0.1
  )
}

/** Slow crackle in 0..1 used to modulate interference intensity over time. */
export function crackle(time: number): number {
  return (
    0.6 +
    0.25 * Math.sin(time * 5.3) +
    0.15 * Math.sin(time * 11.7 + 1.3)
  )
}
