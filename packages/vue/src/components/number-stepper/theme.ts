const button = [
  'relative flex shrink-0 items-center justify-center rounded-full border-0 bg-surface shadow-surface outline-none no-highlight',
  'cursor-(--cursor-interactive) [transform:translateZ(0)]',
  '[transition:background-color_100ms_var(--ease-out),box-shadow_100ms_var(--ease-out),transform_250ms_var(--ease-smooth)] motion-reduce:transition-none',
  '[&_svg]:shrink-0 [&_svg]:text-muted [&_svg]:transition-colors [&_svg]:duration-150 motion-reduce:[&_svg]:transition-none',
  '[@media(hover:hover)]:hover:[&_svg]:text-foreground',
  'focus-visible:status-focused',
  'disabled:status-disabled data-disabled:status-disabled aria-disabled:status-disabled',
]

export default {
  slots: {
    base: 'inline-flex shrink-0 flex-col items-start gap-1.5 data-[invalid=true]:[&_[data-slot=description]]:hidden',
    group: [
      'inline-flex items-center rounded-full bg-default p-0.5 shadow-none',
      'has-[[data-slot=number-stepper-input]:focus-visible]:status-focused',
      'data-[invalid=true]:status-invalid-field',
    ],
    decrementButton: button,
    value: 'flex items-center justify-center font-semibold text-foreground tabular-nums',
    incrementButton: button,
    input: 'sr-only',
  },
  variants: {
    size: {
      sm: {
        group: 'gap-0',
        decrementButton: 'size-8 md:size-7 active:scale-98 data-[pressed=true]:scale-98 [&_svg]:size-3.5',
        incrementButton: 'size-8 md:size-7 active:scale-98 data-[pressed=true]:scale-98 [&_svg]:size-3.5',
        value: 'h-8 min-w-6 text-xs md:h-7 md:min-w-5',
      },
      md: {
        group: 'gap-0',
        decrementButton: 'size-9 md:size-8 active:scale-98 data-[pressed=true]:scale-98 [&_svg]:size-4',
        incrementButton: 'size-9 md:size-8 active:scale-98 data-[pressed=true]:scale-98 [&_svg]:size-4',
        value: 'h-9 min-w-7 text-sm md:h-8 md:min-w-6',
      },
      lg: {
        group: 'gap-0.5',
        decrementButton: 'size-10 md:size-9 active:scale-96 data-[pressed=true]:scale-96 [&_svg]:size-5 md:[&_svg]:size-4',
        incrementButton: 'size-10 md:size-9 active:scale-96 data-[pressed=true]:scale-96 [&_svg]:size-5 md:[&_svg]:size-4',
        value: 'h-10 min-w-8 text-base md:h-9 md:min-w-7',
      },
    },
    reversed: {
      false: { group: '' },
      true: { group: 'flex-row-reverse' },
    },
  },
  defaultVariants: {
    size: 'md',
    reversed: false,
  },
}
