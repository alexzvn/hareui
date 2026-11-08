/** A block's vertical extent in pixels, measured from the top of its parent. */
export type BlockExtent = {
  top: number
  bottom: number
  /** Holds other blocks, like a list or a quote, so a drop can also land inside it. */
  isContainer: boolean
}

/** The blocks of one parent before a drag, and which of them are dragged. */
export type BlockLayout = {
  extents: BlockExtent[]
  /** The dragged blocks: indices `from` up to, but not including, `to`. */
  range: { from: number; to: number }
}

// The top of the slot before block `index`. Past the last block, one block gap below it, so the dragged blocks keep
// the spacing they had.
const getSlotTop = (extents: BlockExtent[], index: number) => {
  if (index < extents.length) return extents[index].top

  const last = extents[extents.length - 1]
  const gap = extents.length > 1 ? last.top - extents[extents.length - 2].bottom : 0

  return last.bottom + gap
}

// Within this many pixels of a container's top or bottom edge, a drop still lands before or after the container.
const CONTAINER_EDGE = 16

/**
 * Whether the pointer, `y` pixels below the parent's top, is over a container block away from its edges, where a drop
 * goes inside the container rather than next to it.
 */
export const isInsideContainer = ({ extents, range }: BlockLayout, y: number) =>
  extents.some((extent, i) => {
    const isDragged = i >= range.from && i < range.to
    if (isDragged || !extent.isContainer) return false

    const edge = Math.min(CONTAINER_EDGE, (extent.bottom - extent.top) / 4)

    return y > extent.top + edge && y < extent.bottom - edge
  })

/**
 * The index of the block the dragged blocks would land before, in the order before the drag, for a pointer `y` pixels
 * below the parent's top. A pointer over the dragged blocks themselves gives `range.from`: they stay put.
 */
export const getDropIndex = ({ extents, range }: BlockLayout, y: number) => {
  const index = extents.findIndex((extent, i) => {
    const isDragged = i >= range.from && i < range.to

    return !isDragged && y < (extent.top + extent.bottom) / 2
  })

  const dropIndex = index < 0 ? extents.length : index

  return dropIndex >= range.from && dropIndex <= range.to ? range.from : dropIndex
}

/**
 * How far each block moves, in pixels, to preview the dragged blocks landing before block `index`: the dragged blocks
 * jump to that slot and the blocks they pass slide over by the dragged blocks' height plus one gap.
 */
export const getShiftOffsets = ({ extents, range }: BlockLayout, index: number) => {
  const isDown = index > range.to
  const isUp = index < range.from
  const span = getSlotTop(extents, range.to) - getSlotTop(extents, range.from)
  const draggedStart = isDown ? range.to : range.from
  const draggedOffset =
    isDown || isUp ? getSlotTop(extents, index) - getSlotTop(extents, draggedStart) : 0

  return extents.map((_, i) => {
    if (i >= range.from && i < range.to) return draggedOffset
    if (isDown && i >= range.to && i < index) return -span
    if (isUp && i >= index && i < range.from) return span

    return 0
  })
}
