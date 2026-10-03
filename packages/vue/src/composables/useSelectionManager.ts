export type SelectionMode = 'none' | 'single' | 'multiple'

export interface SelectionManagerOptions<K> {
  /** How many keys can be selected. */
  mode: () => SelectionMode
  /** Every key of the collection, in display order. */
  keys: () => K[]
  /** Whether a key can't be selected (disabled items). */
  isDisabled: (key: K) => boolean
  /** The current selection. */
  selected: () => K[]
  /** Writes a new selection. */
  setSelected: (keys: K[]) => void
  /** Whether Escape keeps the selection (RAC `escapeKeyBehavior: 'none'` / `disallowEmptySelection`). */
  keepOnEscape?: () => boolean
}

/** Meta on macOS, Control elsewhere; both are accepted, like most desktop lists. */
export const isSelectAllKey = (event: KeyboardEvent) =>
  (event.ctrlKey || event.metaKey) && !event.altKey && event.key.toLowerCase() === 'a'

/**
 * The multi-select model of React Aria's `SelectionManager` (toggle selection behaviour), shared by ListBox,
 * TagGroup and Table: an anchor for Shift ranges, select-all and clear. Focus movement stays with each
 * component; it calls `extend` with the key focus moved to.
 */
export function useSelectionManager<K>(options: SelectionManagerOptions<K>) {
  // RAC keeps the anchor and the range's moving end on the Selection object
  let anchor: K | undefined
  let current: K | undefined
  // A Shift range right after select-all starts over from the target key
  let fromAll = false

  const isSelected = (key: K) => options.selected().includes(key)

  /** Selectable keys from `a` to `b` inclusive, in collection order. */
  function range(a: K, b: K): K[] {
    const keys = options.keys()
    let from = keys.indexOf(a)
    let to = keys.indexOf(b)
    if (from === -1 || to === -1)
      return []
    if (from > to)
      [from, to] = [to, from]
    return keys.slice(from, to + 1).filter(key => !options.isDisabled(key))
  }

  function write(keys: K[]) {
    fromAll = false
    options.setSelected(keys)
  }

  /** Click / Space / Enter: toggles `key` (single mode replaces). Adding a key makes it the anchor. */
  function toggle(key: K) {
    const mode = options.mode()
    if (mode === 'none' || options.isDisabled(key))
      return
    if (isSelected(key)) {
      write(mode === 'single' ? [] : options.selected().filter(k => k !== key))
      return
    }
    anchor = current = key
    write(mode === 'single' ? [key] : [...options.selected(), key])
  }

  /**
   * Shift+click / Shift+navigation: selects the range from the anchor to `to`, replacing the range the anchor
   * last spanned. Without an anchor the range starts at `from` (the key focus left), else at `to` itself.
   */
  function extend(to: K, from?: K) {
    const mode = options.mode()
    if (mode === 'none' || options.isDisabled(to))
      return
    if (mode === 'single') {
      anchor = current = to
      write([to])
      return
    }
    if (fromAll || (anchor !== undefined && !options.keys().includes(anchor))) {
      anchor = fromAll ? to : undefined
      current = undefined
    }
    const start = anchor ?? from ?? to
    const next = new Set(fromAll ? [] : options.selected())
    for (const key of range(start, current ?? to))
      next.delete(key)
    for (const key of range(to, start))
      next.add(key)
    anchor = start
    current = to
    write([...next])
  }

  /** Meta/Ctrl+A: every selectable key. Focus stays where it is. */
  function selectAll() {
    if (options.mode() !== 'multiple')
      return false
    write(options.keys().filter(key => !options.isDisabled(key)))
    anchor = current = undefined
    fromAll = true
    return true
  }

  /** Escape: clears a non-empty selection (RAC `escapeKeyBehavior: 'clearSelection'`). */
  function clear() {
    if (options.mode() === 'none' || options.keepOnEscape?.() || options.selected().length === 0)
      return false
    write([])
    anchor = current = undefined
    return true
  }

  /**
   * Handles the selection shortcuts that don't move focus (Escape, Meta/Ctrl+A). Returns whether the event was
   * consumed; it is then default-prevented and stopped, as RAC does.
   */
  function onKeydown(event: KeyboardEvent): boolean {
    const handled = event.key === 'Escape' ? clear() : isSelectAllKey(event) ? selectAll() : false
    if (handled) {
      event.preventDefault()
      event.stopPropagation()
    }
    return handled
  }

  /** Records `key` as the anchor without changing the selection (e.g. a toggle made elsewhere). */
  function setAnchor(key: K | undefined) {
    anchor = current = key
    fromAll = false
  }

  return { isSelected, toggle, extend, selectAll, clear, onKeydown, setAnchor }
}
