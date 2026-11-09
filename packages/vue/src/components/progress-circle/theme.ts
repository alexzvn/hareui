// Maps props to the BEM classes of ./progress-circle.css (ported from @heroui/styles components/progress-circle.css).
// `indeterminate` adds no class: the css keys on the missing `aria-valuenow`, as HeroUI's does. The empty variant
// keeps it overridable through `ui`.
export default {
  slots: {
    base: 'h-progress-circle',
    track: 'h-progress-circle__track',
    trackCircle: 'h-progress-circle__track-circle',
    fillCircle: 'h-progress-circle__fill-circle',
  },
  variants: {
    color: {
      default: { base: 'h-progress-circle--default' },
      accent: { base: 'h-progress-circle--accent' },
      success: { base: 'h-progress-circle--success' },
      warning: { base: 'h-progress-circle--warning' },
      danger: { base: 'h-progress-circle--danger' },
    },
    size: {
      sm: { base: 'h-progress-circle--sm' },
      md: {},
      lg: { base: 'h-progress-circle--lg' },
    },
    indeterminate: {
      true: {},
    },
  },
  defaultVariants: {
    color: 'accent',
    size: 'md',
  },
}
