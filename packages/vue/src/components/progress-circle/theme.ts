// Translated from @heroui/styles components/progress-circle.css
export default {
  slots: {
    base: [
      'inline-flex items-center justify-center [--progress-circle-stroke:var(--accent)] [--progress-circle-track-stroke:var(--default)]',
      // `&:disabled, &[data-disabled="true"], &[aria-disabled="true"]`
      'disabled:status-disabled data-[disabled=true]:status-disabled aria-disabled:status-disabled',
    ],
    track: 'size-7',
    trackCircle: 'stroke-(--progress-circle-track-stroke)',
    fillCircle:
      'stroke-(--progress-circle-stroke) transition-[stroke-dashoffset] duration-300 ease-out motion-reduce:transition-none',
  },
  variants: {
    color: {
      default: { base: '[--progress-circle-stroke:var(--default-foreground)]' },
      accent: { base: '[--progress-circle-stroke:var(--accent)]' },
      success: { base: '[--progress-circle-stroke:var(--success)]' },
      warning: { base: '[--progress-circle-stroke:var(--warning)]' },
      danger: { base: '[--progress-circle-stroke:var(--danger)]' },
    },
    size: {
      sm: { track: 'size-5' },
      md: {},
      lg: { track: 'size-9' },
    },
    // `&:not([aria-valuenow]) .progress-circle__track`
    indeterminate: {
      true: { track: 'animate-progress-circle-spin motion-reduce:animate-none' },
    },
  },
  defaultVariants: {
    color: 'accent',
    size: 'md',
  },
}
