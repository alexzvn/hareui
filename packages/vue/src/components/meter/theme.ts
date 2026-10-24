// Translated from @heroui/styles components/meter.css
export default {
  slots: {
    base: [
      "grid w-full grid-cols-[1fr_auto] gap-1 [grid-template-areas:'label_output'_'track_track']",
      // `&:disabled, &[data-disabled="true"], &[aria-disabled="true"]`
      'disabled:status-disabled data-[disabled=true]:status-disabled aria-disabled:status-disabled',
    ],
    // `.meter [data-slot="label"]` (rendered with the Label theme underneath)
    label:
      'w-fit text-sm font-medium [grid-area:label] in-aria-disabled:opacity-100 in-data-[disabled=true]:opacity-100',
    output: 'text-sm font-medium tabular-nums [grid-area:output]',
    track: 'relative h-2 overflow-hidden rounded-sm bg-default [grid-area:track]',
    fill: 'absolute start-0 top-0 h-full rounded-sm bg-(--meter-fill) transition-[width] duration-300 ease-out motion-reduce:transition-none',
  },
  variants: {
    color: {
      default: { base: '[--meter-fill:var(--default-foreground)]' },
      accent: { base: '[--meter-fill:var(--accent)]' },
      success: { base: '[--meter-fill:var(--success)]' },
      warning: { base: '[--meter-fill:var(--warning)]' },
      danger: { base: '[--meter-fill:var(--danger)]' },
    },
    size: {
      sm: { track: 'h-1 rounded-xs', fill: 'rounded-xs' },
      md: {},
      lg: { track: 'h-3 rounded-md', fill: 'rounded-md' },
    },
  },
  defaultVariants: {
    color: 'accent',
    size: 'md',
  },
}
