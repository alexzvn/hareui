import type { VNode } from 'vue'

import type { ChatStatus } from '@/types/chat'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type PromptInput = typeof theme

/** A prompt waiting in the queue until the running response finishes. */
export type PromptInputQueueItem = {
  /** Key of the prompt in the list. Defaults to its index. */
  id?: string
  /** The prompt's text. */
  text: string
  /** The files attached to the prompt. */
  files?: File[]
}

/** Props of `PromptInput`, the message composer of a chat: autosizing text, attachments, a send button and a queue. */
export type PromptInputProps = {
  /** Placeholder of the empty input. Defaults to the locale's. */
  placeholder?: string
  /**
   * State of the chat request, as the AI SDK's `useChat().status`. While `submitted` or `streaming` the send button
   * stops the response, or queues the prompt when `v-model:queue` is bound.
   * @defaultValue 'ready'
   */
  status?: ChatStatus
  /** Whether the input, its attachments and its buttons are disabled. */
  disabled?: boolean
  /**
   * Whether Enter submits and Shift+Enter adds a line. When `false`, Enter adds a line and Ctrl/Cmd+Enter submits.
   * @defaultValue true
   */
  submitOnEnter?: boolean
  /** The accepted MIME types and extensions of attachments, as in `<input accept>`. */
  accept?: string
  /**
   * Whether several files can be attached.
   * @defaultValue true
   */
  multiple?: boolean
  /**
   * Height the input grows to before it scrolls: pixels, or any CSS length such as `'50vh'`.
   * @defaultValue 240
   */
  maxHeight?: number | string
  /** Whether the input takes focus when mounted. */
  autofocus?: boolean
  /**
   * `stacked`: the input above a toolbar. `compact`: one row that turns stacked once the text wraps or files are
   * attached. `inline`: one row whose input grows in place.
   * @defaultValue 'stacked'
   */
  layout?: ComponentVariants<PromptInput>['layout']
  /**
   * `primary`: field background, for page backgrounds. `secondary`: default background, for surfaces.
   * @defaultValue 'primary'
   */
  variant?: ComponentVariants<PromptInput>['variant']
  /**
   * Minimum height of the input and the room kept for the toolbar.
   * @defaultValue 'md'
   */
  size?: ComponentVariants<PromptInput>['size']
  /**
   * `hover`: the queued prompts' actions show on hover or focus where the device can hover. `always`: they always show.
   * @defaultValue 'hover'
   */
  queueActions?: ComponentVariants<PromptInput>['queueActions']
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<PromptInput>
}

/** Events emitted by `PromptInput`. */
export type PromptInputEmits = {
  /**
   * Emitted when the prompt is sent (Enter or the send button) while `status` is `ready` or `error`, with its text and
   * files. Clear `v-model` and `v-model:files` yourself once the message is on its way.
   */
  submit: [text: string, files: File[]]
  /** Emitted when the send button is pressed while a response runs and nothing would be queued. */
  stop: []
  /** Emitted when a queued prompt's send now button is pressed, after it moves to the front of the queue. */
  send: [item: PromptInputQueueItem]
}

/**
 * Props of the `queue` slot. Its helpers take the prompt's index in `queue`, as the default list renders it.
 */
export type PromptInputQueueSlotProps = {
  /** The queued prompts. */
  queue: PromptInputQueueItem[]
  /** Moves the prompt at an index to the front of the queue and emits `send`. */
  send: (index: number) => void
  /** Moves the prompt at an index back into the input, ahead of the current text. */
  edit: (index: number) => void
  /** Removes the prompt at an index from the queue. */
  remove: (index: number) => void
}

/** Props of the `body` slot, which replaces the textarea. */
export type PromptInputBodySlotProps = {
  /** Sends the prompt, or queues it while a response runs, as Enter does. */
  submit: () => void
  /** The resolved placeholder. */
  placeholder: string
  /** Whether the input is disabled. */
  disabled: boolean
  /**
   * Input attributes given to `PromptInput` (`aria-label`, `maxlength`, ...). Bind them on the slot's input with
   * `v-bind="inputAttrs"`, or they're lost.
   */
  inputAttrs: Record<string, unknown>
}

/** Slots of `PromptInput`. */
export type PromptInputSlots = {
  /** Content above the attachments and the input, inside the composer. */
  header?: () => VNode[]
  /** Replaces the list of queued prompts above the composer. Rendered while the queue has prompts. */
  queue?: (props: PromptInputQueueSlotProps) => VNode[]
  /** Replaces the attached files. Rendered while files are attached. */
  files?: (props: {
    /** The attached files. */
    files: File[]
    /** Removes the file at an index. */
    remove: (index: number) => void
  }) => VNode[]
  /** Replaces the textarea, e.g. with a rich-text editor. Its wrapper takes the `textarea` slot's classes. */
  body?: (props: PromptInputBodySlotProps) => VNode[]
  /** Actions at the start of the toolbar. Defaults to an attach button when `v-model:files` is bound. */
  leading?: (props: {
    /** Opens the file picker. */
    open: () => void
  }) => VNode[]
  /** Actions at the end of the toolbar, before the send button. */
  trailing?: () => VNode[]
  /** Replaces the send button. */
  submit?: (props: {
    /** The state the button shows: `status`, or `ready` while a press would queue the prompt. */
    status: ChatStatus
    /** Whether the default send button would be disabled. */
    disabled: boolean
    /** Sends the prompt, or queues it while a response runs. */
    submit: () => void
    /** Emits `stop`. */
    stop: () => void
  }) => VNode[]
  /** Text under the composer, such as a disclaimer. */
  footer?: () => VNode[]
}

/** What a template ref on `PromptInput` exposes. */
export type PromptInputExposed = {
  /** Focuses the textarea, or the editable element of the `body` slot. */
  focus: () => void
  /** Opens the file picker. Does nothing without `v-model:files`. */
  open: () => void
  /** Sends the prompt, or queues it while a response runs, as Enter does. */
  submit: () => void
}
