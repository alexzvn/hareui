import type { VNode } from 'vue'

import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type EmptyState = typeof theme

/** Props of `EmptyState`, the placeholder shown when a collection such as a `Table` has no items. */
export type EmptyStateProps = {
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<EmptyState>
}

/** Slots of `EmptyState`. */
export type EmptyStateSlots = {
  /** The empty-state content. Defaults to "No results found". */
  default?: () => VNode[]
}
