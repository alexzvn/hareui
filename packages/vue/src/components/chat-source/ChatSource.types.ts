import type { VNode } from 'vue'

import type { ChatSourceDocumentPart, ChatSourceUrlPart } from '@/types/chat'
import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type ChatSource = typeof theme

/** What a source points at: a web page (`url`) or an uploaded document (`document`). */
export type ChatSourceType = 'url' | 'document'

/** A source part of a message: a cited web page or document. */
export type ChatSourcePart = ChatSourceUrlPart | ChatSourceDocumentPart

/** A source described by hand, for sources that don't come from message parts. */
export type ChatSourceItem = {
  /** The cited page. Makes the source a link. */
  href?: string
  /** The display title. Defaults to the page's domain. */
  title?: string
  /** A short excerpt shown in the hover preview. */
  description?: string
  /** The favicon shown before the title and in the preview. Defaults to the domain's first letter. */
  favicon?: string
  /** Defaults to `url` when `href` is set, `document` otherwise. */
  type?: ChatSourceType
}

/** Props of `ChatSource`, an inline citation chip with a hover preview. */
export type ChatSourceProps = ChatSourceItem & {
  /** A `source-url` or `source-document` part. Its URL, title and type fill the chip; the props above override them. */
  part?: ChatSourcePart
  /**
   * Shows a hover preview with the favicon, the domain, the title and the description. Defaults to on for URL sources
   * with a `description`; set it to show the preview without one, or to `false` to turn it off.
   */
  preview?: boolean
  /**
   * Where the link opens.
   * @defaultValue '_blank'
   */
  target?: string
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ChatSource>
}

/** Slots of `ChatSource`. */
export type ChatSourceSlots = {
  /** Replaces the favicon or document icon. */
  icon?: () => VNode[]
  /** Replaces the chip's title. */
  default?: () => VNode[]
  /** Replaces the hover preview's content. */
  preview?: () => VNode[]
}
