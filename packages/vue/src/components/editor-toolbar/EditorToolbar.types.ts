import type { BubbleMenuPluginProps } from '@tiptap/extension-bubble-menu'
import type { FloatingMenuPluginProps } from '@tiptap/extension-floating-menu'
import type { Editor as TiptapEditor } from '@tiptap/vue-3'
import type { PrimitiveProps } from 'reka-ui'
import type { Component, VNode } from 'vue'

import type { ButtonProps } from '@/components/button/Button.types'
import type {
  DropdownItem,
  DropdownProps,
  DropdownSection,
  DropdownSeparator,
} from '@/components/dropdown'
import type { EditorCustomHandlers, EditorItem } from '@/components/editor/Editor.types'
import type { ToggleButtonProps } from '@/components/toggle-button/ToggleButton.types'
import type { TooltipProps } from '@/components/tooltip/Tooltip.types'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type EditorToolbar = typeof theme

/** Fields every toolbar button shares, with or without an editor command. */
export type EditorToolbarButtonBase = {
  /** Visible text next to the icon. Without it the button is icon-only. */
  label?: string
  /** Icon component. Command items without one get a built-in icon for their kind. */
  icon?: Component
  /**
   * Tooltip text, or the tooltip's props. Command items get their command name by default; `false`
   * hides it.
   */
  tooltip?: string | TooltipProps | false
  /** Accessible name; defaults to `label`, then the tooltip text. */
  'aria-label'?: string
  /** Name of the slot that renders this item instead of `#item` (e.g. `'link'` → `#link`). */
  slot?: string
  /**
   * Button look. Toggle commands (marks, headings, lists) use the toggle-button variants, the others
   * the button variants.
   * @defaultValue 'ghost' for toggles, 'tertiary' for the others
   */
  variant?: ButtonProps['variant'] | ToggleButtonProps['variant']
  /** Disables the item (command items are also disabled when their command can't run). */
  disabled?: boolean
  /** Shows the item pressed, for items without a command. */
  active?: boolean
  /** Runs on click, for items without a command and for dropdown triggers. */
  onClick?: (event: MouseEvent) => void
  /** Additional classes of the button. */
  class?: ClassValue
}

/** A button that runs an editor command. */
export type EditorToolbarCommandItem<H extends EditorCustomHandlers = EditorCustomHandlers> =
  EditorToolbarButtonBase & EditorItem<H>

/** A dropdown menu entry: a command (labelled by its kind unless `label` is set), a plain action, a section or a separator. */
export type EditorToolbarDropdownChildItem<H extends EditorCustomHandlers = EditorCustomHandlers> =
  | (Omit<EditorToolbarDropdownActionItem, 'onSelect' | 'label'> & {
      /** Item text. Defaults to the command kind's label. */
      label?: string
    } & EditorItem<H>)
  | EditorToolbarDropdownActionItem
  | DropdownSection<EditorToolbarDropdownMenuItem>
  | DropdownSeparator

/** A dropdown menu entry without an editor command. */
export type EditorToolbarDropdownActionItem = {
  /** Item text. */
  label: string
  /** Secondary text under the label. */
  description?: string
  /** Icon component. Command items without one get a built-in icon for their kind. */
  icon?: Component
  /** Disables the entry. */
  disabled?: boolean
  /** Keyboard shortcut shown at the end of the row. */
  kbd?: DropdownItem['kbd']
  /** Runs when the entry is chosen. */
  onSelect?: () => void
}

/** A dropdown entry as the menu renders it (the toolbar fills in `value`). */
export type EditorToolbarDropdownMenuItem = EditorToolbarDropdownActionItem & {
  /** Generated key of the entry. */
  value: string
  /** The command the entry runs, when it has one. */
  command?: EditorItem
}

/** A button that opens a menu of commands, e.g. a heading or alignment picker. */
export type EditorToolbarDropdownItem<H extends EditorCustomHandlers = EditorCustomHandlers> =
  EditorToolbarButtonBase & {
    /**
     * The menu entries. Nested arrays are groups split by separators. The trigger shows the icon of
     * the active entry, then its own `icon`, then the first entry's.
     */
    items: EditorToolbarDropdownChildItem<H>[] | EditorToolbarDropdownChildItem<H>[][]
    /** Props of the menu (placement, portal). */
    dropdown?: Pick<DropdownProps, 'side' | 'align' | 'sideOffset' | 'portal' | 'ui'>
  }

/** An entry of `items`. */
export type EditorToolbarItem<H extends EditorCustomHandlers = EditorCustomHandlers> =
  | EditorToolbarButtonBase
  | EditorToolbarCommandItem<H>
  | EditorToolbarDropdownItem<H>

/** Props of `EditorToolbar`: groups of command buttons and menus acting on an editor. */
export type EditorToolbarProps<H extends EditorCustomHandlers = EditorCustomHandlers> = {
  /**
   * The element or component the toolbar renders as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps['as']
  /** The editor the items act on: the `editor` prop of the `Editor` slots. */
  editor: TiptapEditor
  /** The buttons. Nested arrays are groups split by separators. */
  items?: EditorToolbarItem<H>[] | EditorToolbarItem<H>[][]
  /**
   * `fixed`: a row in place. `bubble`: floats over the selected text. `floating`: floats beside an
   * empty line.
   * @defaultValue 'fixed'
   */
  layout?: ComponentVariants<EditorToolbar>['layout']
  /**
   * Size of the buttons.
   * @defaultValue 'sm'
   */
  size?: ButtonProps['size']
  /** Decides when the bubble or floating toolbar shows. Defaults to a non-empty text selection (bubble) or an empty line (floating). */
  shouldShow?: BubbleMenuPluginProps['shouldShow'] | FloatingMenuPluginProps['shouldShow']
  /**
   * Positioning of the bubble or floating toolbar.
   * @defaultValue { offset: 8, shift: { padding: 8 } }
   */
  options?: BubbleMenuPluginProps['options']
  /** Milliseconds the bubble toolbar waits after a selection change before it moves. */
  updateDelay?: number
  /** Milliseconds the bubble or floating toolbar waits after a resize before it moves. */
  resizeDelay?: number
  /** Element the bubble or floating toolbar is appended to. */
  appendTo?: BubbleMenuPluginProps['appendTo']
  /** Plugin key of the bubble or floating toolbar, needed to show several of the same layout. */
  pluginKey?: BubbleMenuPluginProps['pluginKey']
  /** Additional classes merged into the toolbar element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<EditorToolbar>
}

/** Props of the `#item` slot and of custom item slots. */
export type EditorToolbarItemSlotProps<H extends EditorCustomHandlers = EditorCustomHandlers> = {
  /** The item. */
  item: EditorToolbarItem<H>
  /** Index of the item in its group. */
  index: number
  /** Whether an item is active (pressed) at the selection. */
  isActive: (item: EditorToolbarItem<H>) => boolean
  /** Whether an item is disabled at the selection. */
  isDisabled: (item: EditorToolbarItem<H>) => boolean
  /** Runs an item as a click would. */
  onClick: (event: MouseEvent, item: EditorToolbarItem<H>) => void
}

/** Slots of `EditorToolbar`. */
export type EditorToolbarSlots<H extends EditorCustomHandlers = EditorCustomHandlers> = {
  /** Replaces the rendering of every item without its own `slot`. */
  item?: (props: EditorToolbarItemSlotProps<H>) => VNode[]
} & {
  /** Renders the items whose `slot` is this name. */
  [name: string]: ((props: EditorToolbarItemSlotProps<H>) => VNode[]) | undefined
}
