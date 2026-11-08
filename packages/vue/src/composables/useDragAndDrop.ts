import {
  computed,
  getCurrentScope,
  nextTick,
  onScopeDispose,
  shallowReactive,
  shallowReadonly,
} from 'vue'

import { announce } from '@/utils/announce'
import type { DragPreview } from '@/utils/dragPreview'
import { createDragPreview } from '@/utils/dragPreview'
import { getScrollParent } from '@/utils/scrollParent'

import {
  clampCrossAxis,
  MOVED_KEYS,
  getEdgeScroll,
  isGrabKey,
  isPanBlocked,
  pickPosition,
  swallowKeyUp,
} from './dragAndDropHelpers'
import type { DropPosition } from './dragAndDropHelpers'
import { useLocale } from './useLocale'

/** The item a drag would drop on, and where relative to it. */
export type DropTarget = {
  /** The target item's key. */
  key: string
  /** Before or after the item, or inside it. */
  position: DropPosition
}

/** What `useDragAndDrop` drags, where it drops, and how the drop is applied. */
export type UseDragAndDropOptions = {
  /** The element holding every drop target; pointer drags only find targets inside it. */
  root: () => HTMLElement | null | undefined
  /**
   * The attribute that marks a drop target's element and holds the item's key, e.g. `'data-row-key'`. Pointer drags
   * find the target from the element under the pointer.
   */
  keyAttribute: string
  /**
   * The axis the items are laid out on: arrow keys and pointer positions follow it.
   * @defaultValue 'vertical'
   */
  orientation?: 'vertical' | 'horizontal'
  /** The keys a drag moves when it starts on `key`, in order; an empty list doesn't start a drag. */
  getDragKeys: (key: string) => string[]
  /** Every drop target in the order the arrow keys step through them. Invalid ones are skipped. */
  getTargets: (keys: string[]) => DropTarget[]
  /** Whether `key` takes drops inside it. A pointer then splits the item into before, inside and after. */
  canDropInside?: (key: string) => boolean
  /**
   * Turns the target under the pointer into the one the drop means, e.g. `after` an open folder into `before` its
   * first child.
   */
  normalizeTarget?: (target: DropTarget) => DropTarget
  /** Whether `keys` may drop on `target`. A target on a dragged item never can. */
  canDrop?: (keys: string[], target: DropTarget) => boolean
  /** The text an item is announced by. */
  getLabel: (key: string) => string
  /**
   * Brings the keyboard's target into view, for lists that don't render every item; scrolls its element into view
   * by default.
   */
  scrollTo?: (key: string) => void
  /**
   * Adjusts the copy of the pressed item's element that follows the pointer during a pointer drag, e.g. to drop what
   * only makes sense in place. Keyboard drags show no copy.
   */
  preparePreview?: (copy: HTMLElement) => void
  /**
   * Opens the keyboard's target on the arrow key pointing into the content (Right, or Left in right-to-left), e.g. a
   * collapsed folder it would drop inside. Returns whether it opened; the targets are then read again.
   */
  expandTarget?: (target: DropTarget) => boolean
  /** Applies a drop: `keys` move to `target`. */
  onDrop: (keys: string[], target: DropTarget) => void
}

/** The current drag. */
type DragState = {
  /** How the drag runs: a pointer (mouse, pen, touch) or the keyboard; `undefined` while nothing is dragged. */
  mode: 'pointer' | 'keyboard' | undefined
  /** The dragged keys. */
  keys: string[]
  /** Where the items would drop now; `undefined` over no valid target. */
  target: DropTarget | undefined
}

/** Drag state and the handlers to bind on drag sources, returned by `useDragAndDrop`. */
export type UseDragAndDropReturn = {
  /** The current drag. */
  state: Readonly<DragState>
  /** Whether `key` is being dragged; bind as `data-dragging`. */
  isDragging: (key: string) => boolean
  /** Where a drop on `key` would land, while it is the target; bind as `data-drop-target`. */
  getDropPosition: (key: string) => DropPosition | undefined
  /**
   * Starts a pointer drag of `key` once the pointer moves a few pixels. A touch that could scroll the page starts it
   * after a long press instead, so a swipe still scrolls; `touch-action: none` on the pressed element drags at once.
   * The preview copies the closest element carrying `keyAttribute`, from the element the handler is bound on up.
   */
  onPointerDown: (event: PointerEvent, key: string) => void
  /**
   * Starts a keyboard drag of `key` on Enter or Space pressed on the element the handler is bound on. Bind it with
   * `@keydown.capture` to run before the element's own key handlers.
   */
  onKeyDown: (event: KeyboardEvent, key: string) => void
  /** Ends the current drag without dropping. */
  cancel: () => void
}

// The pointer travels this far (px) before a press becomes a drag, so a click stays a click
const DRAG_DISTANCE = 4

// A touch that could scroll must be held this long (ms) to drag, so a swipe still scrolls
const LONG_PRESS = 300

// Moving further (px) during the long press scrolls instead
const LONG_PRESS_TOLERANCE = 8

type Press = {
  key: string
  pointerId: number
  x: number
  y: number
  isLongPress: boolean
  /** The pressed item's element, which the preview copies. */
  source: HTMLElement | undefined
  timer?: ReturnType<typeof setTimeout>
}

type Session = {
  press: Press | undefined
  pointer: { x: number; y: number }
  frame: number
  scroller: HTMLElement | undefined
  preview: DragPreview | undefined
  /** The item element under the pointer; between items, the last one. */
  hovered: HTMLElement | undefined
  /** Sets the pointer drag's cursor over every element. */
  cursor: HTMLStyleElement | undefined
  isRtl: boolean
  targets: DropTarget[]
  index: number
  bodyStyle: { userSelect: string; webkitUserSelect: string } | undefined
  cleanups: (() => void)[]
}

const preventDefault = (event: Event) => event.preventDefault()

const isSameTarget = (a: DropTarget | undefined, b: DropTarget | undefined) =>
  a?.key === b?.key && a?.position === b?.position

/**
 * Reorders or moves items by pointer (mouse, pen, touch) or keyboard, without native drag and drop. Pointer drags find
 * the target under the pointer, scroll the container near its edges, carry a copy of the item beside the pointer, set
 * a grabbing cursor (`not-allowed` over items that refuse the drop) and stop on Escape; keyboard drags step through
 * `getTargets` with the arrow keys, Home and End, and announce each step through a live region.
 */
export const useDragAndDrop = (options: UseDragAndDropOptions): UseDragAndDropReturn => {
  const { t } = useLocale()

  const state = shallowReactive<DragState>({ mode: undefined, keys: [], target: undefined })
  const draggedKeys = computed(() => new Set(state.keys))

  const session: Session = {
    press: undefined,
    pointer: { x: 0, y: 0 },
    frame: 0,
    scroller: undefined,
    preview: undefined,
    hovered: undefined,
    cursor: undefined,
    isRtl: false,
    targets: [],
    index: -1,
    bodyStyle: undefined,
    cleanups: [],
  }

  const isVertical = () => (options.orientation ?? 'vertical') === 'vertical'

  const listen = <K extends keyof WindowEventMap>(
    type: K,
    listener: (event: WindowEventMap[K]) => void,
  ) => {
    const listenerOptions = { capture: true, passive: false }
    window.addEventListener(type, listener, listenerOptions)
    session.cleanups.push(() => window.removeEventListener(type, listener, listenerOptions))
  }

  const isValid = (target: DropTarget) =>
    !draggedKeys.value.has(target.key) && (options.canDrop?.(state.keys, target) ?? true)

  const setTarget = (target: DropTarget | undefined) => {
    if (!isSameTarget(target, state.target)) state.target = target
  }

  const begin = ({ mode, keys }: { mode: 'pointer' | 'keyboard'; keys: string[] }) => {
    const root = options.root()
    session.isRtl = !!root && getComputedStyle(root).direction === 'rtl'
    state.mode = mode
    state.keys = keys
    state.target = undefined
  }

  const end = () => {
    clearTimeout(session.press?.timer)
    cancelAnimationFrame(session.frame)
    session.preview?.remove()
    session.cursor?.remove()
    for (const cleanup of session.cleanups.splice(0)) cleanup()

    if (session.bodyStyle) {
      document.body.style.userSelect = session.bodyStyle.userSelect
      document.body.style.webkitUserSelect = session.bodyStyle.webkitUserSelect
    }

    Object.assign(session, {
      press: undefined,
      frame: 0,
      preview: undefined,
      hovered: undefined,
      cursor: undefined,
      bodyStyle: undefined,
      targets: [],
    })

    state.mode = undefined
    state.keys = []
    state.target = undefined
  }

  const describeTarget = (target: DropTarget) =>
    t(`dragAndDrop.${target.position}`, { item: options.getLabel(target.key) })

  const describeDrop = (keys: string[], target: DropTarget) => {
    const item =
      keys.length === 1
        ? options.getLabel(keys[0]!)
        : t('dragAndDrop.items', { count: keys.length })

    return t(MOVED_KEYS[target.position], { item, target: options.getLabel(target.key) })
  }

  // The pointer drag's target: the item under the pointer, split along the axis into before / (inside) / after.
  // `isRejected` tells an item that refuses the drop from no item at all. Between items nothing changes (`undefined`);
  // outside the root there is no target.
  const hitTest = (): { target: DropTarget | undefined; isRejected: boolean } | undefined => {
    const root = options.root()
    if (!root) return { target: undefined, isRejected: false }

    const { x, y } = clampCrossAxis(session.pointer, {
      rect: root.getBoundingClientRect(),
      isVertical: isVertical(),
    })

    const hit = document.elementFromPoint(x, y)
    if (!hit || !root.contains(hit)) {
      session.hovered = undefined
      return { target: undefined, isRejected: false }
    }

    const element = hit.closest<HTMLElement>(`[${options.keyAttribute}]`)
    const key = element?.getAttribute(options.keyAttribute)
    if (!element || key == null || !root.contains(element)) return undefined

    session.hovered = element
    const rect = element.getBoundingClientRect()
    const ratio = isVertical() ? (y - rect.top) / rect.height : (x - rect.left) / rect.width
    const progress = !isVertical() && session.isRtl ? 1 - ratio : ratio
    const position = pickPosition(progress, options.canDropInside?.(key) ?? false)
    const target = options.normalizeTarget?.({ key, position }) ?? { key, position }
    if (isValid(target)) return { target, isRejected: false }

    // Over the dragged items themselves nothing is refused: the drag just started there
    const isDragged = draggedKeys.value.has(key) || draggedKeys.value.has(target.key)

    return { target: undefined, isRejected: !isDragged }
  }

  // Over every element, whatever cursor it sets itself
  const setCursor = (cursor: 'grabbing' | 'not-allowed') => {
    session.cursor ??= document.head.appendChild(document.createElement('style'))
    const rule = `*, *::before, *::after { cursor: ${cursor} !important; }`
    if (session.cursor.textContent !== rule) session.cursor.textContent = rule
  }

  const track = () => {
    const hit = hitTest()
    if (hit) {
      setTarget(hit.target)
      setCursor(hit.isRejected ? 'not-allowed' : 'grabbing')
    }

    session.preview?.move({
      pointer: session.pointer,
      avoid: session.hovered?.getBoundingClientRect(),
    })
  }

  const autoScroll = () => {
    session.frame = 0
    const { scroller, pointer } = session
    if (state.mode !== 'pointer' || !scroller) return

    const isPage = scroller === document.scrollingElement
    const rect = isPage
      ? { top: 0, left: 0, bottom: window.innerHeight, right: window.innerWidth }
      : scroller.getBoundingClientRect()

    const delta = isVertical()
      ? getEdgeScroll(pointer.y, { start: rect.top, end: rect.bottom })
      : getEdgeScroll(pointer.x, { start: rect.left, end: rect.right })

    if (!delta) return

    scroller.scrollBy(isVertical() ? { top: delta } : { left: delta })
    track()
    session.frame = requestAnimationFrame(autoScroll)
  }

  const onDragMove = () => {
    track()
    if (!session.frame) session.frame = requestAnimationFrame(autoScroll)
  }

  // A drag ends in a click on the element under the pointer, which must not act on it
  const suppressClick = () => {
    const onClick = (event: MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()
    }

    window.addEventListener('click', onClick, { capture: true, once: true })
    setTimeout(() => window.removeEventListener('click', onClick, { capture: true }))
  }

  // Escape drops nothing. The button is still down, and its release must not click the item under it.
  const onPointerDragKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') return

    event.preventDefault()
    event.stopPropagation()
    end()
    window.addEventListener('pointerup', suppressClick, { capture: true, once: true })
  }

  const beginPointerDrag = () => {
    const press = session.press
    if (!press) return

    clearTimeout(press.timer)
    const keys = options.getDragKeys(press.key)
    if (!keys.length) return end()

    begin({ mode: 'pointer', keys })
    const root = options.root() ?? null
    session.scroller =
      getScrollParent(root, isVertical() ? 'y' : 'x') ??
      (document.scrollingElement as HTMLElement | null) ??
      undefined

    // No text selection while dragging, and no scrolling under a touch drag
    const { style } = document.body
    session.bodyStyle = { userSelect: style.userSelect, webkitUserSelect: style.webkitUserSelect }
    style.userSelect = 'none'
    style.webkitUserSelect = 'none'
    window.getSelection()?.removeAllRanges()
    listen('touchmove', preventDefault)
    listen('keydown', onPointerDragKeyDown)

    if (press.source) {
      session.preview = createDragPreview({
        source: press.source,
        pointer: session.pointer,
        count: keys.length,
        prepare: options.preparePreview,
      })
    }

    onDragMove()
  }

  const onPressMove = (event: PointerEvent) => {
    const press = session.press
    if (!press || event.pointerId !== press.pointerId) return

    session.pointer = { x: event.clientX, y: event.clientY }
    if (state.mode === 'pointer') return onDragMove()

    const distance = Math.hypot(event.clientX - press.x, event.clientY - press.y)
    if (press.isLongPress && distance > LONG_PRESS_TOLERANCE) return end()
    if (!press.isLongPress && distance >= DRAG_DISTANCE) beginPointerDrag()
  }

  const onPressEnd = (event: PointerEvent) => {
    if (event.pointerId !== session.press?.pointerId) return

    // `end()` resets the state, so read the drop first
    const mode = state.mode
    const keys = state.keys
    const target = state.target
    end()
    if (mode !== 'pointer') return

    suppressClick()
    if (event.type === 'pointerup' && target) options.onDrop(keys, target)
  }

  const onPointerDown = (event: PointerEvent, key: string) => {
    if (event.button !== 0 || state.mode || session.press) return

    const isLongPress = event.pointerType === 'touch' && !isPanBlocked(event)
    const pressed = event.currentTarget as HTMLElement
    session.press = {
      key,
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      isLongPress,
      source: pressed.closest<HTMLElement>(`[${options.keyAttribute}]`) ?? undefined,
    }

    session.pointer = { x: event.clientX, y: event.clientY }
    listen('pointermove', onPressMove)
    listen('pointerup', onPressEnd)
    listen('pointercancel', onPressEnd)

    // Links and images would start the browser's own drag and take the pointer away
    listen('dragstart', preventDefault)
    if (!isLongPress) return

    // The long press would open the context menu on touch devices
    listen('contextmenu', preventDefault)
    session.press.timer = setTimeout(beginPointerDrag, LONG_PRESS)
  }

  const revealTarget = (key: string) => {
    if (options.scrollTo) return options.scrollTo(key)

    const elements = options.root()?.querySelectorAll(`[${options.keyAttribute}]`) ?? []
    const element = [...elements].find((el) => el.getAttribute(options.keyAttribute) === key)
    element?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }

  // The first valid target from `from` on in `direction`, or -1
  const findValid = (from: number, direction: 1 | -1) => {
    for (let index = from; index >= 0 && index < session.targets.length; index += direction)
      if (isValid(session.targets[index]!)) return index

    return -1
  }

  // Moves the keyboard drag to the target at `index` and announces it; -1 keeps the current one
  const moveTo = (index: number) => {
    const target = session.targets[index]
    if (!target || target === state.target) return

    session.index = index
    setTarget(target)
    revealTarget(target.key)
    announce(describeTarget(target))
  }

  const cancelKeyboardDrag = () => {
    end()
    announce(t('dragAndDrop.cancelled'))
  }

  const dropKeyboardDrag = () => {
    const keys = state.keys
    const target = state.target
    if (!target) return cancelKeyboardDrag()

    // Read the labels before the drop moves or renames anything
    const message = describeDrop(keys, target)
    end()
    options.onDrop(keys, target)
    announce(message)
  }

  // The target was opened: its items are now targets too, and the current one stays put
  const expandKeyboardTarget = () => {
    const target = state.target
    if (!target || !options.expandTarget?.(target)) return

    void nextTick(() => {
      if (state.mode !== 'keyboard') return
      session.targets = options.getTargets(state.keys)
      session.index = session.targets.findIndex((item) => isSameTarget(item, state.target))
    })
  }

  const getStepKeys = () => {
    if (isVertical()) return { next: 'ArrowDown', previous: 'ArrowUp' }

    return session.isRtl
      ? { next: 'ArrowLeft', previous: 'ArrowRight' }
      : { next: 'ArrowRight', previous: 'ArrowLeft' }
  }

  const onDragKeyDown = (event: KeyboardEvent) => {
    // Tab leaves the drag, and focus moves on as usual
    if (event.key === 'Tab') return cancelKeyboardDrag()

    const { next, previous } = getStepKeys()
    const actions: Record<string, () => void> = {
      [next]: () => moveTo(findValid(session.index + 1, 1)),
      [previous]: () => moveTo(findValid(session.index - 1, -1)),
      Home: () => moveTo(findValid(0, 1)),
      End: () => moveTo(findValid(session.targets.length - 1, -1)),
      Enter: dropKeyboardDrag,
      ' ': dropKeyboardDrag,
      Escape: cancelKeyboardDrag,
    }

    // In a vertical list the inline arrow is free to open the target
    if (isVertical()) actions[session.isRtl ? 'ArrowLeft' : 'ArrowRight'] = expandKeyboardTarget

    const action = actions[event.key]

    // Other keys stop here too, so typeahead or expanding a folder can't change the items under the drag; shortcuts
    // with Ctrl, Alt or Meta still reach the page
    if (!action && (event.ctrlKey || event.altKey || event.metaKey)) return

    event.preventDefault()
    event.stopPropagation()

    // A held key repeats: only its first press drops
    if (isGrabKey(event.key) && event.repeat) return
    if (isGrabKey(event.key)) swallowKeyUp()
    action?.()
  }

  // Keys held while dragging must not reach the focused element's own handlers
  const onDragKeyUp = (event: KeyboardEvent) => {
    if (!isGrabKey(event.key)) return

    event.preventDefault()
    event.stopPropagation()
  }

  const onKeyDown = (event: KeyboardEvent, key: string) => {
    if (!isGrabKey(event.key) || state.mode || event.target !== event.currentTarget) return

    const keys = options.getDragKeys(key)
    if (!keys.length) return

    event.preventDefault()
    event.stopImmediatePropagation()

    // A held key repeats: only its first press picks up
    if (event.repeat) return

    begin({ mode: 'keyboard', keys })
    session.targets = options.getTargets(keys)

    // Arrows step from the dragged item's own place, so the first step moves it: its `before` target, or the one
    // just before its first target, which is the same spot. There is no target until the first step.
    const origin = session.targets.findIndex((target) => target.key === keys[0])
    session.index =
      session.targets[origin]?.position === 'before' ? origin : Math.max(origin, 0) - 1

    listen('keydown', onDragKeyDown)
    listen('keyup', onDragKeyUp)
    listen('pointerdown', cancelKeyboardDrag)

    const started =
      keys.length === 1
        ? t('dragAndDrop.started', { item: options.getLabel(keys[0]!) })
        : t('dragAndDrop.startedMany', { count: keys.length })

    announce(started)
  }

  const cancel = () => {
    if (state.mode === 'keyboard') return cancelKeyboardDrag()

    end()
  }

  if (getCurrentScope()) onScopeDispose(end)

  return {
    state: shallowReadonly(state),
    isDragging: (key) => draggedKeys.value.has(key),
    getDropPosition: (key) => (state.target?.key === key ? state.target.position : undefined),
    onPointerDown,
    onKeyDown,
    cancel,
  }
}
