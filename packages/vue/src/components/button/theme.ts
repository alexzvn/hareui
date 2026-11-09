// Maps props to the BEM classes of ./button.css (ported from @heroui/styles components/button.css).
export default {
  slots: {
    base: 'h-button',
    spinner: '',
    label: '',
    leadingIcon: 'h-button__icon',
    trailingIcon: 'h-button__icon',
    // Utilities, not CSS: they go to Avatar's `class`, where tailwind-merge must evict Avatar's own `size-10` utility.
    avatar: '-mx-0.5 size-5 shrink-0 sm:size-4 [&_[data-slot=avatar-fallback]]:text-[0.5rem]',
  },
  variants: {
    variant: {
      primary: { base: 'h-button--primary' },
      secondary: { base: 'h-button--secondary' },
      tertiary: { base: 'h-button--tertiary' },
      ghost: { base: 'h-button--ghost' },
      outline: { base: 'h-button--outline' },
      danger: { base: 'h-button--danger' },
      'danger-soft': { base: 'h-button--danger-soft' },
    },
    size: {
      sm: { base: 'h-button--sm', avatar: 'size-4' },
      md: {},
      lg: { base: 'h-button--lg' },
    },
    iconOnly: {
      true: { base: 'h-button--icon-only' },
    },
    fullWidth: {
      true: { base: 'h-button--full-width' },
      false: {},
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    fullWidth: false,
    iconOnly: false,
  } as const,
}
