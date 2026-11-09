// Maps props to the BEM classes of ./switch.css (ported from @heroui/styles components/switch.css).
export default {
  slots: {
    // `group/switch` stays as a hook for user `group-*/switch` utilities
    base: 'group/switch h-switch',
    content: 'h-switch__content',
    control: 'h-switch__control',
    thumb: 'h-switch__thumb',
    icon: '',
  },
  variants: {
    size: {
      sm: { base: 'h-switch--sm' },
      md: {},
      lg: { base: 'h-switch--lg' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
}
