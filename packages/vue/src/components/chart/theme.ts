/** Theme slots shared by every chart root; root themes spread them and override what differs. */
export const chartSlots = {
  base: 'relative w-full',
  surface: 'block overflow-visible rounded-sm outline-none focus-visible:status-focused',
  overlay: 'pointer-events-none absolute inset-0',
  grid: 'stroke-muted [stroke-opacity:0.15]',
  axis: '',
  // Axis and tick lines are hidden; set `stroke-*` here to show them.
  axisLine: 'stroke-none',
  tickLine: 'stroke-none',
  tick: 'fill-muted text-[10px]',
  /** Hover cursor: a dashed line (`data-kind="line"`), or a translucent band (`data-kind="band"`) in bar charts. */
  cursor: 'pointer-events-none data-[kind=line]:fill-none data-[kind=line]:stroke-muted data-[kind=line]:[stroke-dasharray:4_4] data-[kind=line]:[stroke-width:1px] data-[kind=band]:fill-current data-[kind=band]:stroke-none data-[kind=band]:opacity-5',
  /** Group of one series (area, line, bars, pie, radar, …). */
  series: '',
  dot: '',
  activeDot: 'stroke-surface [stroke-width:2px]',
  /** `ChartLabel` text. */
  label: 'fill-muted text-[10px]',
  // Positioned with a translate in SVG (physical) coordinates.
  tooltip: 'pointer-events-none absolute top-0 left-0 z-10',
  /** In-chart `ChartLegend` drawn from the root's `legend` prop. */
  legend: '',
}

export type ChartSlot = keyof typeof chartSlots
