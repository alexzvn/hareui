// Internal: pure ListBox collection helpers: flattening and option text (behind `useCollectionModel`) and the filtered
// collections of ComboBox and Autocomplete (RAC `filterCollection`).
import type { ListBoxEntry, ListBoxItem, ListBoxSection } from './ListBox.vue'

export interface CollectionRow { kind: 'item', item: ListBoxItem, index: number }
export type CollectionBlock = CollectionRow
  | { kind: 'section', section: ListBoxSection, rows: CollectionRow[], key: number }
  | { kind: 'separator', key: number }

/** Every option of `entries`, sections flattened, in collection order. */
export function flattenEntries(entries: ListBoxEntry[] | undefined): ListBoxItem[] {
  return (entries ?? []).flatMap((entry) => {
    if ('type' in entry && entry.type === 'section')
      return entry.items
    if ('type' in entry && entry.type === 'separator')
      return []
    return [entry as ListBoxItem]
  })
}

/** The text an option is filtered and announced by. */
export const itemText = (item: ListBoxItem) => item.textValue ?? item.label ?? String(item.value)

/**
 * Rows to render for the options matching `match`, with flat running indices. As in RAC, sections without a
 * matching option are dropped and separators are kept.
 */
export function filterEntries(entries: ListBoxEntry[] | undefined, match: (item: ListBoxItem) => boolean): CollectionBlock[] {
  const all = flattenEntries(entries)
  const blocks: CollectionBlock[] = []
  ;(entries ?? []).forEach((entry, key) => {
    if ('type' in entry && entry.type === 'section') {
      const rows = entry.items.filter(match).map(item => ({ kind: 'item' as const, item, index: all.indexOf(item) }))
      if (rows.length)
        blocks.push({ kind: 'section', section: entry, rows, key })
    }
    else if ('type' in entry && entry.type === 'separator') {
      blocks.push({ kind: 'separator', key })
    }
    else if (match(entry as ListBoxItem)) {
      blocks.push({ kind: 'item', item: entry as ListBoxItem, index: all.indexOf(entry as ListBoxItem) })
    }
  })
  return blocks
}

/** Number of option rows in `blocks`. */
export function countRows(blocks: CollectionBlock[]): number {
  return blocks.reduce((n, b) => n + (b.kind === 'item' ? 1 : b.kind === 'section' ? b.rows.length : 0), 0)
}
