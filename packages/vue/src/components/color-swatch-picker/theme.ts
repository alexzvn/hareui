// Maps props to the BEM classes of ./color-swatch-picker.css (ported from @heroui/styles components/color-swatch-picker.css).
export default {
  slots: {
    base: 'h-color-swatch-picker',
    item: 'h-color-swatch-picker__item',
    swatch: 'h-color-swatch-picker__swatch',
    indicator: 'h-color-swatch-picker__indicator',
  },
  variants: {
    layout: {
      grid: {},
      stack: { base: 'h-color-swatch-picker--stack' },
    },
    size: {
      xs: { base: 'h-color-swatch-picker--xs' },
      sm: { base: 'h-color-swatch-picker--sm' },
      md: {},
      lg: { base: 'h-color-swatch-picker--lg' },
      xl: { base: 'h-color-swatch-picker--xl' },
    },
    variant: {
      circle: {},
      square: { base: 'h-color-swatch-picker--square' },
    },
  },
  defaultVariants: {
    layout: 'grid',
    size: 'md',
    variant: 'circle',
  },
}
