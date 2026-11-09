// Maps props to the BEM classes of ./switch-group.css (ported from @heroui/styles components/switch-group.css).
export default {
  slots: {
    base: 'h-switch-group',
    items: 'h-switch-group__items',
  },
  variants: {
    orientation: {
      horizontal: { base: 'h-switch-group--horizontal' },
      vertical: { base: 'h-switch-group--vertical' },
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
}
