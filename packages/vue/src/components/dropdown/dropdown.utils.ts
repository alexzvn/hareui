import type { DropdownSeparator } from './Dropdown.types'

/** Whether an entry is a `{ type: 'separator' }` divider. */
export const isSeparator = <E extends object>(
  entry: E,
): entry is Extract<E, { type: 'separator' }> => 'type' in entry && entry.type === 'separator'

/** Whether an entry is a `{ type: 'section' }` group. */
export const isSection = <E extends object>(entry: E): entry is Extract<E, { type: 'section' }> =>
  'type' in entry && entry.type === 'section'

/** An `items` prop as groups: a flat list is one group, an empty list none. */
export const toGroups = <T>(items: T[] | T[][]): T[][] => {
  if (items.length === 0) return []

  return Array.isArray(items[0]) ? (items as T[][]) : [items as T[]]
}

/** Groups as one menu list with a separator between them; empty groups are dropped. */
export const joinGroups = <T>(groups: T[][]): (T | DropdownSeparator)[] =>
  groups
    .filter((group) => group.length > 0)
    .flatMap((group, index) => (index === 0 ? group : [{ type: 'separator' as const }, ...group]))

/** Id of the hidden long-press hint every long-press trigger points `aria-describedby` at. */
export const LONG_PRESS_DESCRIPTION_ID = 'hareui-dropdown-long-press-description'

/**
 * React Aria's `useLongPress` accessibility description, shared by every long-press trigger: one
 * hidden element in `document.body`, created by the first trigger that needs it.
 */
export const ensureLongPressDescription = () => {
  if (document.getElementById(LONG_PRESS_DESCRIPTION_ID)) return

  const description = document.createElement('div')
  description.id = LONG_PRESS_DESCRIPTION_ID
  description.style.display = 'none'
  description.textContent = 'Long press or press Alt + ArrowDown to open menu'

  document.body.appendChild(description)
}
