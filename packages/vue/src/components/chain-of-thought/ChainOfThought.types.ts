import type { VNode } from 'vue'

import type { IconValue } from '@/types/icon'
import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type ChainOfThought = typeof theme

/** One step of a `ChainOfThought` timeline. */
export type ChainOfThoughtStep = {
  /** A short label above the step, such as "Search" or "Plan". */
  label?: string
  /** The step's text. */
  content?: string
  /** An icon shown in place of the dot, such as a search or file icon. */
  icon?: IconValue
  /**
   * The step's progress: `pending` mutes it, `active` shimmers its label, `done` shows it plainly.
   * @defaultValue 'done'
   */
  status?: 'pending' | 'active' | 'done'
  /** Additional classes merged into the step element. */
  class?: ClassValue
}

/** Props of `ChainOfThought`, a collapsible timeline of the assistant's reasoning. */
export type ChainOfThoughtProps = {
  /** The steps of the timeline. */
  steps?: ChainOfThoughtStep[]
  /** The reasoning text, shown as a single step when `steps` is empty. Pass a reasoning part's `text`. */
  text?: string
  /**
   * Shimmers the trigger while the reasoning is still arriving, and measures its duration.
   * @defaultValue false
   */
  streaming?: boolean
  /** How long the reasoning took, in seconds. Measured from the `streaming` prop when omitted. */
  duration?: number
  /** The trigger's text. Defaults to "Thinking…" while streaming, then "Thought for 4 seconds". */
  label?: string
  /** The controlled expanded state. Use with `v-model:open`. */
  open?: boolean
  /** The expanded state when uncontrolled. Defaults to `auto.open && streaming`. */
  defaultOpen?: boolean
  /**
   * Follows the stream: `open` expands the timeline when streaming starts; `closeDelay` collapses it that many
   * milliseconds after streaming ends (`0` keeps it open). A user toggle during streaming cancels the collapse.
   * @defaultValue { open: true, closeDelay: 500 }
   */
  auto?: { open?: boolean; closeDelay?: number }
  /**
   * Keeps the timeline collapsed and its trigger inert.
   * @defaultValue false
   */
  disabled?: boolean
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ChainOfThought>
}

/** Slots of `ChainOfThought`. */
export type ChainOfThoughtSlots = {
  /** Replaces the trigger's text. */
  label?: (props: { streaming: boolean; duration: number | undefined }) => VNode[]
  /** Replaces the timeline. */
  default?: (props: { open: boolean }) => VNode[]
  /** Replaces one step's label. */
  'step-label'?: (props: { step: ChainOfThoughtStep; index: number }) => VNode[]
  /** Replaces one step's content. */
  'step-content'?: (props: { step: ChainOfThoughtStep; index: number }) => VNode[]
}

/** Events emitted by `ChainOfThought`. */
export type ChainOfThoughtEmits = {
  /** Emitted when the expanded state changes. */
  'update:open': [value: boolean]
}
