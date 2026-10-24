import type { VNode } from 'vue'

import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type EmptyState = typeof theme

export type EmptyStateProps = {
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<EmptyState>
}

export type EmptyStateSlots = {
  /** The empty-state content. Defaults to "No results found". */
  default?: () => VNode[]
}
