// Dashboard panel on HeroUI tokens. `size` is true once the panel has a width (`defaultSize` or a stored/dragged size); otherwise it fills the remaining space.
// The body keeps a 24px content inset at every width so it lines up with the navbar (`px-6`). The end border is
// skipped before a sidebar, which draws its own edge (otherwise the two lines double up). Panels sit side by side from `md`,
// where the sidebar docks.
export default {
  slots: {
    root: 'relative flex min-h-0 min-w-0 shrink-0 flex-col bg-background text-foreground md:not-last:border-e md:not-last:border-separator md:[&:not(:last-child):has(+[data-slot=dashboard-sidebar],+[data-side=right]+[data-slot=dashboard-sidebar])]:border-e-0',
    body: 'flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-6 sm:gap-6',
    handle: '',
  },
  variants: {
    size: {
      true: {
        root: 'w-full md:w-(--width)',
      },
      false: {
        root: 'flex-1',
      },
    },
  },
  defaultVariants: {
    size: false,
  },
}
