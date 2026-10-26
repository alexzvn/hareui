import type { ComputedRef } from 'vue'

import type { ResolvedAxis } from './cartesian.types'
import type { ChartContext } from './context'
import type { ChartInteraction, ChartOffset, ChartPoint } from './types'

const isOutsidePlot = (plot: ChartOffset, point: ChartPoint) =>
  point.x < plot.left ||
  point.x > plot.left + plot.width ||
  point.y < plot.top ||
  point.y > plot.top + plot.height

// The datum whose category position is closest to `along`; the first one wins a tie.
const getNearestIndex = (axis: ResolvedAxis, options: { along: number; count: number }) => {
  let nearest = 0
  let distance = Infinity

  for (let index = 0; index < options.count; index++) {
    const current = Math.abs(axis.position(index) - options.along)

    if (current < distance) {
      distance = current
      nearest = index
    }
  }

  return nearest
}

/** Axis-triggered hover: the datum nearest to the pointer along the category axis. */
export const createCartesianInteraction = (options: {
  chart: ChartContext
  offset: ComputedRef<ChartOffset>
  categoryAxis: ComputedRef<ResolvedAxis>
  isHorizontal: ComputedRef<boolean>
}): ChartInteraction => {
  const { chart, offset, categoryAxis, isHorizontal } = options

  return {
    trigger: 'axis',
    count: () => chart.data.value.length,
    hitTest(x, y) {
      if (isOutsidePlot(offset.value, { x, y })) return null

      const axis = categoryAxis.value
      const count = chart.data.value.length
      if (!count) return null

      const index = getNearestIndex(axis, { along: isHorizontal.value ? x : y, count })
      const position = axis.position(index)
      const coordinate: ChartPoint = isHorizontal.value ? { x: position, y } : { x, y: position }

      return { index, coordinate }
    },
    coordinateOf(index) {
      if (index < 0 || index >= chart.data.value.length) return null

      const plot = offset.value
      const position = categoryAxis.value.position(index)

      return isHorizontal.value
        ? { x: position, y: plot.top + plot.height / 2 }
        : { x: plot.left + plot.width / 2, y: position }
    },
  }
}
