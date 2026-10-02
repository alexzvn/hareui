// Translated from @heroui/styles components/link.css
export default {
  slots: {
    base: [
      'relative inline-flex h-fit w-fit items-center rounded-xl font-medium text-link no-underline decoration-separator-tertiary decoration-[1.5px] underline-offset-4 no-highlight',
      '[transition:color_100ms_var(--ease-smooth),background-color_150ms_var(--ease-smooth),box-shadow_150ms_var(--ease-out),opacity_100ms_var(--ease-out)] motion-reduce:transition-none',
      'cursor-(--cursor-interactive)',
      'hover:underline hover:decoration-muted/50 hover:[&_[data-slot=link-icon]]:opacity-100',
      'active:underline active:decoration-muted active:[&_[data-slot=link-icon]]:opacity-100',
      'focus-visible:status-focused focus-visible:[&_[data-slot=link-icon]]:opacity-100',
      'aria-disabled:status-disabled',
    ].join(' '),
    icon: 'pointer-events-none inline-flex size-[0.75em] shrink-0 items-center justify-center text-current opacity-60 [transition:opacity_150ms_var(--ease-out)] motion-reduce:transition-none [&_svg]:transform-gpu data-[default-icon=true]:ms-1 data-[default-icon=true]:pb-1.5',
  },
}
