import type { VNode } from 'vue'

import type {
  DropdownEntry,
  DropdownItem,
  DropdownItemSlotProps,
  DropdownSection,
  DropdownSeparator,
  DropdownValue,
} from '@/components/dropdown/Dropdown.types'
import type { PortalTarget } from '@/config'
import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type ContextMenu = typeof theme

/** The key identifying a `ContextMenu` item, emitted by `action` and stored in `v-model`. */
export type ContextMenuValue = DropdownValue

/** An actionable or selectable entry of a `ContextMenu`. Same shape as a `Dropdown` item. */
export type ContextMenuItem = DropdownItem

/** A labelled group of `ContextMenu` items, rendered as a `role="group"` with its own optional selection. */
export type ContextMenuSection<T extends ContextMenuItem = ContextMenuItem> = DropdownSection<T>

/** A visual divider between `ContextMenu` entries. */
export type ContextMenuSeparator = DropdownSeparator

/** Any entry of the `ContextMenu` `items` list: an item, a section or a separator. */
export type ContextMenuEntry<T extends ContextMenuItem = ContextMenuItem> = DropdownEntry<T>

/** Positioning of the menu against the pointer (or the trigger when opened without a pointer). */
export type ContextMenuContentOptions = {
  /** The distance in pixels from the pointer. @defaultValue 2 */
  sideOffset?: number
  /** An offset in pixels from the `start` alignment. @defaultValue 0 */
  alignOffset?: number
  /** Whether the menu flips and shifts to stay inside the viewport. @defaultValue true */
  avoidCollisions?: boolean
  /** The distance in pixels kept from the viewport edges. @defaultValue 12 */
  collisionPadding?: number
}

/** Props of `ContextMenu`, a menu of actions or options that opens on right click or long press. */
export type ContextMenuProps<T extends ContextMenuItem = ContextMenuItem> = {
  /**
   * The menu entries: items, `{ type: 'section' }` groups and `{ type: 'separator' }` dividers. An array of
   * arrays renders each inner array as a group, with a separator between groups.
   */
  items?: ContextMenuEntry<T>[] | ContextMenuEntry<T>[][]
  /**
   * Renders the menu in a portal. `true` portals to `document.body`, a selector string or element is used as the teleport target, and `false` disables portalling.
   * Falls back to `createHareUI({ portal })`, then `true`.
   */
  portal?: PortalTarget
  /** The controlled open state of the menu. Use with `v-model:open`. */
  open?: boolean
  /** The open state when initially rendered. Use when you do not need to control the open state. */
  defaultOpen?: boolean
  /**
   * The selected values (`v-model`). Always an array, as sections can carry their own selection.
   */
  modelValue?: ContextMenuValue[]
  /** The initially selected values, when uncontrolled. */
  defaultValue?: ContextMenuValue[]
  /** The type of selection allowed in the menu. @defaultValue 'none' */
  selectionMode?: 'none' | 'single' | 'multiple'
  /**
   * The indicator rendered on selectable items: a checkmark, a dot, or nothing.
   * @defaultValue 'checkmark'
   */
  indicator?: 'checkmark' | 'dot' | false
  /** Keeps the menu from opening: right click shows the browser's own context menu instead. */
  disabled?: boolean
  /**
   * Whether the rest of the page is inert while the menu is open (no hovering, clicking or focusing
   * outside it). @defaultValue true
   */
  modal?: boolean
  /** How long, in milliseconds, a touch or pen press is held before the menu opens. @defaultValue 700 */
  pressOpenDelay?: number
  /** Positioning of the menu. */
  content?: ContextMenuContentOptions
  /** Classes merged onto the trigger area. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ContextMenu>
}

/** What every per-item slot of `ContextMenu` receives. */
export type ContextMenuItemSlotProps<T extends ContextMenuItem = ContextMenuItem> =
  DropdownItemSlotProps<T>

/** Slots of `ContextMenu`. */
export type ContextMenuSlots<T extends ContextMenuItem = ContextMenuItem> = {
  /** The area that opens the menu on right click or long press. */
  default?: () => VNode[]
  /**
   * Content above the items, inside the popover of the root menu. It renders inside the `role="menu"` element, so
   * keep it to text and decorative images (`alt=""`).
   */
  'content-top'?: () => VNode[]
  /** Content below the items, inside the popover of the root menu. Same constraints as `#content-top`. */
  'content-bottom'?: () => VNode[]
  /** Replaces the whole item content. */
  item?: (props: ContextMenuItemSlotProps<T>) => VNode[]
  /** Content before the label, such as an icon or avatar. */
  'item-leading'?: (props: ContextMenuItemSlotProps<T>) => VNode[]
  /** Replaces the item label text. */
  'item-label'?: (props: ContextMenuItemSlotProps<T>) => VNode[]
  /** Replaces the secondary text under the label. Also links it as the item's description. */
  'item-description'?: (props: ContextMenuItemSlotProps<T>) => VNode[]
  /** Replaces the keyboard shortcut. */
  'item-trailing'?: (props: ContextMenuItemSlotProps<T>) => VNode[]
  /** Custom selection indicator content (rendered inside the indicator box). */
  indicator?: (props: ContextMenuItemSlotProps<T>) => VNode[]
  /** Custom submenu chevron. */
  'submenu-indicator'?: (props: ContextMenuItemSlotProps<T>) => VNode[]
  /** Replaces a section header's text. */
  'section-label'?: (props: { section: ContextMenuSection<T> }) => VNode[]
}

/** Events emitted by `ContextMenu`. */
export type ContextMenuEmits = {
  /** Emitted when the menu opens or closes (`v-model:open`). */
  'update:open': [value: boolean]
  /** Emitted when the selected values change (`v-model`). */
  'update:modelValue': [value: ContextMenuValue[]]
  /** An action item (not a selectable one, not a submenu trigger) was selected. */
  action: [value: ContextMenuValue]
}
