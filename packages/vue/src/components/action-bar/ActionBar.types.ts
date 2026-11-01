import type { VNode } from 'vue'

import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type ActionBar = typeof theme

/** Props of `ActionBar`, a floating toolbar fixed to the bottom of the viewport for contextual actions. */
export type ActionBarProps = {
  /** The controlled open state. Bind it to a condition such as `selected.length > 0`. */
  open?: boolean
  /**
   * The open state when it is initially rendered. Use when you do not need to control its open state.
   * @defaultValue false
   */
  defaultOpen?: boolean
  /**
   * Whether the toolbar has a surface background. Without it the bar keeps its rounding and shadow.
   * @defaultValue true
   */
  attached?: boolean
  /**
   * The orientation of the toolbar. Arrow keys follow it.
   * @defaultValue 'horizontal'
   */
  orientation?: ComponentVariants<ActionBar>['orientation']
  /**
   * Accessible label of the toolbar.
   * @defaultValue 'Actions'
   */
  ariaLabel?: string
  /** Additional classes merged into the toolbar (the visible pill). */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ActionBar>
}

/** Events of `ActionBar`. */
export type ActionBarEmits = {
  /** The open state changed, from the `close` slot prop. */
  'update:open': [value: boolean]
}

/** Props of every `ActionBar` slot. */
export type ActionBarSlotProps = {
  /** Classes for text that is visually hidden below 640px, so a button with an icon collapses to icon-only. */
  labelClass: string
  /** Closes the bar (`update:open` with `false`). */
  close: () => void
}

/** Slots of `ActionBar`. */
export type ActionBarSlots = {
  /** The leading section, such as a selection count. A Separator follows it. */
  prefix?: (props: ActionBarSlotProps) => VNode[]
  /** The main actions. */
  default?: (props: ActionBarSlotProps) => VNode[]
  /** The trailing section, such as a button that clears the selection. A Separator precedes it. */
  suffix?: (props: ActionBarSlotProps) => VNode[]
}
