// Internal: type-to-select shared by ListBox (open list) and the closed Select / Autocomplete triggers
// (RAC `useTypeSelect`).
import { onScopeDispose } from 'vue'

/**
 * Where a search starts, relative to the current item. Every search wraps around to the top.
 *
 * RAC `useTypeSelect` always searches with `ListKeyboardDelegate.getKeyForSearch(search, focusedKey)`, which starts AT
 * the focused key (inclusive, so a repeated character stays put), then `getKeyForSearch(search)` from the first key
 * when nothing follows it. RAC `useSelect` feeds the same hook, so ListBox and Select both use `current`.
 * - `current`: from the current item, inclusive (RAC).
 * - `next`: a single character starts after the current item, so repeating it cycles through the matches; a longer
 *   search starts at the top. Autocomplete's closed trigger keeps this rule; it is not RAC's.
 */
export type TypeaheadStart = 'current' | 'next'

export type TypeaheadOptions = {
  start: TypeaheadStart
  /**
   * RAC: Space extends a search in progress (the caller should then keep it from pressing/selecting) but never
   * starts one. Without it Space is never a typeahead key, for triggers where Space opens the popover.
   */
  space?: boolean
}

export type TypeaheadSource<T> = {
  /** Candidates in display order. */
  items: readonly T[]
  /** Searchable text of an item; matched case-insensitively by prefix. */
  text: (item: T) => string
  /** Disabled items are never matched and never count as the current item. */
  disabled?: (item: T) => boolean
  /** Matches the item the search is relative to (focused / selected); none enabled searches from the top. */
  isCurrent?: (item: T) => boolean
}

/** RAC `TYPEAHEAD_DEBOUNCE_WAIT_MS`: the buffer resets this long after the last typeahead key. */
const RESET_MS = 1000

export const useTypeahead = (options: TypeaheadOptions) => {
  let search = ''
  let timer: ReturnType<typeof setTimeout> | undefined
  onScopeDispose(() => clearTimeout(timer))

  const accepts = (event: KeyboardEvent) => {
    // One printable character (one code point, so astral characters count); named keys are longer
    return (
      [...event.key].length === 1 &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey &&
      (event.key !== ' ' || (!!options.space && search !== ''))
    )
  }

  const find = <T>({ items, text, disabled, isCurrent }: TypeaheadSource<T>): T | undefined => {
    const enabled = disabled ? items.filter((item) => !disabled(item)) : items
    const index = isCurrent ? enabled.findIndex(isCurrent) : -1
    const from =
      options.start === 'current' ? Math.max(index, 0) : search.length > 1 ? 0 : index + 1
    for (let i = 0; i < enabled.length; i++) {
      const item = enabled[(from + i) % enabled.length]!
      if (text(item).toLowerCase().startsWith(search)) return item
    }
  }

  /**
   * Feeds a keydown. Returns `false`, leaving the buffer untouched, when it is not a typeahead key. Otherwise extends
   * the buffer, restarts the reset timer, reads `source` (lazily: it may query the DOM) and hands the first match to
   * `select`; nothing matching leaves the current item alone and keeps the buffer (RAC clears it instead and lets the
   * key propagate).
   */
  const onKeydown = <T>(
    event: KeyboardEvent,
    source: () => TypeaheadSource<T>,
    select: (match: T) => void,
  ): boolean => {
    if (!accepts(event)) return false
    search += event.key.toLowerCase()
    clearTimeout(timer)
    timer = setTimeout(() => {
      search = ''
    }, RESET_MS)
    const match = find(source())
    if (match !== undefined) select(match)
    return true
  }

  return { onKeydown }
}
