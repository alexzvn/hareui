import type { PrimitiveProps } from 'reka-ui'
import type { InjectionKey, Slots } from 'vue'

import type { IconValue } from '@/types/icon'

import type { TreeItem, TreeSelectEvent, TreeToggleEvent, TreeUI } from './Tree.types'
import type { TreeDropIndicator } from './useTreeDrag'

/** What a `Tree` hands down to its rows. Getters, so rows track the tree's props. */
export type TreeContext = {
  /** The tree's resolved slot class functions. */
  ui: () => TreeUI
  /** The tree's slots, rendered by every row. */
  slots: Slots
  /** The row element (`as.link`). */
  linkAs: () => PrimitiveProps['as']
  /** Whether rows render their children inside them (`nested` and not `virtualize`). */
  isNested: () => boolean
  /** Whether the whole tree is disabled. */
  isDisabled: () => boolean
  /** Whether rows show a checkbox before the chevron. */
  hasCheckbox: () => boolean
  /** Whether rows can be dragged: they take the drag handlers. */
  isDraggable: () => boolean
  /** The attributes that make a row a drop target, and the handlers that make it a drag source unless `isDisabled`. */
  getDragAttrs: (key: string, isDisabled: boolean) => Record<string, unknown>
  /** The drop line a row draws during a drag, if any. */
  getDropIndicator: (key: string) => TreeDropIndicator | undefined
  /** The chevron, expanded folder and collapsed folder icons. */
  icons: () => {
    indicator: IconValue
    expanded: IconValue
    collapsed: IconValue
  }
  getKey: (item: TreeItem) => string
  getLabel: (item: TreeItem) => string
  onSelect: (event: TreeSelectEvent, item: TreeItem) => void
  onToggle: (event: TreeToggleEvent, item: TreeItem) => void
}

export const treeContextKey: InjectionKey<TreeContext> = Symbol('hareui-tree')

/** The children Reka should treat as expandable: an empty `children` array is a folder without an expand chevron. */
export const getExpandableChildren = (item: TreeItem) => {
  return item.children?.length ? item.children : undefined
}
