import type { VNode } from 'vue'

import type { IconValue } from '@/types/icon'
import type { LinkBaseProps } from '@/types/link'
import type { ComponentSlots, ComponentUI, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type ListView = typeof theme

/** The resolved slot class functions of a `ListView`. */
export type ListViewUI = ComponentUI<ListView>

/** Value identifying a ListView item; the selection (`v-model`) holds these. */
export type ListViewValue = string | number

/**
 * One row of a `ListView`. With `to` or `href` the row is a link: pressing it (or Enter) follows the link. Extra
 * fields are kept and typed in the item slots.
 */
export type ListViewItem = Omit<LinkBaseProps, 'disabled'> & {
  /** Unique value; held by `v-model` when selected and passed to `action`. */
  value: ListViewValue
  /** The row title. Also the row's accessible name and the text type-ahead matches. */
  label: string
  /** Secondary text below the label. */
  description?: string
  /** The icon before the label: an icon class or a component. */
  icon?: IconValue
  /** Whether the row is skipped by the keyboard and can't be selected or pressed. A link row also drops its `href`. */
  disabled?: boolean
  /**
   * Name of the slots that render this item instead of the `item-*` ones: `#{slot}`, `#{slot}-leading`,
   * `#{slot}-label`, `#{slot}-description` and `#{slot}-action`.
   */
  slot?: string
  /** Additional classes merged into this item's row. */
  class?: ClassValue
}

/** Options of the `virtualize` prop. */
export type ListViewVirtualizeOptions = {
  /**
   * Estimated row height in px; rendered rows are measured.
   * @defaultValue 48
   */
  estimateSize?: number
  /**
   * Number of rows rendered outside the visible area.
   * @defaultValue 5
   */
  overscan?: number
}

/** Props of `ListView`: a single-column list of rows with keyboard navigation, selection and row actions. */
export type ListViewProps<T extends ListViewItem = ListViewItem> = {
  /** The rows to render. */
  items?: T[]
  /**
   * The selected values: an array when `multiple`, else a value or `null`. Use `v-model` to control it.
   */
  modelValue?: ListViewValue | ListViewValue[] | null
  /** The selection on first render when uncontrolled (no `v-model`). */
  defaultValue?: ListViewValue | ListViewValue[] | null
  /**
   * Whether rows can be selected. Each row then shows a checkbox. Without it, rows are only pressed (`action`, links).
   * @defaultValue false
   */
  selectable?: boolean
  /**
   * Whether several rows can be selected at once. Only used with `selectable`.
   * @defaultValue false
   */
  multiple?: boolean
  /**
   * How a press changes the selection: `toggle` adds or removes the row (while nothing is selected, a press on a row
   * with an action runs it); `replace` selects the row alone, Ctrl/Cmd adds or removes it, Shift selects a range,
   * arrow keys move the selection, and a double click or Enter runs the action. A touch tap with `replace` runs the
   * action, else adds or removes the row.
   * @defaultValue 'toggle'
   */
  selectionBehavior?: 'toggle' | 'replace'
  /**
   * `primary` sets the rows on a grey card; `secondary` has no card, and selected rows get an accent tint.
   * @defaultValue 'primary'
   */
  variant?: ComponentVariants<ListView>['variant']
  /**
   * Render only the rows in view, for long lists. Give the list a fixed height (e.g. `class="h-96"`); it then scrolls
   * itself. Pass `{ estimateSize, overscan }` to tune. Whether to virtualize is read once, when the list mounts.
   * @defaultValue false
   */
  virtualize?: boolean | ListViewVirtualizeOptions
  /** The accessible name of the list. Set it, or `aria-labelledby`, on every ListView. */
  ariaLabel?: string
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ListView>
}

/** Events emitted by `ListView`. */
export type ListViewEmits = {
  /** Emitted when the selection changes: an array when `multiple`, else a value or `null`. */
  'update:modelValue': [value: ListViewValue | ListViewValue[] | null]
  /**
   * Emitted with the row's value when a row is actioned: a press while nothing is selected (or always without
   * `selectable`), Enter, or a double click (a tap on a touch screen) with `selectionBehavior: 'replace'`.
   * Listening to it makes rows actionable; link rows are actionable either way.
   */
  action: [value: ListViewValue]
}

/** Props passed to every item slot. */
export type ListViewItemSlotProps<T extends ListViewItem = ListViewItem> = {
  /** The item being rendered. */
  item: T
  /** The item's position in `items`, starting at 0. */
  index: number
  /** Whether the item is selected. */
  selected: boolean
  /** Whether the item is disabled. */
  disabled: boolean
  /** The resolved slot class functions, to style custom content like the default rows. */
  ui: ListViewUI
}

type ListViewItemSlot<T extends ListViewItem> = (props: ListViewItemSlotProps<T>) => VNode[]

/** Slots of `ListView`. Items with a `slot` field use `#{slot}`, `#{slot}-leading`, … instead of the `item-*` slots. */
export type ListViewSlots<T extends ListViewItem = ListViewItem> = {
  /** Replaces the row content after the checkbox: icon, label and description. */
  item?: ListViewItemSlot<T>
  /** Replaces the icon before the label (an avatar, a file icon). */
  'item-leading'?: ListViewItemSlot<T>
  /** Replaces the label text. */
  'item-label'?: ListViewItemSlot<T>
  /** Replaces the description text. */
  'item-description'?: ListViewItemSlot<T>
  /**
   * Content at the end of the row (buttons, a menu). Its controls are left out of the Tab order, so the list stays one
   * tab stop; Left and Right arrows move focus into and out of it.
   */
  'item-action'?: ListViewItemSlot<T>
  /** Shown when `items` is empty. Defaults to "No results found". */
  empty?: () => VNode[]
  /** The slots named by items' `slot` field. */
  [slot: string]: ListViewItemSlot<T> | undefined
}
