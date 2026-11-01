import type { PrimitiveProps, TreeItemSelectEvent, TreeItemToggleEvent } from 'reka-ui'
import type { VNode } from 'vue'

import type { IconValue } from '@/types/icon'
import type { ComponentSlots, ComponentUI, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Tree = typeof theme

/** The resolved slot class functions of a `Tree`. */
export type TreeUI = ComponentUI<Tree>

/**
 * The event of a selection. `detail` holds the `originalEvent` (click or key press), the item as `value`, and its
 * `isExpanded` and `isSelected` state; `preventDefault()` cancels the selection.
 */
export type TreeSelectEvent<T extends TreeItem = TreeItem> = TreeItemSelectEvent<T>

/**
 * The event of an expand or collapse. `detail` holds the `originalEvent` (click or key press), the item as `value`,
 * and its `isExpanded` and `isSelected` state; `preventDefault()` keeps the item as it is.
 */
export type TreeToggleEvent<T extends TreeItem = TreeItem> = TreeItemToggleEvent<T>

/** One row of a `Tree`: a file, or a folder when it has `children`. */
export type TreeItem = {
  /** The row text, read with the tree's `labelKey`. It is also the item's key unless `getKey` is set. */
  label?: string
  /** The icon before the label: an icon class or a component. Folders without one show `collapsedIcon` / `expandedIcon`. */
  icon?: IconValue
  /** An icon at the end of the row: an icon class or a component. */
  trailingIcon?: IconValue
  /** Whether the item starts expanded. Ignored when the tree's `defaultExpanded` is set. */
  defaultExpanded?: boolean
  /** Whether the item can't be selected, expanded or focused. */
  disabled?: boolean
  /** Name of the slots that render this item instead of the `item-*` ones: `#{slot}`, `#{slot}-leading`, `#{slot}-label`, `#{slot}-trailing` and `#{slot}-wrapper`. */
  slot?: string
  /** The nested items. An empty array still renders a folder, without an expand chevron. */
  children?: TreeItem[]
  /** Called when the item is expanded or collapsed. `event.preventDefault()` keeps its current state. Replaces the tree's `toggle` event for this item. */
  onToggle?: (event: TreeToggleEvent) => void
  /** Called when the item is selected. `event.preventDefault()` cancels the selection. Replaces the tree's `select` event for this item. */
  onSelect?: (event: TreeSelectEvent) => void
  /** Additional classes merged into this item's row. */
  class?: ClassValue
  /** Per-slot class overrides for this item, applied over the tree's `ui`. */
  ui?: Omit<ComponentSlots<Tree>, 'root' | 'empty'>
  /** Extra fields are passed through to the slots as `item`. */
  [key: string]: unknown
}

/** Options of the `virtualize` prop. */
export type TreeVirtualizeOptions = {
  /**
   * Number of rows rendered outside the visible area.
   * @defaultValue 12
   */
  overscan?: number
  /**
   * Estimated row height in px, or a function returning it for a row index. Defaults to the row height of `size`
   * (20px for `sm`, 28px for `md`, 36px for `lg`).
   */
  estimateSize?: number | ((index: number) => number)
}

/** Props of `Tree`: a file explorer style hierarchy with expandable folders, selection and keyboard navigation. */
export type TreeProps<T extends TreeItem = TreeItem, M extends boolean = false> = {
  /**
   * The element or component to render as. An object sets the element per part (`{ root, link }`); `link` is the row.
   * @defaultValue { root: 'ul', link: 'button' }
   */
  as?: PrimitiveProps['as'] | { root?: PrimitiveProps['as']; link?: PrimitiveProps['as'] }
  /** The items to render. */
  items?: T[]
  /**
   * The colour of selected rows.
   * @defaultValue 'default'
   */
  color?: ComponentVariants<Tree>['color']
  /**
   * The row density: padding, font size, icon size and indent per level.
   * @defaultValue 'md'
   */
  size?: ComponentVariants<Tree>['size']
  /**
   * Whether to draw a vertical guide line for each ancestor level: always (`true`), never (`false`) or while the
   * pointer is over the tree (`'hover'`).
   * @defaultValue true
   */
  showGuideLines?: boolean | 'hover'
  /** Returns a unique key for an item. Defaults to its label (`labelKey`). */
  getKey?: (item: T) => string
  /**
   * The item field holding the label. A dotted path reads a nested field.
   * @defaultValue 'label'
   */
  labelKey?: string
  /** The chevron of folders, rotated 90° while expanded. Defaults to the gravity-ui `chevron-right` icon. */
  indicatorIcon?: IconValue
  /** The icon of expanded folders without their own `icon`. Defaults to the gravity-ui `folder-open` icon. */
  expandedIcon?: IconValue
  /** The icon of collapsed folders without their own `icon`. Defaults to the gravity-ui `folder` icon. */
  collapsedIcon?: IconValue
  /** The selected item (or items with `multiple`). Use `v-model` to control it. */
  modelValue?: M extends true ? T[] : T
  /** The item(s) selected on first render (uncontrolled). */
  defaultValue?: M extends true ? T[] : T
  /**
   * Whether several items can be selected.
   * @defaultValue false
   */
  multiple?: M & boolean
  /** The keys (`getKey`) of the expanded items. Use `v-model:expanded` to control them. */
  expanded?: string[]
  /** The keys of the items expanded on first render (uncontrolled). Defaults to the items with `defaultExpanded`. */
  defaultExpanded?: string[]
  /**
   * How clicks change a multiple selection: `toggle` adds or removes the item, `replace` selects it alone (hold
   * Ctrl/Cmd to add or remove it, Shift to select the visible rows from the last clicked one).
   * @defaultValue 'toggle'
   */
  selectionBehavior?: 'toggle' | 'replace'
  /**
   * Whether selecting a folder selects all of its descendants. Requires `multiple`.
   * @defaultValue false
   */
  propagateSelect?: boolean
  /**
   * Whether selecting every child selects their folder, and deselecting one deselects it. Requires `multiple`.
   * @defaultValue false
   */
  bubbleSelect?: boolean
  /**
   * Whether each row shows a checkbox before its chevron. Checking it selects the row, and a folder with some of its
   * descendants selected shows a dash with `propagateSelect` or `bubbleSelect`. Use with `multiple`.
   * @defaultValue false
   */
  checkbox?: boolean
  /**
   * Whether the whole tree is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether arrow key navigation wraps from the last row to the first and back.
   * @defaultValue false
   */
  loop?: boolean
  /**
   * Whether children are rendered inside their parent's list (`ul[role=group]`), which animates expand and collapse.
   * `false` renders every visible row as a sibling. The look is the same either way. Ignored with `virtualize`.
   * @defaultValue true
   */
  nested?: boolean
  /**
   * Whether to render only the rows in view, for large trees. The tree needs a fixed height and renders flat
   * (`nested` is ignored). An object configures the virtualizer.
   * @defaultValue false
   */
  virtualize?: boolean | TreeVirtualizeOptions
  /** The text shown when `items` is empty. Nothing is shown without it or the `#empty` slot. */
  empty?: string
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Tree>
}

/** Events emitted by `Tree`. */
export type TreeEmits<T extends TreeItem = TreeItem, M extends boolean = false> = {
  /** Emitted when the selection changes. */
  'update:modelValue': [value: M extends true ? T[] : T]
  /** Emitted when items are expanded or collapsed, with the keys of every expanded item. */
  'update:expanded': [value: string[]]
  /** Emitted before an item is selected. `event.preventDefault()` cancels the selection. Not emitted for items with their own `onSelect`. */
  select: [event: TreeSelectEvent<T>, item: T]
  /** Emitted before an item is expanded or collapsed. `event.preventDefault()` keeps its state. Not emitted for items with their own `onToggle`. */
  toggle: [event: TreeToggleEvent<T>, item: T]
}

/** Props passed to every item slot. */
export type TreeItemSlotProps<T extends TreeItem = TreeItem> = {
  /** The item being rendered. */
  item: T
  /** The item's position among its siblings, starting at 0. */
  index: number
  /** The item's depth, starting at 1. */
  level: number
  /** Whether the item is expanded. */
  expanded: boolean
  /** Whether the item is selected. */
  selected: boolean
  /** Whether some but not all descendants are selected, with `multiple` and `bubbleSelect` or `propagateSelect`. */
  indeterminate: boolean | undefined
  /** Selects or deselects the item, without emitting `select`. */
  select: () => void
  /** Expands or collapses the item, without emitting `toggle`. */
  toggle: () => void
  /** The resolved slot class functions, to style custom content like the default rows. */
  ui: TreeUI
}

type TreeItemSlot<T extends TreeItem> = (props: TreeItemSlotProps<T>) => VNode[]

/** Slots of `Tree`. Items with a `slot` field use `#{slot}`, `#{slot}-leading`, … instead of the `item-*` slots. */
export type TreeSlots<T extends TreeItem = TreeItem> = {
  /** Replaces the whole row element, including the checkbox, chevron and guide lines. Bind `ui.link()` to keep the row look. */
  'item-wrapper'?: TreeItemSlot<T>
  /** Replaces the row content after the chevron: icon, label and trailing part. */
  item?: TreeItemSlot<T>
  /** Replaces the icon before the label. */
  'item-leading'?: TreeItemSlot<T>
  /** Replaces the label text. */
  'item-label'?: TreeItemSlot<T>
  /** Content at the end of the row, replacing the item's `trailingIcon`. */
  'item-trailing'?: TreeItemSlot<T>
  /** Replaces the `empty` text shown when `items` is empty. */
  empty?: () => VNode[]
  /** The slots named by items' `slot` field. */
  [slot: string]: TreeItemSlot<T> | undefined
}
