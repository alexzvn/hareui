// Translated from @heroui/styles components/progress-bar.css
export default {
  slots: {
    base: [
      "grid w-full grid-cols-[1fr_auto] gap-1 [grid-template-areas:'label_output'_'track_track']",
      // `&:disabled, &[data-disabled="true"], &[aria-disabled="true"]`
      'disabled:status-disabled data-[disabled=true]:status-disabled aria-disabled:status-disabled',
    ],
    // `.progress-bar [data-slot="label"]` (rendered with the Label theme underneath)
    label:
      'w-fit text-sm font-medium [grid-area:label] in-aria-disabled:opacity-100 in-data-[disabled=true]:opacity-100',
    output: 'text-sm font-medium tabular-nums [grid-area:output]',
    track: 'relative h-2 overflow-hidden rounded-sm bg-default [grid-area:track]',
    fill: 'absolute start-0 top-0 h-full rounded-sm bg-(--progress-bar-fill) transition-[width] duration-300 ease-out motion-reduce:transition-none',
  },
  variants: {
    color: {
      default: { base: '[--progress-bar-fill:var(--default-foreground)]' },
      accent: { base: '[--progress-bar-fill:var(--accent)]' },
      success: { base: '[--progress-bar-fill:var(--success)]' },
      warning: { base: '[--progress-bar-fill:var(--warning)]' },
      danger: { base: '[--progress-bar-fill:var(--danger)]' },
    },
    size: {
      sm: { track: 'h-1 rounded-xs', fill: 'rounded-xs' },
      md: {},
      lg: { track: 'h-3 rounded-md', fill: 'rounded-md' },
    },
    // `&:not([aria-valuenow]) .progress-bar__fill`
    indeterminate: {
      true: { fill: 'w-2/5 animate-progress-bar-indeterminate motion-reduce:animate-none' },
    },
  },
  defaultVariants: {
    color: 'accent',
    size: 'md',
  },
}
