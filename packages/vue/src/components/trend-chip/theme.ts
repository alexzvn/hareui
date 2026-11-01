// Measured: arrow 12 / 14 / 16 px per size; value in tabular numerals; suffix in the muted foreground;
// prefix, value and suffix are separated by real word spaces (3.2px at 12px), so they are also read apart.
export default {
  slots: {
    base: '',
    label: 'whitespace-nowrap',
    indicator: 'shrink-0',
    prefix: '',
    value: 'tabular-nums',
    suffix: 'text-muted',
  },
  variants: {
    trend: {
      up: { indicator: '' },
      down: { indicator: 'rotate-180' },
      neutral: { indicator: '' },
    },
    size: {
      sm: { indicator: 'size-3' },
      md: { indicator: 'size-3.5' },
      lg: { indicator: 'size-4' },
    },
  },
  defaultVariants: {
    trend: 'up',
    size: 'sm',
  },
}
