import type { CursorBehavior } from '../CursorBehavior'

export const DefaultBehavior: CursorBehavior = {
  id: 'default',
  apply() {
    // No extra forces — pure spring blob.
  },
}
