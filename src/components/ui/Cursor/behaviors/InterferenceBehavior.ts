import { CURSOR_CONFIG } from '../config'
import type { CursorBehavior } from '../CursorBehavior'
import { crackle, surfaceInterference } from '../noise'

/**
 * Opt-in loud state for elements marked with `.cursor-interference`
 * or `data-cursor="interference"`. The surface picks up dense, crackling
 * distortion as if the liquid were being disturbed.
 */
export const InterferenceBehavior: CursorBehavior = {
  id: 'interference',
  apply(ctx) {
    const { physics, state, time } = ctx
    const strength = state.interactionStrength
    if (strength < 0.001) return

    physics.swell += CURSOR_CONFIG.interferenceSwell * strength

    if (ctx.reducedMotion) return

    const amplitude =
      CURSOR_CONFIG.interferenceAmplitude * strength * crackle(time)
    const phase = time * CURSOR_CONFIG.interferenceFrequency
    const points = physics.points

    for (let i = 0; i < points.length; i++) {
      const p = points[i]!
      p.impulse += surfaceInterference(p.angle, phase) * amplitude
    }
  },
}
