import type { ComputedRef, InjectionKey } from 'vue'

import type { ItemCardGroupLayout, ItemCardGroupVariant } from './ItemCardGroup.types'

export type ItemCardGroupContext = {
  /** The group's variant, the default of every ItemCard inside it. */
  variant: ComputedRef<ItemCardGroupVariant>
  /** The group's layout: list cards drop their own surface, grid cards keep a raised one. */
  layout: ComputedRef<ItemCardGroupLayout>
}

/** Provided by `ItemCardGroup` to the ItemCards inside it. */
export const itemCardGroupContextKey: InjectionKey<ItemCardGroupContext | null> =
  Symbol('hareui-item-card-group')
