export default {
  slots: {
    base: 'flex flex-col gap-1',
    wrapper: 'flex flex-col gap-1',
    labelWrapper: 'flex items-center justify-between gap-2',
    label: '',
    hint: 'text-muted',
    description: '',
    container: 'flex flex-col gap-1',
    error: '',
    help: '',
  },
  variants: {
    // Label 12/14/16px; hint, description, help and error 12/12/14px
    size: {
      sm: {
        label: 'text-xs',
        hint: 'text-xs',
        description: 'text-xs',
        error: 'text-xs',
        help: 'text-xs',
      },
      md: {
        label: 'text-sm',
        hint: 'text-xs',
        description: 'text-xs',
        error: 'text-xs',
        help: 'text-xs',
      },
      lg: {
        label: 'text-base',
        hint: 'text-sm',
        description: 'text-sm',
        error: 'text-sm',
        help: 'text-sm',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
}
