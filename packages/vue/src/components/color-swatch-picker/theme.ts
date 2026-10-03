// Translated from @heroui/styles components/color-swatch-picker.css
// Reka's ListboxItem exposes selection as `data-state="checked"` (RAC: `data-selected`) and disabled as `data-disabled`.
// Class strings are written out literally: Tailwind's scanner cannot see interpolated ones
export default {
  slots: {
    base: 'flex flex-wrap items-center gap-2',
    item: [
      'relative flex size-8 items-center justify-center rounded-2xl border-2 border-transparent outline-none no-highlight',
      'cursor-(--cursor-interactive)',
      '[transition:border-color_100ms_var(--ease-out),box-shadow_100ms_var(--ease-out)] transform-gpu motion-reduce:transition-none',
      'focus-visible:status-focused',
      'data-disabled:status-disabled',
      // Selected: ring in the swatch colour with a white gap (swatch shrinks)
      'data-[state=checked]:border-(--color-swatch-current) data-[state=checked]:[box-shadow:var(--field-shadow)]',
      'data-[state=checked]:[&_[data-slot=color-swatch-picker-swatch]]:[transform:scale(0.77)]',
      'data-[state=checked]:[&_[data-slot=color-swatch-picker-indicator]>*]:[transform:scale(1)_translateZ(0)]',
    ],
    swatch: [
      'static block size-full rounded-[inherit] [background-image:none]! [box-shadow:none]!',
      '[transition:transform_100ms_var(--ease-out)] transform-gpu motion-reduce:transition-none',
      '[@media(hover:hover)]:hover:[transform:scale(1.1)]',
    ],
    indicator: [
      'pointer-events-none absolute inset-0 z-10 flex items-center justify-center',
      '*:size-1/3 *:text-white *:[transform:scale(0)_translateZ(0)] *:[transition:transform_150ms_var(--ease-out)] motion-reduce:*:transition-none',
    ],
  },
  variants: {
    layout: {
      grid: '',
      stack: { base: 'flex-col' },
    },
    size: {
      xs: { item: 'size-4 rounded-lg border' },
      sm: { item: 'size-6 rounded-xl border-2' },
      md: '',
      lg: { item: 'size-9 rounded-3xl border-3' },
      xl: { item: 'size-10 rounded-3xl border-3' },
    },
    variant: {
      circle: '',
      square: { item: 'rounded-xl', swatch: 'rounded-lg' },
    },
  },
  compoundVariants: [
    { variant: 'square', size: 'xs', class: { item: 'rounded-md', swatch: 'rounded-md' } },
    { variant: 'square', size: 'sm', class: { item: 'rounded-lg data-[state=checked]:[&_[data-slot=color-swatch-picker-swatch]]:rounded-md', swatch: 'rounded-lg' } },
    { variant: 'square', size: 'lg', class: { item: 'rounded-xl' } },
    { variant: 'square', size: 'xl', class: { item: 'rounded-xl' } },
  ],
  defaultVariants: {
    layout: 'grid',
    size: 'md',
    variant: 'circle',
  },
}
