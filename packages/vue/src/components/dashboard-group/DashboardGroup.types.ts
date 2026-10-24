import type { PrimitiveProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { DashboardStorage, DashboardUnit } from '@/composables/useDashboard'
import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type DashboardGroup = typeof theme

export type DashboardGroupProps = {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps['as']
  /**
   * Where the sidebars and panels of the group persist their size and collapsed state: a cookie (read synchronously at setup, so the first render is already correct), `localStorage`, or a custom `{ getItem, setItem }` adapter (e.g. one backed by the request cookies during SSR).
   * @defaultValue 'cookie'
   */
  storage?: DashboardStorage
  /**
   * Prefix of the storage keys. Each sidebar/panel is stored under `${storageKey}-sidebar-${id}` / `${storageKey}-panel-${id}`.
   * @defaultValue 'dashboard'
   */
  storageKey?: string
  /**
   * Whether sizes and collapsed state are written to (and read from) the storage.
   * @defaultValue true
   */
  persistent?: boolean
  /**
   * The unit of every `minSize`, `maxSize`, `defaultSize` and `collapsedSize` inside the group.
   * @defaultValue '%'
   */
  unit?: DashboardUnit
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<DashboardGroup>
}

export type DashboardGroupSlots = {
  /** The sidebars and panels. */
  default?: () => VNode[]
}
