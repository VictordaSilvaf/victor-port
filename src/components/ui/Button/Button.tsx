import {
  Button as ShadcnButton,
} from '@/components/ui/button'
import type { ComponentProps } from 'react'

export type ButtonProps = ComponentProps<typeof ShadcnButton>

export function Button(props: ButtonProps) {
  return <ShadcnButton {...props} />
}
