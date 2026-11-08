import type { VNode } from 'vue'

import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type { ChatSourceItem, ChatSourcePart } from './ChatSource.types'
import type sourcesTheme from './sourcesTheme'

type ChatSources = typeof sourcesTheme

/** Props of `ChatSources`, a collapsible list of the sources an answer cites. */
export type ChatSourcesProps = {
  /** The sources: `source-url` / `source-document` parts of a message, or hand-written items. */
  sources?: (ChatSourcePart | ChatSourceItem)[]
  /** The trigger's text. Defaults to the number of sources, such as "3 sources". */
  label?: string
  /**
   * The most favicons stacked in the trigger, before its text.
   * @defaultValue 0
   */
  maxFavicons?: number
  /**
   * Where the source links open.
   * @defaultValue '_blank'
   */
  target?: string
  /** The controlled expanded state. Use with `v-model:open`. */
  open?: boolean
  /**
   * The expanded state when uncontrolled.
   * @defaultValue false
   */
  defaultOpen?: boolean
  /**
   * Keeps the list collapsed and its trigger inert.
   * @defaultValue false
   */
  disabled?: boolean
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ChatSources>
}

/** Slots of `ChatSources`. */
export type ChatSourcesSlots = {
  /** Replaces the trigger's content (favicons and text). */
  label?: (props: { count: number }) => VNode[]
  /** Replaces the list. */
  default?: (props: { open: boolean }) => VNode[]
  /** Replaces one source's chip. */
  source?: (props: { source: ChatSourcePart | ChatSourceItem; index: number }) => VNode[]
}

/** Events emitted by `ChatSources`. */
export type ChatSourcesEmits = {
  /** Emitted when the expanded state changes. */
  'update:open': [value: boolean]
}
