// Maps props to the BEM classes of ./meter.css (ported from @heroui/styles components/meter.css).
export default {
  slots: {
    base: 'h-meter',
    // Styled by `.h-meter [data-slot='label']` on top of the Label classes
    label: '',
    output: 'h-meter__output',
    track: 'h-meter__track',
    fill: 'h-meter__fill',
  },
  variants: {
    color: {
      default: { base: 'h-meter--default' },
      accent: { base: 'h-meter--accent' },
      success: { base: 'h-meter--success' },
      warning: { base: 'h-meter--warning' },
      danger: { base: 'h-meter--danger' },
    },
    size: {
      sm: { base: 'h-meter--sm' },
      md: {},
      lg: { base: 'h-meter--lg' },
    },
  },
  defaultVariants: {
    color: 'accent',
    size: 'md',
  },
}
