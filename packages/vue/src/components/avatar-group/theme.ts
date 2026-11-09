// Maps props to the BEM classes of ./avatar-group.css (ported from @heroui/styles components/avatar-group.css).
export default {
  slots: {
    base: 'h-avatar-group',
    count: 'h-avatar-group__count',
  },
  variants: {
    grid: {
      true: { base: 'h-avatar-group--grid' },
      false: {},
    },
    // The overlap styles apply only while the group is stacked (not `grid`)
    overlap: {
      clip: { base: 'h-avatar-group--clip' },
      ring: { base: 'h-avatar-group--ring' },
    },
  },
  defaultVariants: {
    grid: false,
    overlap: 'clip',
  },
}
