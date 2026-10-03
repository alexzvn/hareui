// Translated from @heroui/styles components/switch-group.css
export default {
  slots: {
    base: 'flex flex-col gap-6',
    items: 'flex gap-4',
  },
  variants: {
    orientation: {
      horizontal: {
        items: 'flex-row',
      },
      vertical: {
        items: 'flex-col',
      },
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
}
