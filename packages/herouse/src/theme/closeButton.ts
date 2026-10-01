// Translated from @heroui/styles components/close-button.css
export default {
  slots: {
    base: [
      'relative isolate inline-flex h-6 w-6 shrink-0 origin-center items-center justify-center rounded-xl p-1 select-none no-highlight',
      'cursor-(--cursor-interactive)',
      '[transition:transform_250ms_var(--ease-out-quart),color_150ms_var(--ease-out),background-color_100ms_var(--ease-out),box-shadow_150ms_var(--ease-out)] transform-gpu motion-reduce:transition-none',
      'focus-visible:status-focused',
      'disabled:status-disabled aria-disabled:status-disabled',
      'data-[pending=true]:status-pending',
      '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:self-center [&_svg]:-mx-0.5 [&_svg]:my-0.5',
    ],
    icon: '',
  },
  variants: {
    variant: {
      default: { base: 'bg-default text-muted hover:bg-default-hover active:[transform:scale(0.93)]' },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
}
