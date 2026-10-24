// Internal: pure ListBox collection helpers: flattening and option text (behind `useCollectionModel`) and the filtered
// collections of ComboBox and Autocomplete (RAC `filterCollection`).
import type { ListBoxEntry, ListBoxItem, ListBoxSection } from './ListBox.types'

export type CollectionRow = {
  kind: 'item'
  item: ListBoxItem
  index: number
}

export type CollectionBlock =
  | CollectionRow
  | { kind: 'section'; section: ListBoxSection; rows: CollectionRow[]; key: number }
  | { kind: 'separator'; key: number }

/** Every option of `entries`, sections flattened, in collection order. */
export const flattenEntries = (entries: ListBoxEntry[] | undefined): ListBoxItem[] => {
  return (entries ?? []).flatMap((entry) => {
    if ('type' in entry && entry.type === 'section') return entry.items
    if ('type' in entry && entry.type === 'separator') return []

    return [entry as ListBoxItem]
  })
}

/** The text an option is filtered and announced by. */
export const itemText = (item: ListBoxItem) => item.textValue ?? item.label ?? String(item.value)

/**
 * Rows to render for the options matching `match`, with flat running indices. As in RAC, sections without a
 * matching option are dropped and separators are kept.
 */
export const filterEntries = (
  entries: ListBoxEntry[] | undefined,
  match: (item: ListBoxItem) => boolean,
): CollectionBlock[] => {
  const all = flattenEntries(entries)
  const toRow = (item: ListBoxItem): CollectionRow => ({
    kind: 'item',
    item,
    index: all.indexOf(item),
  })

  const toBlocks = (entry: ListBoxEntry, key: number): CollectionBlock[] => {
    if ('type' in entry && entry.type === 'section') {
      const rows = entry.items.filter(match).map(toRow)

      return rows.length ? [{ kind: 'section', section: entry, rows, key }] : []
    }

    if ('type' in entry && entry.type === 'separator') return [{ kind: 'separator', key }]

    const item = entry as ListBoxItem

    return match(item) ? [toRow(item)] : []
  }

  return (entries ?? []).flatMap(toBlocks)
}

const getBlockRowCount = (block: CollectionBlock): number => {
  if (block.kind === 'section') return block.rows.length

  return block.kind === 'item' ? 1 : 0
}

/** Number of option rows in `blocks`. */
export const countRows = (blocks: CollectionBlock[]): number => {
  return blocks.reduce((n, block) => n + getBlockRowCount(block), 0)
}
