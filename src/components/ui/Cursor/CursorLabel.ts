import { CURSOR_CONFIG } from './config'
import type { CursorLabelConfig } from './CursorBehavior'

export type CursorLabel = {
  root: HTMLDivElement
  content: HTMLSpanElement
  text: HTMLSpanElement
  icon: HTMLSpanElement
  /** 0-1 presence of the pill. */
  strength: number
  target: number
  /** Natural pill size, measured from the content. */
  width: number
  height: number
  tilt: number
  stretch: number
  hidden: boolean
}

const ARROW_RIGHT_SVG =
  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>'

export function createCursorLabel(parent: HTMLElement): CursorLabel {
  const root = document.createElement('div')
  root.className = 'cursor-glass'
  root.setAttribute('aria-hidden', 'true')

  const content = document.createElement('span')
  content.className = 'cursor-glass__content'

  const text = document.createElement('span')
  text.className = 'glass-pill__text'

  const icon = document.createElement('span')
  icon.className = 'glass-pill__icon'

  content.append(text, icon)
  root.append(content)
  root.style.visibility = 'hidden'
  parent.appendChild(root)

  return {
    root,
    content,
    text,
    icon,
    strength: 0,
    target: 0,
    width: 0,
    height: 0,
    tilt: 0,
    stretch: 0,
    hidden: true,
  }
}

export function showCursorLabel(
  label: CursorLabel,
  config: CursorLabelConfig,
  override: string | null,
): void {
  const value = override ?? config.text
  const iconHtml = config.icon === 'arrow-right' ? ARROW_RIGHT_SVG : ''
  const changed =
    label.text.textContent !== value || label.icon.innerHTML !== iconHtml

  if (changed) {
    label.text.textContent = value
    label.icon.innerHTML = iconHtml
  }
  // Re-measure on content change or when (re)appearing, so late font loads are picked up.
  if (changed || label.target === 0 || label.width === 0) {
    label.width = label.content.offsetWidth
    label.height = label.content.offsetHeight
  }
  label.target = 1
}

export function hideCursorLabel(label: CursorLabel): void {
  label.target = 0
}

/**
 * How much the canvas bubble should shrink. The bubble hands off quickly so
 * the growing pill reads as the same shape, not a second cursor.
 */
export function getLabelCollapse(label: CursorLabel): number {
  return Math.min(1, label.strength * CURSOR_CONFIG.labelHandoff)
}

export function updateCursorLabel(
  label: CursorLabel,
  x: number,
  y: number,
  vx: number,
  vy: number,
  dt: number,
  reducedMotion: boolean,
): void {
  const cfg = CURSOR_CONFIG
  const rate = label.target > label.strength ? cfg.labelShowRate : cfg.labelHideRate
  label.strength += (label.target - label.strength) * (1 - Math.exp(-rate * dt))
  if (Math.abs(label.target - label.strength) < 0.001) {
    label.strength = label.target
  }

  if (label.strength === 0) {
    if (!label.hidden) {
      label.hidden = true
      label.root.style.visibility = 'hidden'
    }
    return
  }
  if (label.hidden) {
    label.hidden = false
    label.root.style.visibility = 'visible'
  }

  const tiltTarget = reducedMotion
    ? 0
    : clamp(vx * cfg.labelTilt, -cfg.labelMaxTilt, cfg.labelMaxTilt)
  const stretchTarget = reducedMotion
    ? 0
    : Math.min(Math.hypot(vx, vy) * cfg.labelStretch, cfg.labelMaxStretch)
  const follow = 1 - Math.exp(-10 * dt)
  label.tilt += (tiltTarget - label.tilt) * follow
  label.stretch += (stretchTarget - label.stretch) * follow

  // Shell morphs from the bubble's circle into the pill: height first, width
  // trailing slightly so it reads as the drop stretching open.
  const s = label.strength
  const bubble = cfg.radius * 2
  const grow = easeInOutCubic(s)
  const growHeight = easeOutCubic(s)
  const width = bubble + (label.width - bubble) * grow
  const height = bubble + (label.height - bubble) * growHeight

  // Text only shows once there is room for it.
  const reveal = clamp((s - 0.45) / 0.55, 0, 1)
  const contentScale = 0.92 + 0.08 * reveal

  label.root.style.width = `${width}px`
  label.root.style.height = `${height}px`
  label.root.style.opacity = String(Math.min(1, s * 4))
  label.content.style.opacity = String(reveal)
  label.content.style.transform = `scale(${contentScale})`
  label.root.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${label.tilt}deg) scale(${1 + label.stretch}, ${1 - label.stretch * 0.5})`
}

export function destroyCursorLabel(label: CursorLabel): void {
  label.root.remove()
}

function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}
