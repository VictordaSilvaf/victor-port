import {
  getBehavior,
  resolveBehaviorId,
  type CursorBehavior,
} from './CursorBehavior'
import type { CursorStateId } from './CursorState'

export type InteractionSample = {
  stateId: CursorStateId
  element: Element | null
  dataCursor: string | null
  isClickable: boolean
}

/** Opt-in loud state — add `cursor-interference` to any element. */
const INTERFERENCE_SELECTOR =
  '.cursor-interference, [data-cursor="interference"]'

const CLICKABLE_SELECTOR =
  'a, button, [role="button"], [data-cursor], input[type="submit"], input[type="button"], input[type="checkbox"], input[type="radio"], label[for], select, summary'

const NATIVE_CLICKABLE =
  'a, button, [role="button"], input[type="submit"], input[type="button"], input[type="checkbox"], input[type="radio"], select, summary'

const EMPTY_SAMPLE: InteractionSample = {
  stateId: 'default',
  element: null,
  dataCursor: null,
  isClickable: false,
}

export function sampleInteraction(x: number, y: number): InteractionSample {
  const el = document.elementFromPoint(x, y)
  if (!el) return EMPTY_SAMPLE

  const interference = el.closest(INTERFERENCE_SELECTOR)
  if (interference) {
    return {
      stateId: 'interference',
      element: interference,
      dataCursor: interference.getAttribute('data-cursor'),
      isClickable: interference.matches(NATIVE_CLICKABLE),
    }
  }

  const target = el.closest(CLICKABLE_SELECTOR)
  if (!target) {
    return {
      stateId: 'default',
      element: el,
      dataCursor: null,
      isClickable: false,
    }
  }

  const dataCursor = target.getAttribute('data-cursor')
  const isClickable = target.matches(NATIVE_CLICKABLE) || dataCursor !== null

  return {
    stateId: resolveBehaviorId(dataCursor, isClickable),
    element: target,
    dataCursor,
    isClickable,
  }
}

export function applyBehaviorTransition(
  previous: CursorBehavior | undefined,
  next: CursorBehavior | undefined,
  ctx: Parameters<CursorBehavior['apply']>[0],
): void {
  if (previous && previous !== next) {
    previous.onExit?.(ctx)
  }
  if (next && next !== previous) {
    next.onEnter?.(ctx)
  }
}

export function getActiveBehavior(
  id: CursorStateId,
): CursorBehavior | undefined {
  return getBehavior(id)
}
