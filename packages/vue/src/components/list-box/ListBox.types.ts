import type { VNode } from 'vue'

import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type ListBox = typeof theme

export type ListBoxValue = string | number

export type ListBoxItem = {
  /** Unique value; bound to `v-model` when selected and passed to `action`. */
  value: ListBoxValue
  /** The item label. */
  label?: string
  /** Help text rendered below the label. */
  description?: string
  /** Text used for type-ahead. Defaults to `label`. */
  textValue?: string
  /** Whether the item is disabled. */
  disabled?: boolean
  /**
   * Visual variant of the item.
   * @defaultValue 'default'
   */
  variant?: 'default' | 'danger'
  /** Additional classes merged into the item element. */
  class?: ClassValue
}

export type ListBoxSection<T extends ListBoxItem = ListBoxItem> = {
  type: 'section'
  /** Section heading, rendered as a `<header>`. */
  label?: string
  items: T[]
}

export type ListBoxSeparator = {
  type: 'separator'
}

export type ListBoxEntry<T extends ListBoxItem = ListBoxItem> =
  | T
  | ListBoxSection<T>
  | ListBoxSeparator

export type ListBoxProps<T extends ListBoxItem = ListBoxItem> = {
  /**
   * Items, sections (`{ type: 'section', label, items }`) and separators (`{ type: 'separator' }`).
   * Extra fields on the items are kept and typed in the item slots.
   */
  items?: ListBoxEntry<T>[]
  /**
   * How many items can be selected. With `'none'` items only emit `action`.
   * @defaultValue 'single'
   */
  selectionMode?: 'none' | 'single' | 'multiple'
  /** The initial selection when uncontrolled (no `v-model`). */
  defaultValue?: ListBoxValue | ListBoxValue[] | null
  /**
   * Whether to render the checkmark indicator in selectable items.
   * @defaultValue true
   */
  indicator?: boolean
  /**
   * Whether the whole list is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether hovering an option with the mouse focuses it, so the keyboard continues from there (RAC
   * `shouldFocusOnHover`, as in Select's popover).
   * @defaultValue false
   */
  highlightOnHover?: boolean
  /**
   * What Escape does: `'clearSelection'` clears a non-empty selection, `'none'` leaves it (and the key) to the
   * surrounding component, e.g. a popover that closes on Escape.
   * @defaultValue 'clearSelection'
   */
  escapeKeyBehavior?: 'clearSelection' | 'none'
  /**
   * Render only the visible rows (Reka `ListboxVirtualizer`). Needs a scrolling root (e.g. `class="h-[400px] overflow-y-auto"`)
   * and flat `items` (sections and separators are skipped). Pass `{ estimateSize, overscan }` to tune.
   * @defaultValue false
   */
  virtualize?: boolean | { estimateSize?: number; overscan?: number }
  /**
   * Async collections (RAC `ListBoxLoadMoreItem`): when set, a sentinel after the last item emits `load-more`
   * whenever it scrolls into view while `loading` is false; while `loading` is true the `#loading` slot is shown there.
   */
  loading?: boolean
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ListBox>
}

export type ListBoxItemSlotProps<T extends ListBoxItem = ListBoxItem> = {
  item: T
  index: number
  selected: boolean
  disabled: boolean
}

export type ListBoxSlots<T extends ListBoxItem = ListBoxItem> = {
  /** Whole content of each item. Replaces leading, label, description, trailing and indicator. */
  item?: (props: ListBoxItemSlotProps<T>) => VNode[]
  /** Content before the item text (avatar, icon). */
  'item-leading'?: (props: ListBoxItemSlotProps<T>) => VNode[]
  /** The label of each item. Replaces `item.label`. */
  'item-label'?: (props: ListBoxItemSlotProps<T>) => VNode[]
  /** The description of each item. Replaces `item.description`. */
  'item-description'?: (props: ListBoxItemSlotProps<T>) => VNode[]
  /** Content after the item text (shortcut, badge). */
  'item-trailing'?: (props: ListBoxItemSlotProps<T>) => VNode[]
  /** Indicator content. Defaults to an animated checkmark. */
  indicator?: (props: ListBoxItemSlotProps<T>) => VNode[]
  /** Section heading. Replaces `section.label`. */
  'section-label'?: (props: { section: ListBoxSection<T> }) => VNode[]
  /** Rendered when `items` is empty. */
  empty?: () => VNode[]
  /** Shown after the last item while `loading` is true (e.g. a Spinner). */
  loading?: () => VNode[]
}

export type ListBoxEmits = {
  /** An item was activated (click, Enter or Space) while `selectionMode` is `'none'`. */
  action: [value: ListBoxValue]
  /** The end of the list scrolled into view while `loading` is false. Fetch the next page. */
  loadMore: []
}

/** Internal: an option row, with a flat running index so item slots get a stable `index` across sections. */
export type ListBoxRow<T extends ListBoxItem = ListBoxItem> = {
  kind: 'item'
  item: T
  index: number
}

/** Internal: a top-level rendered entry: an option row, a section of rows or a separator. */
export type ListBoxBlock<T extends ListBoxItem = ListBoxItem> =
  | ListBoxRow<T>
  | { kind: 'section'; section: ListBoxSection<T>; rows: ListBoxRow<T>[]; key: number }
  | { kind: 'separator'; key: number }

/** Internal: a Reka listbox item, as returned by `ListboxRoot.getItems()`. */
export type ListBoxRekaItem = {
  ref: HTMLElement
  value: unknown
}

/** Internal: the part of Reka's `ListboxRoot` instance ListBox calls. */
export type ListBoxRekaRoot = {
  highlightSelected: () => Promise<void>
  getItems: () => ListBoxRekaItem[]
}
