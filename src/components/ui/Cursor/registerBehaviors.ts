import { registerBehavior } from './CursorBehavior'
import { DefaultBehavior } from './behaviors/DefaultBehavior'
import { InteractiveBehavior } from './behaviors/InteractiveBehavior'
import { InterferenceBehavior } from './behaviors/InterferenceBehavior'

let registered = false

/** Idempotent registration of built-in behaviors. */
export function registerBuiltInBehaviors(): void {
  if (registered) return
  registerBehavior(DefaultBehavior)
  registerBehavior(InteractiveBehavior)
  registerBehavior(InterferenceBehavior)
  registered = true
}
