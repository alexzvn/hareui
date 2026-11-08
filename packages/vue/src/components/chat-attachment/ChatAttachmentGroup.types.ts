import type { VNode } from 'vue'

import type { ChatFilePart } from '@/types/chat'
import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type { ChatAttachmentProps, ChatAttachmentVariant } from './ChatAttachment.types'
import type groupTheme from './groupTheme'

type ChatAttachmentGroup = typeof groupTheme

/** Props of `ChatAttachmentGroup`, a wrapping row of attachments: a message's file parts or the composer's files. */
export type ChatAttachmentGroupProps = {
  /**
   * The attachments, each with the props of a `ChatAttachment`: a `file` or a `part`, or a `name`, `type` and `url`,
   * plus its own `status`, `bytes`, `description` and `icon`. Rendered after `parts` and `files`.
   */
  items?: ChatAttachmentProps[]
  /** `file` parts of a message. */
  parts?: ChatFilePart[]
  /** Picked files, such as the composer's. Rendered after `parts`. */
  files?: File[]
  /** Forces one variant on every attachment. An item's own `variant` wins. */
  variant?: ChatAttachmentVariant
  /**
   * Shows a remove button on each attachment that emits `remove`. An item's own `removable` wins.
   * @defaultValue false
   */
  removable?: boolean
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ChatAttachmentGroup>
}

/** Slots of `ChatAttachmentGroup`. */
export type ChatAttachmentGroupSlots = {
  /** The attachments. Defaults to a `ChatAttachment` per part, file and item. */
  default?: () => VNode[]
}

/** Events emitted by `ChatAttachmentGroup`. */
export type ChatAttachmentGroupEmits = {
  /**
   * Emitted when an attachment's remove button is pressed, with the removed part, file or item. The index counts
   * through `parts`, then `files`, then `items`, so with one list it is the index in that list.
   */
  remove: [index: number, item: ChatFilePart | File | ChatAttachmentProps]
}
