export const ease = {
  out: 'power3.out',
  inOut: 'power3.inOut',
  expo: 'expo.out',
  soft: [0.22, 1, 0.36, 1] as const,
} as const

export const duration = {
  fast: 0.35,
  base: 0.6,
  slow: 0.9,
  slower: 1.2,
} as const

export const stagger = {
  tight: 0.04,
  base: 0.08,
  loose: 0.12,
} as const
