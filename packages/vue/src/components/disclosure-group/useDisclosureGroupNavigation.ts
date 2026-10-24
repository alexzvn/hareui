import type { MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'

import type { ExpandedValue } from '@/composables/useExpandedValues'

export interface UseDisclosureGroupNavigationOptions {
  /** The currently expanded values (the Accordion / DisclosureGroup `v-model`). */
  expandedKeys: MaybeRefOrGetter<ExpandedValue[]>
  /** Every item's value, in display order. */
  itemIds: MaybeRefOrGetter<ExpandedValue[]>
  /** Called with the new expanded values when navigating. */
  onExpandedChange: (keys: ExpandedValue[]) => void
  /**
   * Whether navigating keeps the previously expanded items open.
   * @defaultValue false
   */
  multiple?: MaybeRefOrGetter<boolean | undefined>
}

/**
 * Previous/next navigation across the items of an Accordion or DisclosureGroup, ported from
 * HeroUI's `useDisclosureGroupNavigation`. The current item is the first expanded one (or the
 * first item when none is expanded).
 */
export function useDisclosureGroupNavigation(options: UseDisclosureGroupNavigationOptions) {
  const currentIndex = computed(() => {
    const ids = toValue(options.itemIds)
    const expanded = toValue(options.expandedKeys)
    const current = ids.find((id) => expanded.includes(id)) ?? ids[0]
    return current === undefined ? -1 : ids.indexOf(current)
  })

  function goTo(index: number) {
    const id = toValue(options.itemIds)[index]
    if (id === undefined) return
    const expanded = toValue(options.expandedKeys)
    options.onExpandedChange(
      toValue(options.multiple)
        ? expanded.includes(id)
          ? [...expanded]
          : [...expanded, id]
        : [id],
    )
  }

  return {
    currentIndex,
    isPrevDisabled: computed(() => currentIndex.value <= 0),
    isNextDisabled: computed(() => currentIndex.value >= toValue(options.itemIds).length - 1),
    onPrevious: () => {
      if (currentIndex.value > 0) goTo(currentIndex.value - 1)
    },
    onNext: () => {
      if (currentIndex.value < toValue(options.itemIds).length - 1) goTo(currentIndex.value + 1)
    },
  }
}
