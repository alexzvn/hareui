import type { VNode } from 'vue'

import type { ChatFilePart } from '@/types/chat'
import type { IconValue } from '@/types/icon'
import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type ChatAttachment = typeof theme

/** How an attachment renders: a square thumbnail (`media`) or a card with an icon, the name and the size (`file`). */
export type ChatAttachmentVariant = 'media' | 'file'

/** Where an attachment is in its upload. */
export type ChatAttachmentStatus = 'idle' | 'uploading' | 'error'

/** Props of `ChatAttachment`, the preview of a file attached to a message or to the composer. */
export type ChatAttachmentProps = {
  /** A picked `File`. Its name, type and size fill the preview; images and videos preview through an object URL. */
  file?: File
  /** A `file` part of a message. Its file name, media type and URL fill the preview. */
  part?: ChatFilePart
  /** The file's name. Defaults to the file's or the part's. */
  name?: string
  /** The file's media type, e.g. `image/png`. Defaults to the file's or the part's. */
  type?: string
  /** The preview's URL. Defaults to the part's URL, or an object URL of `file`. */
  url?: string
  /** The file's size in bytes, for parts. Defaults to the file's size. */
  bytes?: number
  /** The line under the name. Defaults to the formatted size, or the file's extension. */
  description?: string
  /**
   * The icon of a `file` attachment, or of a `media` one without a preview. Defaults to an icon for the file's format:
   * PDF, document, spreadsheet, archive, code, text, image, video, audio, or a plain file.
   */
  icon?: IconValue
  /**
   * Where the file is in its upload. `uploading` swaps a `file` attachment's icon for a spinner and shimmers its name,
   * or dims a `media` thumbnail behind a spinner. `error` marks the attachment as failed.
   * @defaultValue 'idle'
   */
  status?: ChatAttachmentStatus
  /** Defaults to `media` for images and videos with a preview, `file` otherwise. */
  variant?: ChatAttachmentVariant
  /**
   * Shows a remove button that emits `remove`.
   * @defaultValue false
   */
  removable?: boolean
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ChatAttachment>
}

/** Slots of `ChatAttachment`. */
export type ChatAttachmentSlots = {
  /** Replaces the thumbnail or the file icon. */
  preview?: (props: {
    url: string | undefined
    type: string
    variant: ChatAttachmentVariant
  }) => VNode[]
  /** Replaces the name and the size. */
  info?: (props: { name: string; description: string }) => VNode[]
}

/** Events emitted by `ChatAttachment`. */
export type ChatAttachmentEmits = {
  /** Emitted when the remove button is pressed. */
  remove: [event: MouseEvent]
}
