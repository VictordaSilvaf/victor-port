import type { CursorPhysics } from './CursorPhysics'
import type { CursorStateId, CursorStateMachine } from './CursorState'

export type BehaviorContext = {
  physics: CursorPhysics
  state: CursorStateMachine
  time: number
  dt: number
  reducedMotion: boolean
}

export type CursorLabelConfig = {
  /** Default text; the hovered element can override it with `data-cursor-label`. */
  text: string
  icon?: 'arrow-right'
}

export interface CursorBehavior {
  id: CursorStateId
  /** When set, the bubble morphs into a glass pill showing this label. */
  label?: CursorLabelConfig
  onEnter?(ctx: BehaviorContext): void
  onExit?(ctx: BehaviorContext): void
  apply(ctx: BehaviorContext): void
}

const registry = new Map<CursorStateId, CursorBehavior>()

/** Extra `data-cursor` values that map onto a registered state. */
const aliases = new Map<string, CursorStateId>()

export function registerBehavior(behavior: CursorBehavior): void {
  registry.set(behavior.id, behavior)
}

export function registerBehaviorAlias(value: string, id: CursorStateId): void {
  aliases.set(value, id)
}

export function getBehavior(id: CursorStateId): CursorBehavior | undefined {
  return registry.get(id)
}

export function resolveBehaviorId(
  dataCursor: string | null,
  isClickable: boolean,
): CursorStateId {
  if (dataCursor) {
    const alias = aliases.get(dataCursor)
    if (alias && registry.has(alias)) return alias
    if (registry.has(dataCursor as CursorStateId)) {
      return dataCursor as CursorStateId
    }
  }
  if (isClickable || dataCursor === 'interactive') {
    return 'interactive'
  }
  return 'default'
}
