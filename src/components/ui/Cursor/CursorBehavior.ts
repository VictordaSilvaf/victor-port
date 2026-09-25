import type { CursorPhysics } from './CursorPhysics'
import type { CursorStateId, CursorStateMachine } from './CursorState'

export type BehaviorContext = {
  physics: CursorPhysics
  state: CursorStateMachine
  time: number
  dt: number
  reducedMotion: boolean
}

export interface CursorBehavior {
  id: CursorStateId
  onEnter?(ctx: BehaviorContext): void
  onExit?(ctx: BehaviorContext): void
  apply(ctx: BehaviorContext): void
}

const registry = new Map<CursorStateId, CursorBehavior>()

export function registerBehavior(behavior: CursorBehavior): void {
  registry.set(behavior.id, behavior)
}

export function getBehavior(id: CursorStateId): CursorBehavior | undefined {
  return registry.get(id)
}

export function resolveBehaviorId(
  dataCursor: string | null,
  isClickable: boolean,
): CursorStateId {
  if (dataCursor && registry.has(dataCursor as CursorStateId)) {
    return dataCursor as CursorStateId
  }
  if (isClickable || dataCursor === 'interactive') {
    return 'interactive'
  }
  return 'default'
}
