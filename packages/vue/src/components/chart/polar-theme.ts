/** Theme slots of the polar parts; PieChart, RadarChart and RadialChart themes spread them next to `chartSlots`. */
export const polarSlots = {
  /** `ChartPolarGrid` polygons, circles and spokes. */
  polarGrid: 'fill-none stroke-muted [stroke-opacity:0.2]',
  /** `ChartPolarAngleAxis` labels around the chart. */
  angleTick: 'fill-muted text-[11px]',
  /** `ChartPolarRadiusAxis` line. */
  radiusAxisLine: 'fill-none stroke-muted/40',
  /** `ChartPolarRadiusAxis` labels. */
  radiusTick: 'fill-muted text-[10px]',
  /** Pie slices and radial bars. Unlike SVG, no stroke unless the series sets one. */
  sector: 'outline-none',
  /** Track behind radial bars (`background` prop). */
  radialBarBackground: 'fill-default',
  /** `ChartRadar` outline and fill. */
  radar: '',
}

/** `#center` content of PieChart and RadialChart: HTML centered on the chart center. */
export const polarCenterSlots = {
  center:
    'pointer-events-none absolute flex w-max -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center text-center',
}

export type PolarSlot = keyof typeof polarSlots
