import type { VNode } from 'vue'

import type { ListViewItem, ListViewProps } from '@/components/list-view/ListView.types'
import type { IconValue } from '@/types/icon'
import type { ComponentSlots, ComponentUI, ComponentVariants } from '@/types/tv'

import type theme from './theme'

type ChatListView = typeof theme

/** The resolved slot class functions of `ChatListView`. */
export type ChatListViewUI = ComponentUI<ChatListView>

/**
 * A chat thread. `label` is the thread's title and `description` its preview (usually the last message); the other
 * fields work as in `ListView`, including `to` / `href` to open the thread.
 */
export type ChatListViewItem = ListViewItem & {
  /** Short text at the end of the row, such as when the thread was last updated. */
  meta?: string
}

/**
 * Props of `ChatListView`: rows of chat threads for a sidebar or a conversation picker. With `selectable`, `v-model`
 * holds the open thread: a press selects the row and tints it, without a checkbox (`multiple` brings the checkboxes
 * back, for bulk actions). Pressing the open thread again keeps it open.
 */
export type ChatListViewProps<T extends ChatListViewItem = ChatListViewItem> = Omit<
  ListViewProps<T>,
  'variant' | 'selectionBehavior' | 'ui'
> & {
  /**
   * How a press changes the selection: `replace` selects the row alone (Ctrl/Cmd adds or removes it with
   * `multiple`), and a double click or Enter runs the action; `toggle` adds or removes the row.
   * @defaultValue 'replace'
   */
  selectionBehavior?: ListViewProps<T>['selectionBehavior']
  /**
   * `comfortable` shows the preview and the meta; `compact` keeps only the icon and the title.
   * @defaultValue 'comfortable'
   */
  density?: ComponentVariants<ChatListView>['density']
  /**
   * The icon of every thread; an item's own `icon` wins over it. `false` shows only items' own icons.
   * @defaultValue the gravity-ui `comment` icon
   */
  icon?: IconValue | false
  /**
   * The ListView look: `secondary` has no card around the rows, `primary` sets them on a card.
   * @defaultValue 'secondary'
   */
  variant?: ListViewProps<T>['variant']
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ChatListView>
}

/** Events emitted by `ChatListView`. */
export type ChatListViewEmits = {
  /**
   * Emitted when the selection changes: an array when `multiple`, else a value. With single selection it never
   * changes back to `null` from a press.
   */
  'update:modelValue': [value: ChatListViewItem['value'] | ChatListViewItem['value'][] | null]
  /**
   * Emitted with the thread's value when a row is actioned (pressed, or Enter). Listening to it makes rows
   * actionable; rows with `to` / `href` are actionable either way.
   */
  action: [value: ChatListViewItem['value']]
}

/** Props passed to every item slot. */
export type ChatListViewItemSlotProps<T extends ChatListViewItem = ChatListViewItem> = {
  /** The thread being rendered. */
  item: T
  /** The thread's position in `items`, starting at 0. */
  index: number
  /** Whether the thread is selected. */
  selected: boolean
  /** Whether the thread is disabled. */
  disabled: boolean
  /** The resolved slot class functions, to style custom content like the default rows. */
  ui: ChatListViewUI
}

type ChatListViewItemSlot<T extends ChatListViewItem> = (
  props: ChatListViewItemSlotProps<T>,
) => VNode[]

/** Slots of `ChatListView`. Items with a `slot` field use `#{slot}`, `#{slot}-leading`, … instead of `item-*`. */
export type ChatListViewSlots<T extends ChatListViewItem = ChatListViewItem> = {
  /** Replaces the row content: icon, title, preview and meta. */
  item?: ChatListViewItemSlot<T>
  /** Replaces the icon before the title (an avatar, a status dot). */
  'item-leading'?: ChatListViewItemSlot<T>
  /** Replaces the title text. */
  'item-label'?: ChatListViewItemSlot<T>
  /** Replaces the preview text. Not shown with `density="compact"`. */
  'item-description'?: ChatListViewItemSlot<T>
  /** Replaces the meta text. Not shown with `density="compact"`. */
  'item-meta'?: ChatListViewItemSlot<T>
  /** Content at the end of the row (a menu to rename or delete the thread), as in `ListView`. */
  'item-action'?: ChatListViewItemSlot<T>
  /** Shown when `items` is empty. */
  empty?: () => VNode[]
  /** The slots named by items' `slot` field. */
  [slot: string]: ChatListViewItemSlot<T> | undefined
}
