import type { PrimitiveProps, SplitterGroupProps, SplitterResizeHandleProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { ComponentSlots, ComponentUI, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Splitter = typeof theme

/** The resolved slot class functions of a `Splitter`, passed to its slots. */
export type SplitterUI = ComponentUI<Splitter>

/** One resizable panel of a `Splitter`. Extra fields are kept and passed to the panel's slot as `item`. */
export type SplitterItem = {
  /** A unique id for the panel, also used as its `key`. Defaults to `${id}-panel-${index}` when the splitter has an `id`. */
  id?: string
  /** The size of the panel until the user resizes it, in `sizeUnit`. Panels without one share the remaining space. */
  defaultSize?: number
  /** The smallest size the panel can be resized to, in `sizeUnit`. */
  minSize?: number
  /** The largest size the panel can be resized to, in `sizeUnit`. */
  maxSize?: number
  /** Whether the panel collapses to `collapsedSize` when dragged below `minSize`. */
  collapsible?: boolean
  /** The size of the panel while collapsed, in `sizeUnit`. */
  collapsedSize?: number
  /**
   * The unit of the panel's sizes: a percentage of the splitter, or pixels.
   * @defaultValue '%'
   */
  sizeUnit?: '%' | 'px'
  /** The panel's position among its siblings, needed when panels are rendered conditionally. */
  order?: number
  /** Name of the slot that renders this panel's content. Defaults to `panel-${index}`. */
  slot?: string
  /**
   * Additional classes for this panel, applied over `ui.panel`. Put padding on the panel's content instead: padding on
   * the panel adds to its size, so it can't shrink or collapse below it.
   */
  class?: ClassValue
  /** Class overrides for this panel only. */
  ui?: Pick<ComponentSlots<Splitter>, 'panel'>
  /** Extra fields are passed through to the panel's slot as `item`. */
  [key: string]: unknown
}

/** Props of `Splitter`: panels laid out in a row or column, separated by draggable, keyboard-operable resize handles. */
export type SplitterProps<T extends SplitterItem = SplitterItem> = {
  /**
   * The element or component the splitter renders as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps['as']
  /**
   * A unique id for the splitter, also used to derive the ids of its panels and handles. Set it when rendering on the
   * server: generated ids can differ between the server and the client and break resizing after hydration.
   */
  id?: string
  /**
   * The direction the panels are laid out and resized in.
   * @defaultValue 'horizontal'
   */
  orientation?: ComponentVariants<Splitter>['orientation']
  /** The panels to render, in order. A resize handle sits between each pair. */
  items?: T[]
  /**
   * Whether the resize handles are disabled, locking the current layout.
   * @defaultValue false
   */
  disabled?: boolean
  /** Persists the layout under this key in `storage` (`localStorage` by default) and restores it on mount. */
  autoSaveId?: SplitterGroupProps['autoSaveId']
  /**
   * How far each arrow key press moves a handle, as a percentage of the splitter.
   * @defaultValue 10
   */
  keyboardResizeBy?: SplitterGroupProps['keyboardResizeBy']
  /** A custom storage for `autoSaveId` (cookies, a server store...) with `getItem` and `setItem`. */
  storage?: SplitterGroupProps['storage']
  /**
   * How far, in px, past each side of a handle a pointer still grabs it, for `coarse` (touch) and `fine` (mouse) pointers.
   * @defaultValue { coarse: 15, fine: 5 }
   */
  hitAreaMargins?: SplitterResizeHandleProps['hitAreaMargins']
  /**
   * The handle's affordance: a 1px `line`, a line with a `drag` grip chip, a line with a `pill` grip, or a standalone
   * `handle` pill with no line.
   * @defaultValue 'line'
   */
  type?: ComponentVariants<Splitter>['type']
  /**
   * The handle line's color, matched to the surface the splitter sits on: `primary` for the background,
   * `secondary` for surfaces, `tertiary` for secondary surfaces.
   * @defaultValue 'primary'
   */
  variant?: ComponentVariants<Splitter>['variant']
  /**
   * Shows a pill grip on `line` handles. The other types always show their grip.
   * @defaultValue false
   */
  indicator?: boolean
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Splitter>
}

/** Events emitted by `Splitter`. */
export type SplitterEmits = {
  /** Emitted with every panel's size (percentages) whenever the layout changes, including while dragging. */
  layout: [sizes: number[]]
  /** Emitted with the panel's index when a collapsible panel collapses. */
  collapse: [index: number]
  /** Emitted with the panel's index when a collapsed panel expands. */
  expand: [index: number]
  /** Emitted with the panel's index, its new size and its previous size (percentages) when it is resized. */
  resize: [index: number, size: number, prevSize?: number]
  /** Emitted with the handle's index when a pointer drag on it starts (`true`) or ends (`false`). */
  dragging: [index: number, dragging: boolean]
}

/** Props passed to a panel slot. */
export type SplitterPanelSlotProps<T extends SplitterItem = SplitterItem> = {
  /** The item being rendered. */
  item: T
  /** The panel's position in `items`. */
  index: number
  /** Whether the panel is collapsed. */
  collapsed: boolean
  /** Collapses the panel to its `collapsedSize`. */
  collapse: () => void
  /** Expands a collapsed panel to the size it had before collapsing. */
  expand: () => void
  /** Resizes the panel, in its `sizeUnit`. */
  resize: (size: number) => void
  /** The resolved slot class functions. */
  ui: SplitterUI
}

/** Props passed to the `resize-handle` slot. */
export type SplitterHandleSlotProps = {
  /** The handle's position: it sits between panels `index` and `index + 1`. */
  index: number
  /** The resolved slot class functions, to style custom content like the default grip. */
  ui: SplitterUI
}

/** Controls for one panel, from the `panelsRef` the splitter exposes (indexed like `items`). */
export type SplitterPanelApi = {
  /** Collapses the panel to its `collapsedSize`. */
  collapse: () => void
  /** Expands a collapsed panel to its last size. */
  expand: () => void
  /** Sets the panel's size, in percent of the splitter. */
  resize: (size: number) => void
  /** The panel's current size, in percent of the splitter. */
  getSize: () => number
  /** Whether the panel is collapsed. */
  isCollapsed: boolean
  /** Whether the panel is expanded. */
  isExpanded: boolean
}

type PanelSlot<T extends SplitterItem> = (props: SplitterPanelSlotProps<T>) => VNode[]

type HandleSlot = (props: SplitterHandleSlotProps) => VNode[]

/** Slots of `Splitter`: one per panel, named by the item's `slot` or `panel-${index}`, plus the handle content. */
export type SplitterSlots<T extends SplitterItem = SplitterItem> = {
  /** Replaces the content of every resize handle (the grip). The handle element and its line stay. */
  'resize-handle'?: HandleSlot
  /** The content of a panel: `panel-${index}`, or the name in the item's `slot`. */
  [slot: string]: PanelSlot<T> | undefined
}
