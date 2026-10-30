import type { FuseResult, IFuseOptions } from 'fuse.js'
import type { AcceptableValue, PrimitiveProps } from 'reka-ui'
import type { Component, InputHTMLAttributes, VNode } from 'vue'

import type { AvatarProps } from '@/components/avatar/Avatar.types'
import type { BadgeProps } from '@/components/badge/Badge.types'
import type { ButtonProps } from '@/components/button/Button.types'
import type { CloseButtonProps } from '@/components/close-button/CloseButton.types'
import type { ComponentSlots, ComponentUI, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type CommandPalette = typeof theme

/** An icon: a class string (icon-font / CSS-mask utilities such as `i-lucide-search`) or a component. */
export type CommandPaletteIcon = string | Component

/** The theme slots an item can restyle through its own `ui`. */
type CommandPaletteItemSlot =
  | 'item'
  | 'itemLeadingIcon'
  | 'itemLeadingAvatar'
  | 'itemLeadingChip'
  | 'itemWrapper'
  | 'itemLabel'
  | 'itemLabelPrefix'
  | 'itemLabelBase'
  | 'itemLabelSuffix'
  | 'itemDescription'
  | 'itemTrailing'
  | 'itemTrailingIcon'
  | 'itemTrailingHighlightedIcon'
  | 'itemTrailingKbds'
  | 'itemTrailingKbd'

/** One command of a group. Extra fields are kept and passed to the slots as `item`. */
export type CommandPaletteItem = {
  /** Text shown before the label, in the regular text color. */
  prefix?: string
  /** The item text. Searched by default. */
  label?: string
  /** Text shown after the label, muted. Searched by default. */
  suffix?: string
  /** A second, muted line under the label. Searched by default. */
  description?: string
  /** Leading icon: a class string or a component. */
  icon?: CommandPaletteIcon
  /** Leading avatar, shown when there is no `icon`. */
  avatar?: AvatarProps
  /**
   * A leading status dot (a `Badge`), shown when there is neither `icon` nor `avatar`.
   * `{ color: 'accent', variant: 'primary', size: 'sm' }`{lang="ts-type"}
   */
  chip?: boolean | BadgeProps
  /**
   * Keyboard shortcut shown on the right, one `Kbd` per entry. Entries naming a modifier or special
   * key (`'command'`, `'shift'`, `'ctrl'`, `'option'`, `'enter'`, ...) render as its symbol, the rest as text.
   */
  kbds?: string[]
  /** Whether the item shows a resting highlight, e.g. the current page or theme. */
  active?: boolean
  /** Whether the item shows a spinner in place of its leading icon. */
  loading?: boolean
  /** Whether the item can't be highlighted or selected. */
  disabled?: boolean
  /** Name of the slots (`#<slot>`, `#<slot>-leading`, `#<slot>-label`, `#<slot>-description`, `#<slot>-trailing`) that render this item. */
  slot?: string
  /** The input placeholder while this item's `children` are shown. */
  placeholder?: string
  /** Nested commands: selecting the item shows them in place of the groups, with a back button. */
  children?: CommandPaletteItem[]
  /** Called when the item is selected (clicked, or `Enter` while highlighted). Not called for items with `children`. */
  onSelect?: (event: Event) => void
  /** The URL to link to: the item renders as an anchor. */
  href?: string
  /** A route location (vue-router) or URL. Goes through `RouterLink` when the app has it. */
  to?: string | Record<string, unknown>
  /** The element or component to render the link as, e.g. a router link component. */
  as?: string | Component
  /** The link `target`. */
  target?: '_blank' | '_parent' | '_self' | '_top' | (string & {}) | null
  /** The link `rel`. Defaults to `noopener noreferrer` for `_blank`. */
  rel?: string | null
  /** The link `download` attribute. */
  download?: boolean | string
  /** Treat the link as external: never route it through `RouterLink`. */
  external?: boolean
  /** With a router, replace the history entry instead of pushing. */
  replace?: boolean
  /** Additional classes merged into the item element. */
  class?: ClassValue
  /** Per-slot class overrides for this item. */
  ui?: Partial<Pick<ComponentSlots<CommandPalette>, CommandPaletteItemSlot>>
  /** Extra fields are passed through to the slots as `item`. */
  [key: string]: unknown
}

/** A titled list of items. Groups are shown in order, each under its `label`. */
export type CommandPaletteGroup<T extends CommandPaletteItem = CommandPaletteItem> = {
  /** Unique id of the group. Groups without one are skipped. */
  id: string
  /** The group heading. */
  label?: string
  /** Name of the slots that render this group's items (`#<slot>`, `#<slot>-leading`, ...) and heading (`#<slot>-group-label`). */
  slot?: string
  /** The items of the group. */
  items?: T[]
  /**
   * Whether to show the items as they are, without searching them. Use it for results you filter
   * yourself (fetched from a server, for example).
   * @defaultValue false
   */
  ignoreFilter?: boolean
  /**
   * Filters the group's items again after the search. Receives the search term and the matching items. A method
   * signature, so a group of a narrower item type still fits where a `CommandPaletteGroup` is expected.
   */
  postFilter?(searchTerm: string, items: T[]): T[]
  /** An icon shown at the end of the highlighted item. */
  highlightedIcon?: CommandPaletteIcon
}

/** Search options, passed to Fuse.js. */
export type CommandPaletteFuseOptions<T extends CommandPaletteItem = CommandPaletteItem> = {
  /**
   * The Fuse.js options. Set `includeMatches: true` to highlight the matched characters.
   * @defaultValue { ignoreLocation: true, threshold: 0.1, keys: [labelKey, descriptionKey, 'suffix'] }
   */
  fuseOptions?: IFuseOptions<T>
  /**
   * The maximum number of items shown per group.
   * @defaultValue 12
   */
  resultLimit?: number
  /**
   * Whether every item is shown while the search term is empty.
   * @defaultValue true
   */
  matchAllWhenSearchEmpty?: boolean
}

/** Virtualization options, for long lists. */
export type CommandPaletteVirtualizeOptions = {
  /**
   * Number of items rendered outside the visible area.
   * @defaultValue 12
   */
  overscan?: number
  /**
   * Estimated height of each item in px, or a function returning it for an index.
   * @defaultValue 36 (52 with a description) at `md`
   */
  estimateSize?: number | ((index: number) => number)
}

/** An item as it reaches the slots: the original fields plus its group id and search matches. */
export type CommandPaletteResolvedItem<T extends CommandPaletteItem = CommandPaletteItem> = T & {
  /** The id of the group the item was found in. */
  group?: string
  /** What the search matched, when `fuseOptions.includeMatches` is set. */
  matches?: FuseResult<T>['matches']
}

/**
 * Props of `CommandPalette`: a search input over grouped commands, with fuzzy search, keyboard navigation,
 * selection and nested lists. It renders inline; put it in a `Modal` or `Popover` for an overlay.
 */
export type CommandPaletteProps<T extends CommandPaletteItem = CommandPaletteItem> = {
  /**
   * The element or component to render as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps['as']
  /**
   * The width of the palette: `sm` (384px), `md` (512px) or `lg` (576px), each with its own height cap. Rows
   * keep the same density at every size.
   * @defaultValue 'md'
   */
  size?: ComponentVariants<CommandPalette>['size']
  /** The selected value(s). Use with `v-model`. Each value is the item itself (without `children`, `onSelect` and the search data) or its `valueKey` field. */
  modelValue?: AcceptableValue | AcceptableValue[]
  /** The value(s) selected initially. Use when you do not need to control the selection. */
  defaultValue?: AcceptableValue | AcceptableValue[]
  /**
   * Whether several items can be selected.
   * @defaultValue false
   */
  multiple?: boolean
  /**
   * Whether the whole palette is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether hovering an item highlights it.
   * @defaultValue true
   */
  highlightOnHover?: boolean
  /**
   * Whether keyboard navigation wraps from the last item to the first and back.
   * @defaultValue false
   */
  loop?: boolean
  /**
   * How selecting an item behaves: `toggle` adds or removes it, `replace` replaces the selection.
   * @defaultValue 'toggle'
   */
  selectionBehavior?: 'toggle' | 'replace'
  /** Compares values by this field, or with this function, instead of deeply. */
  by?: string | ((a: AcceptableValue, b: AcceptableValue) => boolean)
  /**
   * Whether the input shows a spinner, e.g. while results load. An object sets its `icon` (also used by loading
   * items); it defaults to the `Spinner` component.
   * @defaultValue false
   */
  loading?: boolean | { icon?: CommandPaletteIcon }
  /**
   * The icon at the start of the input. `false` hides it.
   * @defaultValue the gravity-ui `magnifier` icon
   */
  icon?: CommandPaletteIcon | false
  /** An icon at the end of the input. */
  trailingIcon?: CommandPaletteIcon
  /**
   * The icon shown at the end of selected items.
   * @defaultValue the gravity-ui `check` icon
   */
  selectedIcon?: CommandPaletteIcon
  /**
   * The icon shown at the end of items with children.
   * @defaultValue the gravity-ui `chevron-right` icon
   */
  childrenIcon?: CommandPaletteIcon
  /**
   * The input placeholder.
   * @defaultValue 'Type a command or search...'
   */
  placeholder?: string
  /**
   * Whether the input takes focus when the palette mounts.
   * @defaultValue true
   */
  autofocus?: boolean
  /**
   * Shows a close button at the end of the input (inside a Modal, for example). It emits `update:open` with
   * `false`. An object is passed to the `CloseButton`; its `icon` replaces the close button's own icon.
   * @defaultValue false
   */
  close?: boolean | (CloseButtonProps & { icon?: CommandPaletteIcon })
  /**
   * Shows a back button at the start of the input while nested children are shown. An object is passed to the `Button`;
   * its `icon` defaults to the gravity-ui `arrow-left` icon.
   * `{ variant: 'ghost', size: 'sm', iconOnly: true }`{lang="ts-type"}
   * @defaultValue true
   */
  back?: boolean | (ButtonProps & { icon?: CommandPaletteIcon })
  /**
   * Shows the search input. `false` hides it; an object is bound to the `<input>` as attributes. Use the palette's
   * own `disabled` prop to disable it.
   * @defaultValue true
   */
  input?: boolean | Omit<InputHTMLAttributes, 'disabled'>
  /** The groups of items. */
  groups?: CommandPaletteGroup<T>[]
  /** Search options. See `CommandPaletteFuseOptions`. */
  fuse?: CommandPaletteFuseOptions<T>
  /**
   * Renders only the visible items, for long lists. All groups are then shown as one list, without headings.
   * @defaultValue false
   */
  virtualize?: boolean | CommandPaletteVirtualizeOptions
  /** The item field used as the selected value, instead of the item itself. Dot paths (`meta.id`) work. */
  valueKey?: string
  /**
   * The item field shown and searched as the label.
   * @defaultValue 'label'
   */
  labelKey?: string
  /**
   * The item field shown and searched as the description.
   * @defaultValue 'description'
   */
  descriptionKey?: string
  /**
   * Whether groups keep the order of `groups` while searching. Otherwise the groups with the best matches come first.
   * @defaultValue false
   */
  preserveGroupOrder?: boolean
  /**
   * Whether items are shown as they are, without searching them (each group's `ignoreFilter` wins).
   * @defaultValue false
   */
  ignoreFilter?: boolean
  /**
   * Delay in ms between typing and searching. The input stays responsive while large lists wait for typing to settle.
   * @defaultValue 0
   */
  searchDelay?: number
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<CommandPalette>
}

/** Events of `CommandPalette`. */
export type CommandPaletteEmits = {
  /** Emitted when the selection changes. */
  'update:modelValue': [value: AcceptableValue | AcceptableValue[]]
  /** Emitted when the search term changes. Use with `v-model:search-term`. */
  'update:searchTerm': [value: string]
  /** Emitted when the highlighted item changes, with its element and value. */
  highlight: [payload: { ref: HTMLElement; value: AcceptableValue } | undefined]
  /** Emitted when the list receives focus. Can be prevented. */
  entryFocus: [event: CustomEvent]
  /** Emitted when the pointer leaves the list. */
  leave: [event: Event]
  /** Emitted with `false` when the close button is pressed. */
  'update:open': [value: boolean]
}

/** Props of the item slots. */
export type CommandPaletteItemSlotProps<T extends CommandPaletteItem = CommandPaletteItem> = {
  /** The item. */
  item: CommandPaletteResolvedItem<T>
  /** Its index in its group (in the whole list when virtualized). */
  index: number
  /** The resolved slot classes. */
  ui: ComponentUI<CommandPalette>
}

/** Props of the group heading slots. */
export type CommandPaletteGroupSlotProps<G extends CommandPaletteGroup = CommandPaletteGroup> = {
  /** The group. */
  group: G
  /** The group's label. */
  label: string
  /** The resolved slot classes. */
  ui: ComponentUI<CommandPalette>
}

type ItemSlot<T extends CommandPaletteItem> = (props: CommandPaletteItemSlotProps<T>) => VNode[]

type GroupSlot = (props: CommandPaletteGroupSlotProps) => VNode[]

/** Slots of `CommandPalette`. Items and groups with a `slot` field use `#<slot>…` instead of `#item…` / `#group-label`. */
export type CommandPaletteSlots<T extends CommandPaletteItem = CommandPaletteItem> = {
  /** Content above the input, such as breadcrumbs or filters. */
  header?: (props: { ui: ComponentUI<CommandPalette> }) => VNode[]
  /** Replaces the text shown when nothing matches. */
  empty?: (props: { searchTerm: string }) => VNode[]
  /** Content under the list, such as keyboard hints. */
  footer?: (props: { ui: ComponentUI<CommandPalette> }) => VNode[]
  /** Replaces the back button. */
  back?: (props: { ui: ComponentUI<CommandPalette>; onBack: () => void }) => VNode[]
  /** Replaces the close button, or adds content at the end of the input. */
  close?: (props: { ui: ComponentUI<CommandPalette> }) => VNode[]
  /** Replaces the whole content of an item. */
  item?: ItemSlot<T>
  /** Replaces the leading icon, avatar or chip of an item. */
  'item-leading'?: ItemSlot<T>
  /** Replaces the label (prefix, label and suffix) of an item. */
  'item-label'?: ItemSlot<T>
  /** Replaces the description of an item. */
  'item-description'?: ItemSlot<T>
  /** Replaces the trailing content (children icon, kbds, highlighted icon) of an item. The selected icon stays. */
  'item-trailing'?: ItemSlot<T>
  /** Replaces the heading of a group. Nested pages (an item's `children`) are groups of plain items. */
  'group-label'?: GroupSlot
} & {
  /** The heading of a group whose `slot` names it (`#<slot>-group-label`). */
  [slot: `${string}-group-label`]: GroupSlot
} & {
  /** The `#<slot>`, `#<slot>-leading`, `#<slot>-label`, `#<slot>-description` and `#<slot>-trailing` slots of items whose `slot` names them. */
  [slot: string]: ItemSlot<T>
}
