// The group shares the tool card's frame; its trigger text is a step larger, and the cards inside sit 8px apart
export default {
  slots: {
    base: 'w-full overflow-hidden rounded-xl border border-default',
    heading: 'w-full',
    trigger: [
      'flex min-h-9 w-full cursor-(--cursor-interactive) items-center justify-between gap-2 px-3 py-2 text-start text-sm font-normal text-foreground no-highlight',
      'hover:bg-default active:bg-default',
      'outline-none focus-visible:rounded-xl focus-visible:shadow-[inset_0_0_0_2px_var(--color-focus)]',
    ],
    label: 'flex min-w-0 items-center gap-2',
    indicator: 'size-3.5 text-muted',
    content: '',
    body: 'p-2',
    // The disclosure wraps its content in one inner element, so the cards' gap goes there
    bodyInner: 'flex flex-col gap-2',
  },
  variants: {},
  defaultVariants: {},
}
