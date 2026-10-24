// Translated from @heroui/styles components/badge.css
export default {
  slots: {
    anchor: 'relative inline-flex shrink-0',
    base: 'inline-flex shrink-0 items-center justify-center gap-0.5 font-medium min-h-7 min-w-7 rounded-3xl text-xs leading-[1.34] [--badge-bg:var(--default)] [--badge-fg:var(--default-foreground)] [--badge-border:var(--background)] bg-(--badge-bg) text-(--badge-fg) border border-(--badge-border) bg-clip-padding',
    label: 'px-0.5',
  },
  variants: {
    color: {
      accent: { base: '[--badge-fg:var(--accent-soft-foreground)]' },
      default: { base: '[--badge-fg:var(--default-foreground)]' },
      success: { base: '[--badge-fg:var(--success-soft-foreground)]' },
      warning: { base: '[--badge-fg:var(--warning-soft-foreground)]' },
      danger: { base: '[--badge-fg:var(--danger-soft-foreground)]' },
    },
    placement: {
      'top-right': { base: 'absolute top-0 right-0 [transform:translate(25%,-25%)]' },
      'top-left': { base: 'absolute top-0 left-0 [transform:translate(-25%,-25%)]' },
      'bottom-right': { base: 'absolute right-0 bottom-0 [transform:translate(25%,25%)]' },
      'bottom-left': { base: 'absolute bottom-0 left-0 [transform:translate(-25%,25%)]' },
    },
    size: {
      lg: { base: 'min-h-8 min-w-8 rounded-2xl text-sm leading-[1.43]' },
      md: { base: '' },
      sm: { base: 'min-h-4 min-w-4 rounded-xl text-[10px] leading-[1.34]' },
    },
    variant: {
      primary: { base: '' },
      secondary: { base: '' },
      soft: { base: '' },
    },
  },
  compoundVariants: [
    {
      variant: 'primary',
      color: 'accent',
      class: { base: '[--badge-bg:var(--accent)] [--badge-fg:var(--accent-foreground)]' },
    },
    {
      variant: 'primary',
      color: 'default',
      class: { base: '[--badge-bg:var(--default)] [--badge-fg:var(--default-foreground)]' },
    },
    {
      variant: 'primary',
      color: 'success',
      class: { base: '[--badge-bg:var(--success)] [--badge-fg:var(--success-foreground)]' },
    },
    {
      variant: 'primary',
      color: 'warning',
      class: { base: '[--badge-bg:var(--warning)] [--badge-fg:var(--warning-foreground)]' },
    },
    {
      variant: 'primary',
      color: 'danger',
      class: { base: '[--badge-bg:var(--danger)] [--badge-fg:var(--danger-foreground)]' },
    },
    {
      variant: 'soft',
      color: 'accent',
      class: { base: '[--badge-bg:var(--accent-soft)] [--badge-fg:var(--accent-soft-foreground)]' },
    },
    {
      variant: 'soft',
      color: 'default',
      class: {
        base: '[--badge-bg:var(--default-soft)] [--badge-fg:var(--default-soft-foreground)]',
      },
    },
    {
      variant: 'soft',
      color: 'success',
      class: {
        base: '[--badge-bg:var(--success-soft)] [--badge-fg:var(--success-soft-foreground)]',
      },
    },
    {
      variant: 'soft',
      color: 'warning',
      class: {
        base: '[--badge-bg:var(--warning-soft)] [--badge-fg:var(--warning-soft-foreground)]',
      },
    },
    {
      variant: 'soft',
      color: 'danger',
      class: { base: '[--badge-bg:var(--danger-soft)] [--badge-fg:var(--danger-soft-foreground)]' },
    },
  ],
  defaultVariants: {
    color: 'default',
    placement: 'top-right',
    size: 'md',
    variant: 'primary',
  },
}
