import { useFilter } from 'reka-ui'
import type { ComputedRef, Ref } from 'vue'
import { computed, ref } from 'vue'

import type { ListBoxEntry, ListBoxItem } from '@/components/list-box/ListBox.types'
import { filterEntries, itemText } from '@/components/list-box/listBoxCollection'

import type { ComboBoxProps } from './ComboBox.types'

type ComboBoxFilterOptions = {
  props: Pick<ComboBoxProps, 'filter' | 'open' | 'defaultOpen'>
  items: () => ListBoxEntry[] | undefined
  /** Every option, sections flattened. */
  options: ComputedRef<ListBoxItem[]>
  inputValue: Ref<string>
}

// RAC `useComboBoxState` + `useFilter({ sensitivity: 'base' })`
export const useComboBoxFilter = (filterOptions: ComboBoxFilterOptions) => {
  const { props, items, options, inputValue } = filterOptions
  const { contains } = useFilter({ sensitivity: 'base' })

  // Shows every option when the popover was opened by focus / trigger / arrow keys, until the text changes
  const isShowingAll = ref(!!(props.open ?? props.defaultOpen))

  const matches = computed(() => {
    const text = inputValue.value
    const filter = props.filter
    if (filter === false || isShowingAll.value) return () => true

    const test = filter ?? contains

    return (item: ListBoxItem) => test(itemText(item), text)
  })

  // The filtered entries the popover renders while open
  const liveBlocks = computed(() => filterEntries(items(), matches.value))

  // What the open checks see: the filtered list of the current text (RAC `filteredCollection`)
  const filteredCount = computed(() => {
    const filter = props.filter
    if (filter === false) return options.value.length

    const test = filter ?? contains
    const matching = options.value.filter((item) => test(itemText(item), inputValue.value))

    return matching.length
  })

  return { isShowingAll, liveBlocks, filteredCount }
}
