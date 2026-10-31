/*
 * Internal: ListView's keyboard model (RAC `GridList` with `keyboardNavigationBehavior: 'arrow'`).
 *
 * Up/Down/Home/End/PageUp/PageDown move focus between enabled rows without wrapping; Left/Right cycle focus from the
 * row through the controls of its cells and back; Space selects, Enter runs the row's action; typing a label moves to
 * it; Tab and Shift+Tab leave the list. The focused row is the list's only tab stop: the controls in rows are taken out
 * of the tab order (`tabindex="-1"`), as in a RAC grid. Runs in the capture phase, so the arrows a row's controls
 * would otherwise take (a menu button opens on ArrowDown) move between rows first, as in RAC.
 */
import { onBeforeUnmount, onMounted } from 'vue'

import { useTypeahead } from '@/components/list-box/useTypeahead'
import { getScrollParent } from '@/utils/scrollParent'

import type { ListViewItem } from './ListView.types'
import type { useListViewSelection } from './useListViewSelection'

/** A row's offset from the top of the list and its height, in px. */
export type ListViewRowBox = { top: number; height: number }

type ListViewKeyboardOptions = {
  /** The items, in display order. */
  items: () => ListViewItem[]
  selection: ReturnType<typeof useListViewSelection>
  getRoot: () => HTMLElement | null
  /** Moves focus to the row at `index`, scrolling a virtualized row into view first. */
  focusIndex: (index: number) => void
  /** The box of the row at `index`; `undefined` when it isn't laid out. */
  getRowBox: (index: number) => ListViewRowBox | undefined
  /** Enter on a row: runs its action or follows its link, else selects it. */
  onEnter: (index: number, event: KeyboardEvent) => void
}

const CONTROLS = 'a[href], button, input, select, textarea, [tabindex]'

type FocusableControl = HTMLElement & { disabled?: boolean }

const isEnabledControl = (el: FocusableControl) => !el.disabled

/** The focusable elements in a row's cells, in DOM order. The selection checkbox is left to Space and the pointer. */
const getCellControls = (row: HTMLElement): HTMLElement[] => {
  return [...row.querySelectorAll<FocusableControl>(CONTROLS)].filter(
    (el) => isEnabledControl(el) && !el.closest('[data-slot=list-view-selection-cell]'),
  )
}

const getTabbables = (root: HTMLElement): HTMLElement[] => {
  return [...root.querySelectorAll<FocusableControl>(CONTROLS)].filter(
    (el) => el.tabIndex >= 0 && isEnabledControl(el),
  )
}

// Only the list's own rows: a list nested in an action cell is one of the row's controls
const getOwnRows = (root: HTMLElement): HTMLElement[] => {
  return [...root.children].filter(
    (el): el is HTMLElement => el instanceof HTMLElement && el.matches('[role=row][data-index]'),
  )
}

const removeControlsFromTabOrder = (root: HTMLElement) => {
  const controls = getOwnRows(root).flatMap((row) => [
    ...row.querySelectorAll<HTMLElement>(CONTROLS),
  ])

  for (const el of controls) {
    if (el.tabIndex >= 0) el.tabIndex = -1
  }
}

const isRowArrow = (event: KeyboardEvent) =>
  (event.key === 'ArrowDown' || event.key === 'ArrowUp') && !event.altKey

const isCellArrow = (event: KeyboardEvent) =>
  (event.key === 'ArrowLeft' || event.key === 'ArrowRight') &&
  !event.altKey &&
  !event.ctrlKey &&
  !event.metaKey

/** Left/Right: row → first (Left: last) control → … → back to the row, mirrored in right-to-left layouts. */
const getCellTarget = (event: KeyboardEvent, row: HTMLElement): HTMLElement | undefined => {
  const controls = getCellControls(row)
  if (!controls.length) return undefined

  const isRtl = getComputedStyle(row).direction === 'rtl'
  const isForward = (event.key === 'ArrowRight') !== isRtl
  const active = event.target as HTMLElement
  if (active === row) return isForward ? controls[0] : controls.at(-1)

  const index = controls.findIndex((el) => el.contains(active))
  if (index === -1) return row

  return controls[isForward ? index + 1 : index - 1] ?? row
}

export const useListViewKeyboard = ({
  items,
  selection,
  getRoot,
  focusIndex,
  getRowBox,
  onEnter,
}: ListViewKeyboardOptions) => {
  // RAC `useTypeSelect`: searched from the focused row onwards (inclusive); Space continues a search in progress
  const typeahead = useTypeahead({ start: 'current', space: true })

  // Rows and their slot content render and re-render on their own, so every change is checked
  let tabOrderObserver: MutationObserver | undefined

  onMounted(() => {
    const root = getRoot()
    if (!root) return

    removeControlsFromTabOrder(root)
    tabOrderObserver = new MutationObserver(() => removeControlsFromTabOrder(root))

    tabOrderObserver.observe(root, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['tabindex', 'href'],
    })
  })

  onBeforeUnmount(() => tabOrderObserver?.disconnect())

  const getEnabledIndices = () => items().flatMap((item, index) => (item.disabled ? [] : [index]))

  /** RAC `getKeyPageBelow/Above`: the farthest enabled row within one page (the scroller's height) of `from`. */
  const getPageTarget = (from: number, isDown: boolean) => {
    const enabled = getEnabledIndices()
    const scroller = getScrollParent(getRoot())
    const origin = getRowBox(from)
    if (!scroller || !origin) return isDown ? enabled.at(-1) : enabled[0]

    const page = scroller.clientHeight - origin.height

    const getDistance = (index: number) => {
      const top = getRowBox(index)?.top ?? origin.top

      return isDown ? top - origin.top : origin.top - top
    }

    const inPage = enabled.filter((index) => getDistance(index) >= 0 && getDistance(index) <= page)

    return isDown ? inPage.at(-1) : inPage[0]
  }

  const navigationTargets = {
    ArrowDown: (from: number) => getEnabledIndices().find((index) => index > from),
    ArrowUp: (from: number) =>
      getEnabledIndices()
        .filter((index) => index < from)
        .at(-1),
    Home: () => getEnabledIndices()[0],
    End: () => getEnabledIndices().at(-1),
    PageDown: (from: number) => getPageTarget(from, true),
    PageUp: (from: number) => getPageTarget(from, false),
  } as const satisfies Record<string, (from: number) => number | undefined>

  const isNavigationKey = (key: string): key is keyof typeof navigationTargets =>
    Object.hasOwn(navigationTargets, key)

  const moveFocus = (event: KeyboardEvent, from: number) => {
    if (!isNavigationKey(event.key)) return false

    const to = navigationTargets[event.key](from)
    const list = items()
    if (to === undefined || !list[to] || !list[from]) return false

    event.preventDefault()
    event.stopPropagation()
    focusIndex(to)
    selection.onFocusMove({ to: list[to].value, from: list[from].value, modifiers: event })

    return true
  }

  const onTypeahead = (event: KeyboardEvent, from: number) => {
    const isHandled = typeahead.onKeydown(event, {
      source: () => ({
        items: items().map((item, index) => ({ item, index })),
        text: (entry) => entry.item.label,
        disabled: (entry) => !!entry.item.disabled,
        isCurrent: (entry) => entry.index === from,
      }),
      select: ({ item, index }) => {
        focusIndex(index)

        // A shifted letter only types: it never extends the selection
        const modifiers = { shiftKey: false, ctrlKey: false, metaKey: false }
        const current = items()[from]
        if (current) selection.onFocusMove({ to: item.value, from: current.value, modifiers })
      },
    })

    if (!isHandled) return false

    event.stopPropagation()
    if (event.key === ' ') event.preventDefault()

    return true
  }

  // RAC: Shift+Tab focuses the list itself, so the browser moves on from before it; Tab focuses the last tabbable
  // element inside, so the browser moves on from after it
  const onTab = (event: KeyboardEvent, root: HTMLElement) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return
    if (event.shiftKey) return root.focus({ preventScroll: true })

    const last = getTabbables(root).at(-1)
    const active = document.activeElement
    if (last && active && !last.contains(active)) last.focus({ preventScroll: true })
  }

  const moveWithinRow = (event: KeyboardEvent, row: HTMLElement) => {
    const target = getCellTarget(event, row)
    if (!target) return

    event.preventDefault()
    event.stopPropagation()
    target.focus()
  }

  const onRowKey = (event: KeyboardEvent, index: number) => {
    const item = items()[index]
    if (!item) return

    if (event.key === ' ') {
      event.preventDefault()
      if (selection.isSelectable.value) selection.select(item.value, event)

      return
    }

    if (event.key !== 'Enter') return

    event.preventDefault()
    onEnter(index, event)
  }

  const onKeydown = (event: KeyboardEvent) => {
    const root = getRoot()
    if (!root || event.isComposing) return
    if (event.key === 'Tab') return onTab(event, root)

    const target = event.target as HTMLElement
    const row = target.closest<HTMLElement>('[role=row][data-index]')
    if (!row || row.parentElement !== root) return

    const index = Number(row.dataset.index)
    if (isCellArrow(event)) return moveWithinRow(event, row)

    // A control in a row keeps every other key; Up/Down still move between rows
    const isOnRow = target === row
    if (!isOnRow && !isRowArrow(event)) return
    if (isOnRow && selection.onKeydown(event)) return
    if (isOnRow && onTypeahead(event, index)) return
    if (moveFocus(event, index)) return

    // RAC keeps Up/Down from a row's controls even at the first or last row
    if (!isOnRow) {
      event.preventDefault()
      event.stopPropagation()

      return
    }

    onRowKey(event, index)
  }

  return { onKeydown }
}
