// Translated from @heroui/styles components/tag.css
export default {
  slots: {
    base: [
      'relative inline-flex items-center gap-1 rounded-xl px-2 py-1 text-xs font-medium select-none no-highlight',
      '[transition:color_100ms_var(--ease-smooth),scale_100ms_var(--ease-smooth),opacity_100ms_var(--ease-smooth),background-color_100ms_var(--ease-smooth),box-shadow_100ms_var(--ease-out)] origin-center transform-gpu motion-reduce:transition-none',
      'cursor-(--cursor-interactive)',
      // :where(): HeroUI's `.tag svg` sits in @layer components, so an icon's own utilities win.
      '[:where(&_svg)]:pointer-events-none [:where(&_svg)]:size-3 [:where(&_svg)]:shrink-0 [:where(&_svg)]:self-center [:where(&_svg)]:text-current',
      'data-[disabled=true]:status-disabled aria-disabled:status-disabled',
      'focus-visible:status-focused data-[focus-visible=true]:status-focused',
      // Selected state
      'data-[selected=true]:bg-accent-soft data-[selected=true]:text-accent-soft-foreground',
      '[@media(hover:hover)]:[&[data-selected=true]:is(:hover,[data-hovered=true])]:bg-accent-soft-hover',
    ],
    removeButton: [
      // The glyph is 12px, half the minimum target size; `touch-target` widens the pressable area to 24px
      // without pushing a neighbouring tag (the 6px list gap absorbs the overlay on `sm`).
      'touch-target size-3 text-inherit',
      '[:where(&_svg)]:size-[inherit] [:where(&_svg)]:shrink-0 [:where(&_svg)]:self-center [:where(&_svg)]:text-current',
    ],
  },
  variants: {
    size: {
      sm: { base: 'px-2 py-0.5 text-xs' },
      md: { base: '' },
      lg: { base: 'rounded-2xl px-2.5 py-1.5 text-sm' },
    },
    variant: {
      default: {
        base: [
          'bg-default text-default-foreground',
          '[@media(hover:hover)]:[&:is(:hover,[data-hovered=true]):not([data-selected=true]):not([data-disabled=true])]:bg-default-hover',
        ],
      },
      surface: {
        base: [
          'bg-surface text-surface-foreground',
          '[@media(hover:hover)]:[&:is(:hover,[data-hovered=true]):not([data-selected=true]):not([data-disabled=true])]:bg-surface-hover',
        ],
      },
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
  },
}
