// Translated from @heroui/styles components/alert.css
export default {
  slots: {
    base: 'flex w-full flex-row items-start justify-start gap-4 bg-surface px-4 py-3 shadow-surface rounded-[min(32px,var(--radius-3xl))]',
    indicator: 'flex items-center justify-center p-1 select-none [&_[data-slot=alert-default-icon]]:box-content [&_[data-slot=alert-default-icon]]:size-4',
    content: 'flex h-full grow flex-col items-start',
    title: 'text-sm leading-6 font-medium',
    description: 'text-sm text-muted',
  },
  variants: {
    status: {
      default: { indicator: 'text-foreground', title: 'text-foreground' },
      accent: { indicator: 'text-accent-soft-foreground', title: 'text-accent-soft-foreground' },
      success: { indicator: 'text-success-soft-foreground', title: 'text-success-soft-foreground' },
      warning: { indicator: 'text-warning-soft-foreground', title: 'text-warning-soft-foreground' },
      danger: { indicator: 'text-danger-soft-foreground', title: 'text-danger-soft-foreground' },
    },
  },
  defaultVariants: {
    status: 'default',
  },
}
