// Maps props to the BEM classes of ./progress-bar.css (ported from @heroui/styles components/progress-bar.css).
// `indeterminate` adds no class: the css keys on the missing `aria-valuenow`, as HeroUI's does. The empty variant
// keeps it overridable through `ui`.
export default {
  slots: {
    base: 'h-progress-bar',
    // Styled by `.h-progress-bar [data-slot='label']` on top of the Label classes
    label: '',
    output: 'h-progress-bar__output',
    track: 'h-progress-bar__track',
    fill: 'h-progress-bar__fill',
  },
  variants: {
    color: {
      default: { base: 'h-progress-bar--default' },
      accent: { base: 'h-progress-bar--accent' },
      success: { base: 'h-progress-bar--success' },
      warning: { base: 'h-progress-bar--warning' },
      danger: { base: 'h-progress-bar--danger' },
    },
    size: {
      sm: { base: 'h-progress-bar--sm' },
      md: {},
      lg: { base: 'h-progress-bar--lg' },
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
