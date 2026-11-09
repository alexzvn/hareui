// Maps props to the BEM classes of ./color-swatch.css (ported from @heroui/styles components/color-swatch.css).
export default {
  slots: {
    base: 'h-color-swatch',
  },
  variants: {
    shape: {
      circle: 'h-color-swatch--circle',
      square: 'h-color-swatch--square',
    },
    size: {
      xs: 'h-color-swatch--xs',
      sm: 'h-color-swatch--sm',
      md: {},
      lg: 'h-color-swatch--lg',
      xl: 'h-color-swatch--xl',
    },
  },
  defaultVariants: {
    shape: 'circle',
    size: 'md',
  },
}
