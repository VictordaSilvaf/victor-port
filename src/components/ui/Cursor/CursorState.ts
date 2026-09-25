export type CursorStateId =
  | 'default'
  | 'interactive'
  | 'interference'
  | 'project'
  | 'hover'
  | 'view'
  | 'magnetic'
  | 'drag'
  | 'custom'

export type CursorStateMachine = {
  current: CursorStateId
  previous: CursorStateId
  /** 0-1 energy of the active non-default state. */
  interactionStrength: number
  /** Value the strength lerps toward. */
  interactionTarget: number
}

export function createCursorState(
  initial: CursorStateId = 'default',
): CursorStateMachine {
  return {
    current: initial,
    previous: initial,
    interactionStrength: 0,
    interactionTarget: 0,
  }
}

export function setCursorState(
  state: CursorStateMachine,
  next: CursorStateId,
): boolean {
  if (state.current === next) return false
  state.previous = state.current
  state.current = next
  state.interactionTarget = next === 'default' ? 0 : 1
  return true
}

export function updateInteractionStrength(
  state: CursorStateMachine,
  lerp: number,
): void {
  state.interactionStrength +=
    (state.interactionTarget - state.interactionStrength) * lerp
  if (Math.abs(state.interactionStrength - state.interactionTarget) < 0.001) {
    state.interactionStrength = state.interactionTarget
  }
}
