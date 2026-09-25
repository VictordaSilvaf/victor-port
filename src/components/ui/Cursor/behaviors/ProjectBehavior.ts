import type { CursorBehavior } from '../CursorBehavior'

export const PROJECT_CURSOR = 'button[href="#project"]'

/**
 * Project cards: the bubble collapses into a frosted glass pill.
 * The collapse and the pill itself are driven by the engine's label layer.
 */
export const ProjectBehavior: CursorBehavior = {
  id: 'project',
  label: { text: 'Ver projeto', icon: 'arrow-right' },
  apply() {},
}
