import type { VNode } from 'vue'

import type { ChatToolPart } from '@/types/chat'
import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type groupTheme from './groupTheme'

type ChatToolGroup = typeof groupTheme

/** Props of `ChatToolGroup`, a collapsible group that folds several tool calls behind one trigger. */
export type ChatToolGroupProps = {
  /** The tool call parts, one `ChatTool` each. Use the default slot instead to render the calls yourself. */
  parts?: ChatToolPart[]
  /** The trigger's text. Defaults to the number of `parts`, such as "3 tool calls". */
  label?: string
  /** The controlled expanded state. Use with `v-model:open`. */
  open?: boolean
  /**
   * The expanded state when uncontrolled.
   * @defaultValue false
   */
  defaultOpen?: boolean
  /**
   * Keeps the group collapsed and its trigger inert.
   * @defaultValue false
   */
  disabled?: boolean
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ChatToolGroup>
}

/** Slots of `ChatToolGroup`. */
export type ChatToolGroupSlots = {
  /** Replaces the trigger's text. */
  label?: (props: { count: number; running: boolean }) => VNode[]
  /** The calls. Defaults to a `ChatTool` per part. */
  default?: (props: { open: boolean }) => VNode[]
}

/** Events emitted by `ChatToolGroup`. */
export type ChatToolGroupEmits = {
  /** Emitted when the expanded state changes. */
  'update:open': [value: boolean]
  /** Emitted when the approve action of one of the `parts` is pressed. */
  approve: [part: ChatToolPart]
  /** Emitted when the deny action of one of the `parts` is pressed. */
  deny: [part: ChatToolPart]
}
