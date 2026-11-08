import { computed, nextTick, onScopeDispose, watch } from 'vue'

import { useDragAndDrop } from '@/composables/useDragAndDrop'
import type { DropTarget } from '@/composables/useDragAndDrop'
import { useLocale } from '@/composables/useLocale'

import type { TreeItem, TreeMoveEvent } from './Tree.types'

/** What `useTreeDrag` reads from its tree. */
type UseTreeDragOptions = {
  /** The tree's root element, which scrolls a virtualized tree. */
  root: () => HTMLElement | undefined
  items: () => TreeItem[]
  /** Whether rows can be dragged now. */
  isEnabled: () => boolean
  /** The selected items, when several rows can be selected. */
  selection: () => TreeItem[]
  isExpanded: (key: string) => boolean
  /** Expands the folder of `key` the way its chevron does; returns whether it opened. */
  expand: (key: string) => boolean
  /** The rows in view order: every item whose ancestors are all expanded. */
  getVisibleItems: () => TreeItem[]
  getKey: (item: TreeItem) => string
  getLabel: (item: TreeItem) => string
  canDrop: () => ((move: TreeMoveEvent) => boolean) | undefined
  /** The row height of a virtualized tree, whose rows render only near the viewport. */
  rowHeight: () => number | undefined
  onMove: (move: TreeMoveEvent) => void
}

type TreeNodeInfo = {
  item: TreeItem
  /** The parent's key; `undefined` at the top level. */
  parent: string | undefined
  level: number
}

/** The drop line a row draws, and the level whose indent it starts at. */
export type TreeDropIndicator = {
  position: 'before' | 'after'
  level: number
}

const isFolder = (item: TreeItem) => Array.isArray(item.children)

// A focus that moves with a keyboard drop finds its row within this many frames, once it renders
const FOCUS_FRAMES = 10

// A pointer resting this long (ms) on a collapsed folder opens it, so a drop can land between its rows
const SPRING_DELAY = 600

// What the dragged copy of a row leaves out, so it shows the icon and label only
const PREVIEW_OMITTED = [
  'tree-guide-line',
  'checkbox',
  'tree-chevron',
  'tree-trailing',
  'tree-drop-indicator',
]
  .map((slot) => `[data-slot=${slot}]`)
  .join(', ')

// The copy also drops the row's indent: it starts where a top-level row does
const preparePreview = (copy: HTMLElement) => {
  copy.style.setProperty('--tree-level', '1')
  for (const element of copy.querySelectorAll(PREVIEW_OMITTED)) element.remove()
}

/** Drag and drop of tree rows: the pointer and keyboard drag of `useDragAndDrop`, mapped onto folders and levels. */
export const useTreeDrag = (options: UseTreeDragOptions) => {
  const { t } = useLocale()

  // Every item by key, with its parent and level; computed lazily, so only a drag reads it
  const nodes = computed(() => {
    const map = new Map<string, TreeNodeInfo>()
    const walk = (items: TreeItem[], { parent, level }: Omit<TreeNodeInfo, 'item'>) => {
      for (const item of items) {
        const key = options.getKey(item)
        map.set(key, { item, parent, level })
        walk(item.children ?? [], { parent: key, level: level + 1 })
      }
    }

    walk(options.items(), { parent: undefined, level: 1 })

    return map
  })

  const getNode = (key: string) => nodes.value.get(key)

  const isOpen = (item: TreeItem) =>
    !!item.children?.length && options.isExpanded(options.getKey(item))

  // Whether `key` sits somewhere inside one of the `folders`
  const isInside = (key: string, folders: Set<string>) => {
    for (let parent = getNode(key)?.parent; parent; parent = getNode(parent)?.parent)
      if (folders.has(parent)) return true

    return false
  }

  // A selected row drags every selected row, in tree order; a selected folder takes its descendants along
  const getDragKeys = (key: string) => {
    const node = getNode(key)
    if (!options.isEnabled() || !node || node.item.disabled) return []

    const selected = new Set(options.selection().map((item) => options.getKey(item)))
    if (!selected.has(key)) return [key]

    const keys: string[] = []
    const collect = (items: TreeItem[]) => {
      for (const item of items) {
        const itemKey = options.getKey(item)
        if (!selected.has(itemKey) || item.disabled) {
          collect(item.children ?? [])
          continue
        }

        keys.push(itemKey)
      }
    }

    collect(options.items())

    return keys
  }

  // The keyboard's stops, top to bottom: before the first row of each list, inside every folder, and after every
  // row, with an open folder's rows between its `inside` and `after`. A dragged folder isn't entered.
  const getTargets = (keys: string[]) => {
    const dragged = new Set(keys)
    const targets: DropTarget[] = []
    const walk = (items: TreeItem[]) => {
      items.forEach((item, index) => {
        const key = options.getKey(item)
        const isDragged = dragged.has(key)
        if (index === 0) targets.push({ key, position: 'before' })
        if (isFolder(item) && !isDragged) targets.push({ key, position: 'inside' })
        if (isOpen(item) && !isDragged) walk(item.children!)
        targets.push({ key, position: 'after' })
      })
    }

    walk(options.items())

    return targets
  }

  // The bottom edge of an open folder's row is the top edge of its first row
  const normalizeTarget = (target: DropTarget): DropTarget => {
    const item = getNode(target.key)?.item
    if (target.position !== 'after' || !item || !isOpen(item)) return target

    return { key: options.getKey(item.children![0]!), position: 'before' }
  }

  const toMove = (keys: string[], target: DropTarget): TreeMoveEvent => ({
    items: keys.map((key) => getNode(key)!.item),
    target: getNode(target.key)!.item,
    position: target.position,
  })

  const canDrop = (keys: string[], target: DropTarget) => {
    if (isInside(target.key, new Set(keys))) return false

    return options.canDrop()?.(toMove(keys, target)) ?? true
  }

  const getLastVisible = (item: TreeItem): TreeItem =>
    isOpen(item) ? getLastVisible(item.children!.at(-1)!) : item

  const findRow = (key: string) => {
    const rows = options.root()?.querySelectorAll<HTMLElement>('[data-key]') ?? []

    return [...rows].find((row) => row.dataset.key === key)
  }

  // A virtualized tree renders only the rows near the viewport; one further away is scrolled to by its index
  const revealRow = (key: string) => {
    const row = findRow(key)
    if (row) return row.scrollIntoView({ block: 'nearest', inline: 'nearest' })

    const root = options.root()
    const size = options.rowHeight()
    const index = options.getVisibleItems().findIndex((item) => options.getKey(item) === key)
    if (!root || !size || index === -1) return

    const top = index * size
    root.scrollTop = top < root.scrollTop ? top : top + size - root.clientHeight
  }

  const focusRow = (key: string) => {
    let framesLeft = FOCUS_FRAMES
    const attempt = () => {
      const row = findRow(key)
      if (row) return row.focus()
      if (framesLeft-- > 0) requestAnimationFrame(attempt)
    }

    revealRow(key)
    attempt()
  }

  // Moving rows remounts them or moves them in the DOM, which drops the focus: it goes back to the row that had it,
  // or to the folder it went into when that folder is collapsed
  const onDrop = (keys: string[], target: DropTarget) => {
    const active = document.activeElement
    const focusedKey = options.root()?.contains(active)
      ? active?.getAttribute('data-key')
      : undefined

    options.onMove(toMove(keys, target))

    // The moved rows show where they went
    if (target.position === 'inside' && !options.isExpanded(target.key)) options.expand(target.key)
    if (typeof focusedKey !== 'string') return

    void nextTick(() => {
      const isVisible = options
        .getVisibleItems()
        .some((item) => options.getKey(item) === focusedKey)

      const key = isVisible ? focusedKey : target.key
      if (document.activeElement?.getAttribute('data-key') !== key) focusRow(key)
    })
  }

  const isCollapsedFolder = (key: string) => {
    const item = getNode(key)?.item

    return !!item && isFolder(item) && !item.disabled && !options.isExpanded(key)
  }

  const drag = useDragAndDrop({
    root: options.root,
    keyAttribute: 'data-key',
    getDragKeys,
    getTargets,
    canDropInside: (key) => isFolder(getNode(key)?.item ?? {}),
    normalizeTarget,
    canDrop,
    getLabel: (key) => options.getLabel(getNode(key)!.item),
    // The drop line of an `after` target can sit rows below the target, at the end of its open folder
    scrollTo: (key) => revealRow(indicator.value?.key ?? key),
    expandTarget: (target) =>
      target.position === 'inside' && isCollapsedFolder(target.key) && options.expand(target.key),
    onDrop,
    preparePreview,
  })

  // A pointer drag resting inside a collapsed folder opens it
  let springTimer: ReturnType<typeof setTimeout> | undefined
  watch(
    () => drag.state.target,
    (target) => {
      clearTimeout(springTimer)
      if (drag.state.mode !== 'pointer' || target?.position !== 'inside') return
      if (!isCollapsedFolder(target.key)) return

      springTimer = setTimeout(() => options.expand(target.key), SPRING_DELAY)
    },
  )

  onScopeDispose(() => clearTimeout(springTimer))

  // A drop after an open folder lands below its last visible row, so that row draws the line, at the folder's indent
  const indicator = computed(() => {
    const target = drag.state.target
    const node = target && getNode(target.key)
    if (!target || !node || target.position === 'inside') return undefined

    const host = target.position === 'after' ? getLastVisible(node.item) : node.item

    return { key: options.getKey(host), position: target.position, level: node.level }
  })

  /**
   * The attributes that make the row of `key` a drop target, and the handlers that make it a drag source unless
   * `isDisabled`.
   */
  const getRowAttrs = (key: string, isDisabled: boolean) => {
    const attrs = {
      'data-key': key,
      'data-dragging': drag.isDragging(key) ? '' : undefined,
      'data-drop-target': drag.getDropPosition(key),
    }

    if (isDisabled) return attrs

    return {
      ...attrs,
      'aria-description': t('dragAndDrop.instructions'),
      onPointerdown: (event: PointerEvent) => drag.onPointerDown(event, key),
      // Space still selects the row; Enter, which would select it too, picks it up instead
      onKeydownCapture: (event: KeyboardEvent) => {
        if (event.key === 'Enter') drag.onKeyDown(event, key)
      },
    }
  }

  /** The drop line the row of `key` draws, if any. */
  const getIndicator = (key: string): TreeDropIndicator | undefined => {
    const current = indicator.value
    if (current?.key !== key) return undefined

    return { position: current.position, level: current.level }
  }

  return { getRowAttrs, getIndicator }
}
