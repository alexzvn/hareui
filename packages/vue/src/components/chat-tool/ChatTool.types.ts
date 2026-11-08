import type { VNode } from 'vue'

import type { ChatToolPart, ChatToolState } from '@/types/chat'
import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type ChatTool = typeof theme

/** Props of `ChatTool`, a collapsible card for one tool call: its state, input, output, error and approval. */
export type ChatToolProps = {
  /** The tool call part of a message. Its name, state, input, output and error fill the card; the props below override them. */
  part?: ChatToolPart
  /** The tool's name. Defaults to the part's `toolName`, or its `type` without the `tool-` prefix. */
  toolName?: string
  /**
   * Where the call is in its lifecycle. Defaults to the part's `state`.
   * @defaultValue 'output-available'
   */
  state?: ChatToolState
  /**
   * The arguments the model passed, shown as JSON. A string shows as it is: pass the partial JSON text while the
   * call is `input-streaming`, so the arguments appear as they arrive. Defaults to the part's `input`.
   */
  input?: unknown
  /** The tool's result, shown as JSON. Defaults to the part's `output`. */
  output?: unknown
  /** The error shown in the `output-error` state. Defaults to the part's `errorText`. */
  errorText?: string
  /** The text before the tool's name. Defaults to a label for the state, such as "Used tool:". */
  label?: string
  /** Muted text after the tool's name, such as a duration or a short summary. */
  suffix?: string
  /** The controlled expanded state. Use with `v-model:open`. */
  open?: boolean
  /**
   * The expanded state when uncontrolled. Defaults to open while the call waits for approval.
   * @defaultValue false
   */
  defaultOpen?: boolean
  /**
   * Keeps the card collapsed and its trigger inert.
   * @defaultValue false
   */
  disabled?: boolean
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ChatTool>
}

/** Slot props shared by the `ChatTool` slots. */
export type ChatToolSlotProps = {
  /** The tool's resolved name. */
  name: string
  /** The call's resolved state. */
  state: ChatToolState
}

/** Slots of `ChatTool`. */
export type ChatToolSlots = {
  /** Replaces the status icon. */
  icon?: (props: ChatToolSlotProps) => VNode[]
  /** Replaces the trigger's text (the state label, the name and the suffix). */
  label?: (props: ChatToolSlotProps) => VNode[]
  /** Replaces the whole expanded body. */
  default?: (props: ChatToolSlotProps & { open: boolean }) => VNode[]
  /** Replaces the input block. */
  input?: (props: ChatToolSlotProps & { input: unknown }) => VNode[]
  /** Replaces the output block. */
  output?: (props: ChatToolSlotProps & { output: unknown }) => VNode[]
  /** Replaces the error block. */
  error?: (props: ChatToolSlotProps & { errorText: string | undefined }) => VNode[]
  /** Replaces the approval actions shown in the `approval-requested` state. */
  approval?: (props: ChatToolSlotProps & { approve: () => void; deny: () => void }) => VNode[]
}

/** Events emitted by `ChatTool`. */
export type ChatToolEmits = {
  /** Emitted when the expanded state changes. */
  'update:open': [value: boolean]
  /** Emitted when the approve action is pressed in the `approval-requested` state, with the part's `toolCallId`. */
  approve: [toolCallId: string | undefined]
  /** Emitted when the deny action is pressed in the `approval-requested` state, with the part's `toolCallId`. */
  deny: [toolCallId: string | undefined]
}
