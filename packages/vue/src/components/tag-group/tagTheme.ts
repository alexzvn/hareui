// Maps props to the BEM classes of ./tag-group.css (ported from @heroui/styles components/tag.css).
export default {
  slots: {
    base: 'h-tag',
    // Utilities, not CSS: they go to CloseButton's `class`, where tailwind-merge must evict its 24px box and 16px glyph.
    // The glyph is 12px, half the minimum target size; `touch-target` widens the pressable area to 24px
    // without pushing a neighbouring tag (the 6px list gap absorbs the overlay on `sm`).
    removeButton: [
      'touch-target size-3 text-inherit',
      '[:where(&_svg)]:size-[inherit] [:where(&_svg)]:shrink-0 [:where(&_svg)]:self-center [:where(&_svg)]:text-current',
    ],
  },
  variants: {
    size: {
      sm: { base: 'h-tag--sm' },
      md: {},
      lg: { base: 'h-tag--lg' },
    },
    variant: {
      default: { base: 'h-tag--default' },
      surface: { base: 'h-tag--surface' },
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
  },
}
