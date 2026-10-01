// Translated from @heroui/styles components/avatar.css
export default {
  slots: {
    base: 'relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-default',
    image: 'absolute inset-0 aspect-square size-full transition-opacity duration-250 motion-reduce:transition-none',
    fallback: 'flex size-full items-center justify-center bg-default text-sm font-medium',
  },
  variants: {
    color: {
      accent: { fallback: 'text-accent-soft-foreground' },
      danger: { fallback: 'text-danger-soft-foreground' },
      default: { fallback: 'text-default-soft-foreground' },
      success: { fallback: 'text-success-soft-foreground' },
      warning: { fallback: 'text-warning-soft-foreground' },
    },
    size: {
      sm: { base: '[--avatar-size:2rem] size-8 rounded-2xl', fallback: 'text-xs' },
      md: { base: '[--avatar-size:2.5rem]' },
      lg: { base: '[--avatar-size:3rem] size-12 rounded-3xl', fallback: 'text-base' },
    },
    variant: {
      default: {},
      soft: { base: 'bg-transparent' },
    },
  },
  compoundVariants: [
    { variant: 'soft', color: 'accent', class: { fallback: 'bg-accent-soft text-accent-soft-foreground' } },
    { variant: 'soft', color: 'success', class: { fallback: 'bg-success-soft text-success-soft-foreground' } },
    { variant: 'soft', color: 'warning', class: { fallback: 'bg-warning-soft text-warning-soft-foreground' } },
    { variant: 'soft', color: 'default', class: { fallback: 'bg-default-soft text-default-soft-foreground' } },
    { variant: 'soft', color: 'danger', class: { fallback: 'bg-danger-soft text-danger-soft-foreground' } },
  ],
  defaultVariants: {
    color: 'default',
    size: 'md',
    variant: 'default',
  },
}
