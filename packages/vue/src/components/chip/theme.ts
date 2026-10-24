// Translated from @heroui/styles components/chip.css
export default {
  slots: {
    base: 'inline-flex w-fit shrink-0 items-center gap-0.5 rounded-2xl px-2 py-0.5 text-xs leading-5 font-medium [--chip-bg:var(--default)] [--chip-fg:currentColor] bg-(--chip-bg) text-(--chip-fg)',
    label: 'px-0.5',
  },
  variants: {
    color: {
      accent: { base: '[--chip-fg:var(--accent-soft-foreground)]' },
      danger: { base: '[--chip-fg:var(--danger-soft-foreground)]' },
      default: { base: '[--chip-fg:var(--default-foreground)]' },
      success: { base: '[--chip-fg:var(--success-soft-foreground)]' },
      warning: { base: '[--chip-fg:var(--warning-soft-foreground)]' },
    },
    variant: {
      primary: { base: '' },
      secondary: { base: '' },
      soft: { base: '' },
      tertiary: { base: '[--chip-bg:transparent]' },
    },
    size: {
      sm: { base: 'px-1 py-0 text-xs' },
      md: { base: 'text-xs' },
      lg: { base: 'px-3 py-1 text-sm font-medium' },
    },
  },
  compoundVariants: [
    {
      variant: 'primary',
      color: 'accent',
      class: { base: '[--chip-bg:var(--accent)] [--chip-fg:var(--accent-foreground)]' },
    },
    {
      variant: 'primary',
      color: 'success',
      class: { base: '[--chip-bg:var(--success)] [--chip-fg:var(--success-foreground)]' },
    },
    {
      variant: 'primary',
      color: 'warning',
      class: { base: '[--chip-bg:var(--warning)] [--chip-fg:var(--warning-foreground)]' },
    },
    {
      variant: 'primary',
      color: 'danger',
      class: { base: '[--chip-bg:var(--danger)] [--chip-fg:var(--danger-foreground)]' },
    },
    {
      variant: 'soft',
      color: 'accent',
      class: { base: '[--chip-bg:var(--accent-soft)] [--chip-fg:var(--accent-soft-foreground)]' },
    },
    {
      variant: 'soft',
      color: 'success',
      class: { base: '[--chip-bg:var(--success-soft)] [--chip-fg:var(--success-soft-foreground)]' },
    },
    {
      variant: 'soft',
      color: 'warning',
      class: { base: '[--chip-bg:var(--warning-soft)] [--chip-fg:var(--warning-soft-foreground)]' },
    },
    {
      variant: 'soft',
      color: 'danger',
      class: { base: '[--chip-bg:var(--danger-soft)] [--chip-fg:var(--danger-soft-foreground)]' },
    },
    {
      variant: 'soft',
      color: 'default',
      class: { base: '[--chip-bg:var(--default-soft)] [--chip-fg:var(--default-soft-foreground)]' },
    },
  ],
  defaultVariants: {
    color: 'default',
    variant: 'secondary',
    size: 'md',
  },
}
