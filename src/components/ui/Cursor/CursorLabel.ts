import { CURSOR_CONFIG } from './config'
import type { CursorLabelConfig } from './CursorBehavior'

export type CursorLabel = {
  root: HTMLDivElement
  text: HTMLSpanElement
  icon: HTMLSpanElement
  /** 0-1 presence of the pill; the bubble collapses by the same amount. */
  strength: number
  target: number
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

  const text = document.createElement('span')
  text.className = 'glass-pill__text'

  const icon = document.createElement('span')
  icon.className = 'glass-pill__icon'

  root.append(text, icon)
  root.style.visibility = 'hidden'
  parent.appendChild(root)

  return {
    root,
    text,
    icon,
    strength: 0,
    target: 0,
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
  if (label.text.textContent !== value) label.text.textContent = value
  label.icon.innerHTML = config.icon === 'arrow-right' ? ARROW_RIGHT_SVG : ''
  label.target = 1
}

export function hideCursorLabel(label: CursorLabel): void {
  label.target = 0
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

  // Overshoot slightly on the way in so the pill "pops" out of the bubble.
  const s = label.strength
  const scale = label.target === 1 ? easeOutBack(s) : s
  const sx = scale * (1 + label.stretch)
  const sy = scale * (1 - label.stretch * 0.5)

  label.root.style.opacity = String(Math.min(1, s * 1.6))
  label.root.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${label.tilt}deg) scale(${sx}, ${sy})`
}

export function destroyCursorLabel(label: CursorLabel): void {
  label.root.remove()
}

function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value
}

function easeOutBack(t: number): number {
  const c1 = 1.4
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}
