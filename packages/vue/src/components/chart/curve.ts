import type { CurveFactory } from 'd3-shape'
import {
  curveBasis,
  curveBasisClosed,
  curveBasisOpen,
  curveBumpX,
  curveBumpY,
  curveLinear,
  curveLinearClosed,
  curveMonotoneX,
  curveMonotoneY,
  curveNatural,
  curveStep,
  curveStepAfter,
  curveStepBefore,
} from 'd3-shape'

import type { ChartCurveType, ChartLayout } from './types'

const curves: Record<Exclude<ChartCurveType, 'monotone' | 'bump'>, CurveFactory> = {
  basis: curveBasis,
  basisClosed: curveBasisClosed,
  basisOpen: curveBasisOpen,
  bumpX: curveBumpX,
  bumpY: curveBumpY,
  linear: curveLinear,
  linearClosed: curveLinearClosed,
  natural: curveNatural,
  monotoneX: curveMonotoneX,
  monotoneY: curveMonotoneY,
  step: curveStep,
  stepBefore: curveStepBefore,
  stepAfter: curveStepAfter,
}

/** d3 curve for a curve `type`; `monotone` and `bump` follow the chart layout. */
export function curveFactory(
  type: ChartCurveType | CurveFactory = 'linear',
  layout: ChartLayout = 'horizontal',
): CurveFactory {
  if (typeof type === 'function') return type
  if (type === 'monotone' || type === 'bump') {
    const vertical = layout === 'vertical'
    if (type === 'monotone') return vertical ? curveMonotoneY : curveMonotoneX
    return vertical ? curveBumpY : curveBumpX
  }
  return curves[type] ?? curveLinear
}
