// Translated from @heroui/styles components/toggle-button.css
export default {
  slots: {
    base: [
      'relative isolate inline-flex w-fit origin-center items-center justify-center gap-2 rounded-3xl px-4 text-sm font-medium whitespace-nowrap outline-none select-none no-highlight',
      // Responsive height lives in a variable so a plain `h-*` from the user wins at every breakpoint.
      'h-(--toggle-button-height) [--toggle-button-height:--spacing(10)] md:[--toggle-button-height:--spacing(9)]',
      '[transition:transform_250ms_var(--ease-smooth),background-color_100ms_var(--ease-out),box-shadow_100ms_var(--ease-out)] transform-gpu motion-reduce:transition-none',
      'cursor-(--cursor-interactive)',
      '[--toggle-button-bg-hover:var(--default-hover)] [--toggle-button-bg-pressed:var(--default-hover)] [--toggle-button-bg:var(--default)] [--toggle-button-fg:currentColor]',
      '[--toggle-button-bg-selected-hover:var(--accent-soft-hover)] [--toggle-button-bg-selected-pressed:var(--accent-soft-hover)] [--toggle-button-bg-selected:var(--accent-soft)] [--toggle-button-fg-selected:var(--accent-soft-foreground)]',
      'bg-(--toggle-button-bg) text-(--toggle-button-fg)',
      'focus-visible:status-focused',
      'disabled:status-disabled aria-disabled:status-disabled',
      'hover:bg-(--toggle-button-bg-hover)',
      'active:bg-(--toggle-button-bg-pressed) active:[transform:scale(0.97)]',
      'data-[selected=true]:bg-(--toggle-button-bg-selected) data-[selected=true]:text-(--toggle-button-fg-selected)',
      'data-[selected=true]:hover:bg-(--toggle-button-bg-selected-hover) data-[selected=true]:active:bg-(--toggle-button-bg-selected-pressed)',
      // :where() keeps icon sizing at zero specificity so a utility on the icon itself wins (HeroUI's lives in @layer components).
      // Written out in full: Tailwind scans source text, so interpolated class names are never generated.
      '[:where(&_svg)]:pointer-events-none [:where(&_svg)]:-mx-0.5 [:where(&_svg)]:my-0.5 [:where(&_svg)]:size-5 [:where(&_svg)]:shrink-0 [:where(&_svg)]:self-center sm:[:where(&_svg)]:my-1 sm:[:where(&_svg)]:size-4',
    ],
  },
  variants: {
    variant: {
      default: {
        base: '[--toggle-button-bg-hover:var(--default-hover)] [--toggle-button-bg-pressed:var(--default-hover)] [--toggle-button-bg:var(--default)]',
      },
      ghost: {
        base: '[--toggle-button-bg-hover:var(--default)] [--toggle-button-bg-pressed:var(--default)] [--toggle-button-bg:transparent] [--toggle-button-fg:var(--default-foreground)]',
      },
    },
    size: {
      sm: {
        base: '[--toggle-button-height:--spacing(9)] px-3 md:[--toggle-button-height:--spacing(8)] [:where(&_svg)]:size-4 sm:[:where(&_svg)]:size-4 active:[transform:scale(0.98)]',
      },
      md: { base: '' },
      lg: {
        base: '[--toggle-button-height:--spacing(11)] text-base md:[--toggle-button-height:--spacing(10)] active:[transform:scale(0.96)]',
      },
    },
    iconOnly: {
      // Icon-only buttons are square: HeroUI's per-size widths equal the size's height.
      true: { base: 'w-(--toggle-button-height) p-0' },
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
    iconOnly: false,
  },
}
