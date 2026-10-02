// Translated from @heroui/styles components/color-swatch.css
// Reka's ColorSwatch primitive exposes the resolved color as `--reka-color-swatch-color`
// (HeroUI's own `.color-swatch` sets `--color-swatch-current` itself via inline style instead).
export default {
  slots: {
    base: [
      'relative box-border size-8 shrink-0',
      // Checkered background pattern for transparency
      '[background:linear-gradient(var(--reka-color-swatch-color),var(--reka-color-swatch-color)),repeating-conic-gradient(#efefef_0%_25%,#f7f7f7_0%_50%)_50%/16px_16px]',
      // Default border for visibility against similar backgrounds
      '[box-shadow:inset_0_0_0_1px_rgba(0,0,0,0.1)]',
    ],
  },
  variants: {
    shape: {
      circle: 'rounded-2xl',
      square: 'rounded-md',
    },
    size: {
      xs: 'size-4',
      sm: 'size-6',
      md: '',
      lg: 'size-9',
      xl: 'size-10',
    },
  },
  compoundVariants: [
    { shape: 'circle', size: 'xs', class: { base: 'rounded-lg' } },
    { shape: 'circle', size: 'sm', class: { base: 'rounded-xl' } },
    { shape: 'circle', size: 'lg', class: { base: 'rounded-3xl' } },
    { shape: 'circle', size: 'xl', class: { base: 'rounded-3xl' } },
  ],
  defaultVariants: {
    shape: 'circle',
    size: 'md',
  },
}
