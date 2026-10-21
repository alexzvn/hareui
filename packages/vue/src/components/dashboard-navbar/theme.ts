// Dashboard navbar: 4rem bar (`--navbar-height`), `bg-background`, px-6 gap-4, no border.
// Ghost triggers pull 8px into the padding (`-ms-2` at the start, `-me-2` at the end) so 32px buttons' icons
// line up with the 24px content edge. Below `md` the `sm` button is 36px, so the toggle pulls 10px to keep that alignment.
export default {
  slots: {
    root: 'relative flex h-(--navbar-height) shrink-0 items-center justify-between gap-4 bg-background px-6 [--navbar-height:--spacing(16)]',
    left: 'flex min-w-0 items-center gap-4 *:data-[slot=dashboard-sidebar-collapse]:-ms-2',
    title: 'flex min-w-0 items-center gap-2 text-sm font-medium text-foreground',
    center: 'hidden lg:flex',
    right: 'flex shrink-0 items-center gap-1 *:data-[slot=dashboard-sidebar-collapse]:last:-me-2',
    toggle: '',
  },
  variants: {
    toggleSide: {
      left: { toggle: '-ms-2.5 md:-ms-2' },
      right: { toggle: '-me-2.5 md:-me-2' },
    },
  },
}
