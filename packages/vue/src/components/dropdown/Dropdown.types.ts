import type { VNode } from 'vue'

import type { KbdKey } from '@/components/kbd/kbdKeys'
import type { PortalTarget } from '@/config'
import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Dropdown = typeof theme

/** The key identifying a `Dropdown` item, emitted by `action` and stored in `v-model`. */
export type DropdownValue = string | number

/** An actionable or selectable entry of a `Dropdown` menu. */
export type DropdownItem = {
  /** Unique key of the item across the whole menu. Emitted by `action` and stored in `v-model`. */
  value: DropdownValue
  /** The item text, shown unless the `#item` / `#item-label` slot is used. */
  label?: string
  /** Secondary text under the label. */
  description?: string
  /** Text used for typeahead. Defaults to `label`. */
  textValue?: string
  /** Whether the item can't be focused, selected or activated. */
  disabled?: boolean
  /** `danger` colours the label (and indicators) for destructive actions. */
  variant?: 'default' | 'danger'
  /** Keyboard shortcut rendered at the end of the item (as `<Kbd variant="light">`). */
  kbd?: { keys?: KbdKey | KbdKey[]; content?: string }
  /** Nested entries: the item becomes a submenu trigger. */
  items?: DropdownEntry[]
  /** Classes merged onto the item element. */
  class?: ClassValue
  /** Extra fields (icons, ...) are passed through to the slots as `item`. */
  [key: string]: unknown
}

/** A labelled group of `Dropdown` items, rendered as a `role="group"` with its own optional selection. */
export type DropdownSection<T extends DropdownItem = DropdownItem> = {
  /** Marks the entry as a section. */
  type: 'section'
  /** Rendered as the section `<header>`, which also labels the group. */
  label?: string
  /** The items of the section. */
  items: T[]
  /**
   * Section-level selection, independent of the rest of the menu. Selected values still live in the Dropdown's `v-model`.
   */
  selectionMode?: 'none' | 'single' | 'multiple'
  /** Indicator for this section's selectable items. @defaultValue 'checkmark' */
  indicator?: 'checkmark' | 'dot' | false
  /** Classes merged onto the section element. */
  class?: ClassValue
}

/** A visual divider between `Dropdown` entries. */
export type DropdownSeparator = {
  /** Marks the entry as a separator. */
  type: 'separator'
}

/** Any entry of the `Dropdown` `items` list: an item, a section or a separator. */
export type DropdownEntry<T extends DropdownItem = DropdownItem> =
  | T
  | DropdownSection<T>
  | DropdownSeparator

/** Props of `Dropdown`, a menu of actions or options that opens from a trigger. */
export type DropdownProps<T extends DropdownItem = DropdownItem> = {
  /**
   * Renders the menu in a portal. `true` portals to `document.body`, a selector string or element is used as the teleport target, and `false` disables portalling.
   * Falls back to `createHareUI({ portal })`, then `true`.
   */
  portal?: PortalTarget
  /** The menu entries: items, `{ type: 'section' }` groups and `{ type: 'separator' }` dividers. */
  items?: DropdownEntry<T>[]
  /** The controlled open state of the menu. Use with `v-model:open`. */
  open?: boolean
  /** The open state when initially rendered. Use when you do not need to control the open state. */
  defaultOpen?: boolean
  /**
   * The selected values (`v-model`). Always an array, as sections can carry their own selection.
   */
  modelValue?: DropdownValue[]
  /** The initially selected values, when uncontrolled. */
  defaultValue?: DropdownValue[]
  /** The type of selection allowed in the menu. @defaultValue 'none' */
  selectionMode?: 'none' | 'single' | 'multiple'
  /**
   * The indicator rendered on selectable items: a checkmark, a dot, or nothing.
   * @defaultValue 'checkmark'
   */
  indicator?: 'checkmark' | 'dot' | false
  /**
   * How the menu opens: on press, or on long press (and `Alt + ArrowDown` / `Alt + ArrowUp`)
   * so the trigger can keep its own press action. @defaultValue 'press'
   */
  trigger?: 'press' | 'longPress'
  /** Disables the trigger. */
  disabled?: boolean
  /** The preferred side of the trigger to render against when open. @defaultValue 'bottom' */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /** The preferred alignment against the trigger. @defaultValue 'start' */
  align?: 'start' | 'center' | 'end'
  /** The distance in pixels from the trigger. @defaultValue 8 */
  sideOffset?: number
  /** Classes merged onto the popover. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Dropdown>
}

/** What every per-item slot of `Dropdown` receives. */
export type DropdownItemSlotProps<T extends DropdownItem = DropdownItem> = {
  /** The item the slot renders. */
  item: T
  /** Whether the item is selected (always `false` outside a selectable group). */
  selected: boolean
  /** Whether the item is disabled. */
  disabled: boolean
}

/** Slots of `Dropdown`. */
export type DropdownSlots<T extends DropdownItem = DropdownItem> = {
  /** The trigger. Merged onto its single root element (`as-child`). */
  default?: () => VNode[]
  /**
   * Content above the menu, inside the popover (e.g. a user card). It renders inside the `role="menu"` element, so
   * keep it to text and decorative images (`alt=""`): a named image there is not an allowed menu child.
   */
  'content-top'?: () => VNode[]
  /** Replaces the whole item content. */
  item?: (props: DropdownItemSlotProps<T>) => VNode[]
  /** Content before the label, such as an icon or avatar. */
  'item-leading'?: (props: DropdownItemSlotProps<T>) => VNode[]
  /** Replaces the item label text. */
  'item-label'?: (props: DropdownItemSlotProps<T>) => VNode[]
  /** Replaces the secondary text under the label. Also links it as the item's description. */
  'item-description'?: (props: DropdownItemSlotProps<T>) => VNode[]
  /** Replaces the keyboard shortcut. */
  'item-trailing'?: (props: DropdownItemSlotProps<T>) => VNode[]
  /** Custom selection indicator content (rendered inside the indicator box). */
  indicator?: (props: DropdownItemSlotProps<T>) => VNode[]
  /** Custom submenu chevron. */
  'submenu-indicator'?: (props: DropdownItemSlotProps<T>) => VNode[]
  /** Replaces a section header's text. */
  'section-label'?: (props: { section: DropdownSection<T> }) => VNode[]
}

/** Events emitted by `Dropdown`. */
export type DropdownEmits = {
  /** Emitted when the menu opens or closes (`v-model:open`). */
  'update:open': [value: boolean]
  /** Emitted when the selected values change (`v-model`). */
  'update:modelValue': [value: DropdownValue[]]
  /** An action item (not a selectable one, not a submenu trigger) was selected. */
  action: [value: DropdownValue]
}
