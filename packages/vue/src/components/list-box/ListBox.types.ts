import type { VNode } from 'vue'

import type { IconValue } from '@/types/icon'
import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type ListBox = typeof theme

/** Value identifying a ListBox item; the selection (`v-model`) holds these. */
export type ListBoxValue = string | number

/** One selectable option of a ListBox. Extra fields are kept and typed in the item slots. */
export type ListBoxItem = {
  /** Unique value; bound to `v-model` when selected and passed to `action`. */
  value: ListBoxValue
  /** The item label. */
  label?: string
  /** Icon shown before the label (decorative, `aria-hidden`), unless `#item-leading` is used. */
  icon?: IconValue
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

/** A labelled group of items (`{ type: 'section', label, items }`), rendered as an ARIA `group`. */
export type ListBoxSection<T extends ListBoxItem = ListBoxItem> = {
  /** Marks the entry as a section. */
  type: 'section'
  /** Section heading, rendered as a `<header>`. */
  label?: string
  /** The options of the section. */
  items: T[]
}

/** A visual divider between items or sections (`{ type: 'separator' }`). */
export type ListBoxSeparator = {
  /** Marks the entry as a separator. */
  type: 'separator'
}

/** An entry of ListBox `items`: an option, a section of options or a separator. */
export type ListBoxEntry<T extends ListBoxItem = ListBoxItem> =
  | T
  | ListBoxSection<T>
  | ListBoxSeparator

/** Props for `ListBox`, a list of options that can be selected, single or multiple, or activated. */
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

/** Props passed to the ListBox item slots. */
export type ListBoxItemSlotProps<T extends ListBoxItem = ListBoxItem> = {
  /** The item being rendered. */
  item: T
  /** Position of the item among all options, counted across sections. */
  index: number
  /** Whether the item is selected. */
  selected: boolean
  /** Whether the item is disabled, by itself or because the whole list is. */
  disabled: boolean
}

/** Slots for `ListBox`: item content (whole or per part), section headings, and empty/loading states. */
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

/** Events emitted by `ListBox` (besides `update:modelValue`). */
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
