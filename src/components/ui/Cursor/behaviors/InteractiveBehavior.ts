import { CURSOR_CONFIG } from '../config'
import type { CursorBehavior } from '../CursorBehavior'
import { surfaceRipple } from '../noise'

/**
 * Links and buttons: the bubble swells slightly and its surface breathes.
 * Intentionally gentle — the loud version is InterferenceBehavior.
 */
export const InteractiveBehavior: CursorBehavior = {
  id: 'interactive',
  apply(ctx) {
    const { physics, state, time } = ctx
    const strength = state.interactionStrength
    if (strength < 0.001) return

    physics.swell += CURSOR_CONFIG.interactionSwell * strength

    if (ctx.reducedMotion) return

    const amplitude = CURSOR_CONFIG.interactionAmplitude * strength
    const phase = time * CURSOR_CONFIG.interactionFrequency
    const points = physics.points

    for (let i = 0; i < points.length; i++) {
      const p = points[i]!
      p.impulse += surfaceRipple(p.angle, phase) * amplitude
    }
  },
}
