import type { MaybeRefOrGetter, Ref, ShallowRef } from 'vue'
import {
  computed,
  getCurrentScope,
  onScopeDispose,
  onWatcherCleanup,
  ref,
  toValue,
  watch,
} from 'vue'

import type { DashboardStorage, DashboardUnit } from './useDashboard'

/** Reactive options of `useResizable`: size bounds, collapse behavior and persistence. */
export type UseResizableOptions = {
  /**
   * The side of the layout the panel sits on. The resize handle sits on the opposite edge: a
   * `left` panel is resized from its right edge.
   * @defaultValue 'left'
   */
  side?: 'left' | 'right'
  /**
   * The smallest size, in `unit`, a drag or keyboard resize can reach.
   * @defaultValue 0
   */
  minSize?: number
  /**
   * The largest size, in `unit`, a drag or keyboard resize can reach.
   * @defaultValue 100
   */
  maxSize?: number
  /**
   * The initial size in `unit` when nothing is persisted; double-clicking the handle restores it.
   * @defaultValue 0
   */
  defaultSize?: number
  /**
   * Whether the panel can be resized by dragging or with the keyboard.
   * @defaultValue true
   */
  resizable?: boolean
  /**
   * Whether the panel collapses to `collapsedSize` when dragged near it or on `Enter`.
   * @defaultValue false
   */
  collapsible?: boolean
  /**
   * The size in `unit` while collapsed.
   * @defaultValue 0
   */
  collapsedSize?: number
  /**
   * Where the size and collapsed state are persisted: a cookie, `localStorage`, or a custom adapter.
   * @defaultValue 'cookie'
   */
  storage?: DashboardStorage
  /**
   * Whether the size and collapsed state are persisted across reloads.
   * @defaultValue true
   */
  persistent?: boolean
  /**
   * The unit of every size option and of the returned `size`.
   * @defaultValue '%'
   */
  unit?: DashboardUnit
}

/** State and event handlers returned by `useResizable`, to bind on the panel and its resize handle. */
export type UseResizableReturn = {
  /** The rendered size in `unit`: `collapsedSize` while collapsed. */
  size: Readonly<Ref<number>>
  /** Whether a pointer, mouse or touch drag is in progress. */
  isDragging: Readonly<Ref<boolean>>
  /** Whether the panel is collapsed to `collapsedSize`. */
  isCollapsed: Readonly<Ref<boolean>>
  /** Starts a pointer drag; bind on the resize handle's `pointerdown`. */
  onPointerDown: (e: PointerEvent) => void
  /** Starts a mouse drag; for handles that only receive `mousedown`. */
  onMouseDown: (e: MouseEvent) => void
  /** Starts a touch drag; for handles that only receive `touchstart`. */
  onTouchStart: (e: TouchEvent) => void
  /** Expands the panel and restores `defaultSize`. */
  onDoubleClick: (e: MouseEvent) => void
  /** Arrow keys resize (Shift for larger steps), `Home`/`End` jump to the bounds, `Enter` toggles collapse. */
  onKeyDown: (e: KeyboardEvent) => void
  /** Collapses (`true`), expands (`false`) or toggles (no argument) a `collapsible` panel. */
  collapse: (value?: boolean) => void
  /** `aria-value*` + keyboard attributes for a `role="separator"` handle; `hidden` while collapsed to a zero width. */
  handleAttrs: Readonly<
    Ref<{
      tabindex: 0
      hidden: boolean
      'aria-orientation': 'vertical'
      'aria-valuenow': number
      'aria-valuemin': number
      'aria-valuemax': number
    }>
  >
}

type StoredState = {
  size?: number
  collapsed?: boolean
}

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

const readCookie = (key: string): string | undefined => {
  if (typeof document === 'undefined') return undefined
  const name = `${encodeURIComponent(key)}=`
  for (const part of document.cookie.split(';')) {
    const entry = part.trim()
    if (entry.startsWith(name)) return decodeURIComponent(entry.slice(name.length))
  }

  return undefined
}

const readRawStorage = (storage: DashboardStorage, key: string): string | null | undefined => {
  if (storage === 'cookie') return readCookie(key)
  if (storage !== 'local') return storage.getItem(key)

  return typeof localStorage === 'undefined' ? undefined : localStorage.getItem(key)
}

/** Reads a persisted `{ size, collapsed }` entry. Missing, unparsable or malformed data yields `undefined` fields (never throws). */
export const readDashboardStorage = (
  storage: DashboardStorage,
  key: string,
): StoredState | undefined => {
  let raw: string | null | undefined
  try {
    raw = readRawStorage(storage, key)
  } catch {
    return undefined
  }

  if (!raw) return undefined

  try {
    const value = JSON.parse(raw)
    if (!value || typeof value !== 'object') return undefined

    return {
      size: Number.isFinite(value.size) ? value.size : undefined,
      collapsed: typeof value.collapsed === 'boolean' ? value.collapsed : undefined,
    }
  } catch {
    return undefined
  }
}

const writeRawStorage = (storage: DashboardStorage, { key, raw }: { key: string; raw: string }) => {
  if (storage === 'cookie') {
    if (typeof document === 'undefined') return
    document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(raw)}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`

    return
  }

  if (storage !== 'local') {
    storage.setItem(key, raw)

    return
  }

  if (typeof localStorage !== 'undefined') localStorage.setItem(key, raw)
}

/** Writes a `{ size, collapsed }` entry. Storage failures (quota, blocked cookies) are swallowed. */
export const writeDashboardStorage = (
  storage: DashboardStorage,
  { key, value }: { key: string; value: { size: number; collapsed: boolean } },
): void => {
  try {
    writeRawStorage(storage, { key, raw: JSON.stringify(value) })
  } catch {
    // Persistence is best-effort: a full quota or blocked cookies must not break resizing.
  }
}

/** Dragging closer than this (in `unit`) to the collapsed size collapses a `collapsible` panel. */
const COLLAPSE_THRESHOLD: Record<DashboardUnit, number> = { '%': 4, rem: 4, px: 64 }

/** Keyboard resize step in `unit`. Shift multiplies it by 5. */
const KEYBOARD_STEP: Record<DashboardUnit, number> = { '%': 1, rem: 1, px: 16 }

type DragSession = {
  startX: number
  startWidth: number
  parentWidth: number
  rootFontSize: number
  rtl: boolean
}

type UseResizableSetup = {
  /** Persistence key (cookie or storage entry name). */
  key: string
  /** Reactive resize options. */
  options: MaybeRefOrGetter<UseResizableOptions>
  /** The resized panel (the component's `useTemplateRef`). */
  element: Readonly<ShallowRef<HTMLElement | null>>
  initialCollapsed?: boolean
}

/**
 * Pointer/keyboard resizing with collapse and persistence for a dashboard sidebar or panel.
 *
 * The drag session reads layout once on press (`getBoundingClientRect`, root font size, direction) and then
 * only writes: pointer moves are coalesced into one reactive update per animation frame. While dragging,
 * `body` gets `user-select: none` and a `col-resize` cursor; nothing is persisted until the drag ends.
 */
export const useResizable = ({
  key,
  options,
  element: el,
  initialCollapsed = false,
}: UseResizableSetup): UseResizableReturn => {
  const opts = computed(() => {
    const value = toValue(options)
    return {
      side: value.side ?? 'left',
      minSize: value.minSize ?? 0,
      maxSize: value.maxSize ?? 100,
      defaultSize: value.defaultSize ?? 0,
      resizable: value.resizable ?? true,
      collapsible: value.collapsible ?? false,
      collapsedSize: value.collapsedSize ?? 0,
      storage: value.storage ?? 'cookie',
      persistent: value.persistent ?? true,
      unit: value.unit ?? '%',
    }
  })

  const clamp = (value: number) => Math.min(opts.value.maxSize, Math.max(opts.value.minSize, value))
  const persists = () => opts.value.persistent && (opts.value.resizable || opts.value.collapsible)

  // Read synchronously so the very first render already has the persisted size (no flash).
  const stored = persists() ? readDashboardStorage(opts.value.storage, key) : undefined
  const size = ref(
    stored?.size !== undefined && opts.value.resizable
      ? clamp(stored.size)
      : opts.value.defaultSize,
  )

  const isCollapsed = ref(opts.value.collapsible ? (stored?.collapsed ?? initialCollapsed) : false)
  const isDragging = ref(false)
  const currentSize = computed(() => (isCollapsed.value ? opts.value.collapsedSize : size.value))

  const persist = () => {
    if (!persists()) return

    writeDashboardStorage(opts.value.storage, {
      key,
      value: { size: size.value, collapsed: isCollapsed.value },
    })
  }

  const setCollapsed = (value: boolean) => {
    if (!opts.value.collapsible || value === isCollapsed.value) return
    isCollapsed.value = value
    if (!isDragging.value) persist()
  }

  const collapse = (value?: boolean) => {
    setCollapsed(value ?? !isCollapsed.value)
  }

  const setSize = (value: number) => {
    size.value = value
    if (!isDragging.value) persist()
  }

  // --- pointer dragging -------------------------------------------------------------------------

  let session: DragSession | undefined
  let detach: (() => void) | undefined
  let frame = 0
  let pendingX = 0
  let bodyStyle: { userSelect: string; cursor: string } | undefined

  const sizeFromPointer = (clientX: number): number => {
    const s = session!
    const toward = opts.value.side === 'left' ? clientX - s.startX : s.startX - clientX
    const width = s.startWidth + (s.rtl ? -toward : toward)
    if (opts.value.unit === 'rem') return width / s.rootFontSize
    if (opts.value.unit === 'px') return width

    return (width / s.parentWidth) * 100
  }

  const applyPointer = (clientX: number) => {
    if (!session) return
    const value = sizeFromPointer(clientX)
    if (
      opts.value.collapsible &&
      value < opts.value.collapsedSize + COLLAPSE_THRESHOLD[opts.value.unit]
    ) {
      setCollapsed(true)
      return
    }

    setCollapsed(false)
    size.value = clamp(value)
  }

  const schedule = (clientX: number) => {
    pendingX = clientX
    if (frame) return

    frame = requestAnimationFrame(() => {
      frame = 0
      applyPointer(pendingX)
    })
  }

  const finish = () => {
    if (!session) return

    if (frame) {
      cancelAnimationFrame(frame)
      frame = 0
      applyPointer(pendingX)
    }

    session = undefined
    isDragging.value = false
    detach?.()
    detach = undefined

    if (bodyStyle) {
      document.body.style.userSelect = bodyStyle.userSelect
      document.body.style.cursor = bodyStyle.cursor
      bodyStyle = undefined
    }

    persist()
  }

  const start = (
    startX: number,
    attach: (move: (clientX: number) => void, end: () => void) => () => void,
  ): boolean => {
    const node = el.value
    if (!node || !opts.value.resizable || session) return false
    const startWidth = node.getBoundingClientRect().width
    if (!startWidth) return false

    session = {
      startX,
      startWidth,
      parentWidth: node.parentElement?.getBoundingClientRect().width || 1,
      rootFontSize:
        opts.value.unit === 'rem'
          ? Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
          : 1,
      rtl: getComputedStyle(node).direction === 'rtl',
    }

    isDragging.value = true
    bodyStyle = { userSelect: document.body.style.userSelect, cursor: document.body.style.cursor }
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'col-resize'
    detach = attach(schedule, finish)

    return true
  }

  const onPointerDown = (e: PointerEvent) => {
    if (!el.value || !opts.value.resizable || (e.pointerType === 'mouse' && e.button !== 0)) return
    e.preventDefault()
    e.stopPropagation()
    const target = e.currentTarget as HTMLElement | null
    const id = e.pointerId
    start(e.clientX, (move, end) => {
      try {
        target?.setPointerCapture?.(id)
      } catch {
        // Capture is an enhancement: the document listeners below still track the drag without it.
      }

      const onMove = (ev: PointerEvent) => {
        if (ev.pointerId === id) move(ev.clientX)
      }

      const onEnd = (ev: PointerEvent) => {
        if (ev.pointerId === id) end()
      }

      document.addEventListener('pointermove', onMove)
      document.addEventListener('pointerup', onEnd)
      document.addEventListener('pointercancel', onEnd)

      return () => {
        document.removeEventListener('pointermove', onMove)
        document.removeEventListener('pointerup', onEnd)
        document.removeEventListener('pointercancel', onEnd)

        try {
          target?.releasePointerCapture?.(id)
        } catch {
          // The pointer may already be released (element removed or pointer cancelled).
        }
      }
    })
  }

  // The `mousedown`/`touchstart` slot props. Browsers fire these after `pointerdown`, and
  // `pointerdown`'s preventDefault suppresses the compat events, so a handle bound to all three still drags once.
  const onMouseDown = (e: MouseEvent) => {
    if (!el.value || !opts.value.resizable || e.button !== 0) return
    e.preventDefault()
    e.stopPropagation()

    start(e.clientX, (move, end) => {
      const onMove = (ev: MouseEvent) => move(ev.clientX)
      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseup', end)

      return () => {
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', end)
      }
    })
  }

  const onTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0]
    if (!el.value || !opts.value.resizable || !touch) return
    e.preventDefault()
    e.stopPropagation()

    start(touch.clientX, (move, end) => {
      const onMove = (ev: TouchEvent) => {
        const t = ev.touches[0]
        if (t) {
          ev.preventDefault()
          move(t.clientX)
        }
      }

      document.addEventListener('touchmove', onMove, { passive: false })
      document.addEventListener('touchend', end)
      document.addEventListener('touchcancel', end)

      return () => {
        document.removeEventListener('touchmove', onMove)
        document.removeEventListener('touchend', end)
        document.removeEventListener('touchcancel', end)
      }
    })
  }

  const onDoubleClick = (e: MouseEvent) => {
    if (!el.value || !opts.value.resizable) return
    e.preventDefault()
    e.stopPropagation()
    isCollapsed.value = false
    setSize(opts.value.defaultSize)
  }

  // --- keyboard ---------------------------------------------------------------------------------

  const onKeyDown = (e: KeyboardEvent) => {
    const node = el.value
    if (!node || !opts.value.resizable) return
    const { unit, minSize, maxSize, collapsible } = opts.value

    if (e.key === 'Enter') {
      if (collapsible) {
        e.preventDefault()
        collapse()
      }

      return
    }

    if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault()
      setCollapsed(false)
      setSize(e.key === 'Home' ? minSize : maxSize)

      return
    }

    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    const isRtl = getComputedStyle(node).direction === 'rtl'
    const isTowardsEnd = (e.key === 'ArrowRight') !== isRtl
    const grows = opts.value.side === 'left' ? isTowardsEnd : !isTowardsEnd
    const step = KEYBOARD_STEP[unit] * (e.shiftKey ? 5 : 1)

    if (grows) {
      if (isCollapsed.value) {
        setCollapsed(false)

        return
      }

      setSize(clamp(size.value + step))

      return
    }

    if (isCollapsed.value) return
    const next = size.value - step
    if (collapsible && next < minSize) {
      setCollapsed(true)

      return
    }

    setSize(clamp(next))
  }

  // A drag can't start from a zero-width element (there is nothing to grab or measure), so the
  // handle hides while a collapsed element renders 0px wide (off-canvas); the toggle / collapse button reopens it.
  // The rendered width, not `collapsedSize`, decides: the default rail is 48px (a CSS minimum) at `collapsedSize: 0`.
  const isZeroWidth = ref(false)

  const observeWidth = (node: HTMLElement | null) => {
    if (!node || typeof ResizeObserver === 'undefined') return

    const observer = new ResizeObserver(() => {
      isZeroWidth.value = node.getBoundingClientRect().width === 0
    })

    observer.observe(node)
    onWatcherCleanup(() => observer.disconnect())
  }

  watch(el, observeWidth, { immediate: true })

  const handleAttrs = computed(() => ({
    tabindex: 0 as const,
    hidden: isCollapsed.value && isZeroWidth.value,
    'aria-orientation': 'vertical' as const,
    'aria-valuenow': Math.round(currentSize.value * 100) / 100,
    'aria-valuemin': opts.value.collapsible ? opts.value.collapsedSize : opts.value.minSize,
    'aria-valuemax': opts.value.maxSize,
  }))

  if (getCurrentScope()) onScopeDispose(finish)

  return {
    size: currentSize,
    isDragging,
    isCollapsed,
    onPointerDown,
    onMouseDown,
    onTouchStart,
    onDoubleClick,
    onKeyDown,
    collapse,
    handleAttrs,
  }
}
