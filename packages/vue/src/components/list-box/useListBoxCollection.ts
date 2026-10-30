// Internal: the rendered shape of ListBox `items`: top-level blocks for the stacked layout, flat option rows
// (by value) for the virtualized one.
import { computed } from 'vue'

import type {
  ListBoxBlock,
  ListBoxEntry,
  ListBoxItem,
  ListBoxRow,
  ListBoxValue,
} from './ListBox.types'
import { itemText } from './listBoxCollection'

/** Blocks of `entries`; option rows get flat running indices across sections. */
const toBlocks = <T extends ListBoxItem>(entries: ListBoxEntry<T>[]): ListBoxBlock<T>[] => {
  let index = 0
  const toRow = (item: T): ListBoxRow<T> => ({ kind: 'item', item, index: index++ })

  return entries.map((entry, key): ListBoxBlock<T> => {
    if ('type' in entry && entry.type === 'section') {
      return { kind: 'section', section: entry, rows: entry.items.map(toRow), key }
    }

    if ('type' in entry && entry.type === 'separator') return { kind: 'separator', key }

    return toRow(entry as T)
  })
}

export const useListBoxCollection = <T extends ListBoxItem>(
  items: () => ListBoxEntry<T>[] | undefined,
) => {
  const blocks = computed(() => toBlocks(items() ?? []))

  const flatRows = computed(() =>
    blocks.value.filter((block): block is ListBoxRow<T> => block.kind === 'item'),
  )

  const rowByValue = computed(() => new Map(flatRows.value.map((row) => [row.item.value, row])))

  // The virtualizer's options are the item values
  const optionValues = computed(() => flatRows.value.map((row) => row.item.value))

  /** The row of a rendered option value. */
  const getRow = (value: unknown) => rowByValue.value.get(value as ListBoxValue)!

  /** The item of an option value, if it is in the collection. */
  const getItem = (value: ListBoxValue) => rowByValue.value.get(value)?.item

  /** Lowercased type-ahead text of a virtualized option. */
  const getOptionText = (value: ListBoxValue) => {
    const item = getItem(value)
    const text = item ? itemText(item) : String(value)

    return text.toLowerCase()
  }

  return { blocks, optionValues, getRow, getItem, getOptionText }
}
