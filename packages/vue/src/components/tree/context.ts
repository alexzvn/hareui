import type { PrimitiveProps } from 'reka-ui'
import type { Component, InjectionKey, Slots } from 'vue'

import type { TreeItem, TreeSelectEvent, TreeToggleEvent, TreeUI } from './Tree.types'

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
  /** The chevron, expanded folder and collapsed folder icons. */
  icons: () => {
    indicator: string | Component
    expanded: string | Component
    collapsed: string | Component
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
