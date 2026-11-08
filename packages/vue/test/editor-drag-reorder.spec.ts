import { describe, expect, it } from 'vitest'

import {
  getDropIndex,
  getShiftOffsets,
  isInsideContainer,
} from '@/components/editor-drag-handle/reorder'
import type { BlockLayout } from '@/components/editor-drag-handle/reorder'

// Three 20px blocks with 10px gaps, the first one dragged.
const layout: BlockLayout = {
  extents: [
    { top: 0, bottom: 20, isContainer: false },
    { top: 30, bottom: 50, isContainer: false },
    { top: 60, bottom: 80, isContainer: false },
  ],
  range: { from: 0, to: 1 },
}

describe('getDropIndex', () => {
  it('lands before the first block whose middle is below the pointer', () => {
    expect(getDropIndex(layout, 55)).toBe(2)
  })

  it('lands after the last block once the pointer passes its middle', () => {
    expect(getDropIndex(layout, 75)).toBe(3)
  })

  it('keeps the dragged blocks in place while the pointer stays next to them', () => {
    expect(getDropIndex(layout, 10)).toBe(0)
    expect(getDropIndex(layout, 35)).toBe(0)
  })
})

describe('isInsideContainer', () => {
  // The middle block is a 100px list.
  const withList: BlockLayout = {
    extents: [
      { top: 0, bottom: 20, isContainer: false },
      { top: 30, bottom: 130, isContainer: true },
      { top: 140, bottom: 160, isContainer: false },
    ],
    range: { from: 0, to: 1 },
  }

  it('drops inside a container away from its edges', () => {
    expect(isInsideContainer(withList, 80)).toBe(true)
  })

  it('drops next to a container near its top or bottom edge', () => {
    expect(isInsideContainer(withList, 40)).toBe(false)
    expect(isInsideContainer(withList, 120)).toBe(false)
  })

  it('never drops inside a block that holds only text', () => {
    expect(isInsideContainer(layout, 40)).toBe(false)
  })
})

describe('getShiftOffsets', () => {
  it('slides the passed blocks up by the dragged height plus a gap and drops the dragged block below them', () => {
    expect(getShiftOffsets(layout, 2)).toEqual([30, -30, 0])
  })

  it('keeps one gap before the dragged block when it lands after the last block', () => {
    expect(getShiftOffsets(layout, 3)).toEqual([60, -30, -30])
  })

  it('slides the passed blocks down when the dragged block moves up', () => {
    const last: BlockLayout = { ...layout, range: { from: 2, to: 3 } }

    expect(getShiftOffsets(last, 0)).toEqual([30, 30, -60])
  })

  it('moves nothing when the dragged blocks stay in place', () => {
    expect(getShiftOffsets(layout, 0)).toEqual([0, 0, 0])
  })
})
