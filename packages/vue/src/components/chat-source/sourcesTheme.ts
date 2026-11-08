// A muted 12px trigger with overlapping 20px favicons, over a wrapping row of chips 8px apart
export default {
  slots: {
    base: 'w-full',
    heading: 'w-full',
    trigger: [
      'inline-flex min-h-8 w-fit cursor-(--cursor-interactive) items-center gap-2 rounded-3xl py-1 text-start text-xs font-medium text-muted no-highlight',
      'transition-colors duration-100 ease-out motion-reduce:transition-none',
      'hover:text-foreground',
      'focus-visible:status-focused',
    ],
    label: 'inline-flex min-w-0 items-center gap-2',
    favicons: 'inline-flex -space-x-1.5',
    favicon: 'size-5 rounded-full border border-background bg-white object-cover p-px',
    content: 'border-t-0 border-default data-[expanded=true]:border-t',
    indicator: 'size-3.5 shrink-0 text-muted',
    body: 'px-2 pt-2 pb-0',
    list: 'flex flex-wrap items-center gap-2',
  },
  variants: {},
  defaultVariants: {},
}
