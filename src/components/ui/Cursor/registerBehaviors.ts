import { registerBehavior, registerBehaviorAlias } from './CursorBehavior'
import { DefaultBehavior } from './behaviors/DefaultBehavior'
import { InteractiveBehavior } from './behaviors/InteractiveBehavior'
import { InterferenceBehavior } from './behaviors/InterferenceBehavior'
import { PROJECT_CURSOR, ProjectBehavior } from './behaviors/ProjectBehavior'

let registered = false

/** Idempotent registration of built-in behaviors. */
export function registerBuiltInBehaviors(): void {
  if (registered) return
  registerBehavior(DefaultBehavior)
  registerBehavior(InteractiveBehavior)
  registerBehavior(InterferenceBehavior)
  registerBehavior(ProjectBehavior)
  registerBehaviorAlias(PROJECT_CURSOR, 'project')
  registerBehaviorAlias('see-project', 'project')
  registered = true
}
