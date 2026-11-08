import type { TreeItem, TreeMoveEvent } from './Tree.types'

/**
 * Applies a Tree `move` event to its items: returns a new tree with the moved items, descendants included, before or
 * after the target, or at the end of its children for `inside`. Folders the move doesn't touch keep their identity.
 */
export const moveTreeItems = <T extends TreeItem>(items: T[], move: TreeMoveEvent<T>): T[] => {
  const moved = new Set<TreeItem>(move.items)

  // The list without the moved items and with them at the target; the same array when nothing in it changed
  const apply = (list: T[]): T[] => {
    const next = list.flatMap((item): T[] => {
      if (moved.has(item)) return []

      const children = item.children && apply(item.children as T[])
      const isInsideTarget = item === move.target && move.position === 'inside'
      const ownChildren = isInsideTarget ? [...(children ?? []), ...move.items] : children
      const copy = ownChildren === item.children ? item : { ...item, children: ownChildren }

      if (item !== move.target || move.position === 'inside') return [copy]

      return move.position === 'before' ? [...move.items, copy] : [copy, ...move.items]
    })

    return next.length === list.length && next.every((item, index) => item === list[index])
      ? list
      : next
  }

  return apply(items)
}
