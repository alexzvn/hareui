// Translated from @heroui/styles components/card.css
export default {
  slots: {
    base: 'relative flex flex-col gap-3 overflow-visible p-4 shadow-surface rounded-[min(32px,var(--radius-3xl))]',
    header: 'flex flex-col',
    title: 'text-sm leading-6 font-medium text-foreground',
    description: 'text-sm leading-5 text-muted',
    content: 'flex flex-1 flex-col gap-1',
    footer: 'flex flex-row items-center',
  },
  variants: {
    variant: {
      default: { base: 'bg-surface' },
      secondary: { base: 'bg-surface-secondary' },
      tertiary: { base: 'bg-surface-tertiary' },
      transparent: { base: 'border-none bg-transparent shadow-none' },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
}
