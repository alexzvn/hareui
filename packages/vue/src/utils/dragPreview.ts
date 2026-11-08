type Point = { x: number; y: number }

type Box = { top: number; bottom: number }

/** A floating copy of a dragged element that follows the pointer. */
export type DragPreview = {
  /**
   * Moves the preview on the next frame: below and after `pointer`, and below `avoid` (the item under the pointer),
   * so it never covers the drop indicator.
   */
  move: (position: { pointer: Point; avoid?: Box }) => void
  remove: () => void
}

type CreateDragPreviewOptions = {
  /** The dragged element to copy. */
  source: HTMLElement
  pointer: Point
  /** The number of dragged items; more than one shows a count badge. */
  count: number
  /** Adjusts the copy before it shows, e.g. to drop what only makes sense in place. */
  prepare?: (copy: HTMLElement) => void
}

// The preview's corner sits this far (px) below and after the pointer...
const POINTER_GAP = 14

// ...and this far below the item under the pointer
const ITEM_GAP = 4

// It keeps this distance (px) from the viewport's edges
const VIEWPORT_GAP = 8

const MAX_WIDTH = 320

// The fade over a copy cut off at `MAX_WIDTH`
const FADE_WIDTH = 32

// Inline, so the preview works without the library's CSS; above everything, and never under the pointer, so drop
// targets are still found below it
const PREVIEW_STYLE = {
  position: 'fixed',
  top: '0',
  left: '0',
  zIndex: '2147483647',
  margin: '0',
  boxSizing: 'border-box',
  pointerEvents: 'none',
  opacity: '0.95',
  willChange: 'transform',
}

// A border as well as the shadow: in dark mode the shadow barely shows, and the background matches the page's surfaces
const FRAME_STYLE = {
  height: '100%',
  boxSizing: 'border-box',
  overflow: 'hidden',
  border: '1px solid var(--border)',
  background: 'var(--overlay)',
  boxShadow: 'var(--overlay-shadow)',
}

const BADGE_SIZE = 20

const BADGE_STYLE = {
  position: 'absolute',
  minWidth: `${BADGE_SIZE}px`,
  height: `${BADGE_SIZE}px`,
  padding: '0 6px',
  boxSizing: 'border-box',
  borderRadius: '9999px',
  background: 'var(--accent)',
  color: 'var(--accent-foreground)',
  fontSize: '12px',
  fontWeight: '600',
  lineHeight: `${BADGE_SIZE}px`,
  textAlign: 'center',
}

// Text styles the copy inherited from the source's ancestors, which it leaves behind in `document.body`
const INHERITED_STYLES = [
  'color',
  'direction',
  'fontFamily',
  'fontSize',
  'fontStyle',
  'fontWeight',
  'letterSpacing',
  'lineHeight',
] as const

const TABLE_PARTS = new Set(['TR', 'TD', 'TH'])

// Variables the source's ancestors set, like a component's indent, which the copy would lose too
const copyScopedVariables = ({ from, to }: { from: CSSStyleDeclaration; to: HTMLElement }) => {
  const rootStyle = getComputedStyle(document.documentElement)
  for (let index = 0; index < from.length; index++) {
    const name = from.item(index)
    if (!name.startsWith('--')) continue

    const value = from.getPropertyValue(name)
    if (value !== rootStyle.getPropertyValue(name)) to.style.setProperty(name, value)
  }
}

// Duplicate ids would confuse lookups by id, and a copied radio with the same name would uncheck the original
const createCopy = (source: HTMLElement) => {
  const copy = source.cloneNode(true) as HTMLElement
  for (const element of [copy, ...copy.querySelectorAll('[id], [name]')]) {
    element.removeAttribute('id')
    element.removeAttribute('name')
  }

  copy.removeAttribute('data-dragging')
  copy.removeAttribute('data-drop-target')

  return copy
}

// A row or cell only lays out inside a table: wrap the copy in one, at the source's width and column widths. A copy
// wider than the preview fades out at its end.
const wrapInTable = ({
  source,
  copy,
  width,
}: {
  source: HTMLElement
  copy: HTMLElement
  width: number
}) => {
  const isRow = source.tagName === 'TR'
  const row = isRow ? copy : document.createElement('tr')
  if (!isRow) row.append(copy)

  const sourceCells = isRow ? [...source.children] : [source]
  const cells = [...row.children] as HTMLElement[]
  cells.forEach((cell, index) => {
    const cellWidth = sourceCells[index]?.getBoundingClientRect().width
    if (cellWidth !== undefined) cell.style.width = `${cellWidth}px`
  })

  const table = document.createElement('table')
  Object.assign(table.style, {
    width: `${width}px`,
    height: '100%',
    tableLayout: 'fixed',
    borderCollapse: 'collapse',
  })

  if (width > MAX_WIDTH) {
    const end = getComputedStyle(source).direction === 'rtl' ? 'left' : 'right'
    table.style.maskImage = `linear-gradient(to ${end}, #000 ${MAX_WIDTH - FADE_WIDTH}px, transparent ${MAX_WIDTH}px)`
  }

  table.append(row)

  return table
}

const createBadge = (count: number) => {
  const badge = document.createElement('span')
  badge.dataset.slot = 'drag-preview-count'
  badge.textContent = String(count)
  Object.assign(badge.style, BADGE_STYLE)

  return badge
}

/**
 * Shows a raised copy of `source` in `document.body` that follows the pointer, at most `MAX_WIDTH` wide, with a count
 * badge on the corner nearest the pointer when several items are dragged. It stays hidden from screen readers and
 * from the pointer.
 */
export const createDragPreview = ({
  source,
  pointer,
  count,
  prepare,
}: CreateDragPreviewOptions) => {
  const rect = source.getBoundingClientRect()
  const sourceStyle = getComputedStyle(source)
  const isTablePart = TABLE_PARTS.has(source.tagName)

  const preview = document.createElement('div')
  preview.dataset.slot = 'drag-preview'
  preview.setAttribute('aria-hidden', 'true')
  preview.inert = true

  // A table part keeps its columns and is cut off; anything else shrinks to its content
  Object.assign(preview.style, PREVIEW_STYLE, {
    width: isTablePart ? `${Math.min(rect.width, MAX_WIDTH)}px` : 'fit-content',
    maxWidth: `${Math.min(rect.width, MAX_WIDTH)}px`,
    height: `${rect.height}px`,
  })

  for (const property of INHERITED_STYLES) preview.style[property] = sourceStyle[property]
  copyScopedVariables({ from: sourceStyle, to: preview })

  const frame = document.createElement('div')
  const hasRadius = parseFloat(sourceStyle.borderTopLeftRadius) > 0
  Object.assign(frame.style, FRAME_STYLE, {
    borderRadius: hasRadius ? sourceStyle.borderRadius : 'var(--radius)',
  })

  const copy = createCopy(source)
  prepare?.(copy)

  if (!isTablePart) {
    Object.assign(copy.style, {
      width: '100%',
      height: '100%',
      margin: '0',
      boxSizing: 'border-box',
    })
  }

  frame.append(isTablePart ? wrapInTable({ source, copy, width: rect.width }) : copy)
  preview.append(frame)
  const badge = count > 1 ? createBadge(count) : undefined
  if (badge) preview.append(badge)

  document.body.append(preview)
  const size = preview.getBoundingClientRect()

  let next: { pointer: Point; avoid?: Box } = { pointer }
  let pending = 0

  // Below and after the pointer, or above it near the viewport's bottom, never past the viewport's sides
  const place = () => {
    pending = 0
    const { pointer: at, avoid } = next

    const maxLeft = window.innerWidth - VIEWPORT_GAP - size.width
    const left = Math.max(VIEWPORT_GAP, Math.min(at.x + POINTER_GAP, maxLeft))

    const below = Math.max(at.y + POINTER_GAP, (avoid?.bottom ?? -Infinity) + ITEM_GAP)
    const above = Math.min(at.y - POINTER_GAP, (avoid?.top ?? Infinity) - ITEM_GAP) - size.height
    const isAbove = below + size.height > window.innerHeight - VIEWPORT_GAP && above >= VIEWPORT_GAP
    const top = isAbove ? above : below
    preview.style.transform = `translate(${left}px, ${top}px)`

    if (!badge) return

    const isPointerLeft = at.x < left + size.width / 2
    const corner = `${-BADGE_SIZE / 2}px`
    Object.assign(badge.style, {
      top: isAbove ? '' : corner,
      bottom: isAbove ? corner : '',
      left: isPointerLeft ? corner : '',
      right: isPointerLeft ? '' : corner,
    })
  }

  place()

  return {
    move: (position) => {
      next = position
      if (!pending) pending = requestAnimationFrame(place)
    },
    remove: () => {
      cancelAnimationFrame(pending)
      preview.remove()
    },
  } satisfies DragPreview
}
