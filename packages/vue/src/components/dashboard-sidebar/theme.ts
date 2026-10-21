// Dashboard sidebar:
// `bg-background` with a 1px inset edge (black 8% / white 10% in dark), header `pt-4 px-4 pb-2` (64px with a 40px brand row),
// body `px-3` with 4px between groups, footer `pt-2 px-3 pb-4`, a 48px icon rail with `px-1.5` when collapsed, and a
// 200ms `ease` width transition (off while dragging / with reduced motion). Header, body and footer padding (16/12px →
// 6px on the rail) run the same transition, so icons and the brand glide in step with the edge instead of snapping.
// - The rail minimum is clamped in `max()` rather than with `min-width`, so collapsing to `collapsedSize: 0` (the
//   default) animates the whole way down to the 48px rail instead of stopping short. Off-canvas (no rail) is the
//   `ui.root: 'w-(--width) overflow-hidden'` recipe, see the docs.
// - The edge is the `shadow-sidebar-edge` utility (a theme shadow reading `--sidebar-edge-shadow`, which the `side`
//   variant points at the inner edge, RTL included), so `shadow-none` / `shadow-surface` replace it.
// Inset and floating looks are plain overrides, see the docs demos. The sidebar docks from `md` (768px);
// below it, it opens as a mobile sheet (390px viewport): 312px wide with no viewport cap,
// the same 64px header (`pt-4 px-4 pb-2`), and a 500ms `cubic-bezier(0.32,0.72,0,1)` slide. The close button
// sits at the end of the brand row.
export default {
  slots: {
    root: [
      'group/sidebar relative hidden min-h-0 w-[max(var(--width),3rem)] shrink-0 flex-col bg-background text-foreground shadow-sidebar-edge md:flex',
      '[--sidebar-edge-outline:rgb(0_0_0/0.08)] dark:[--sidebar-edge-outline:rgb(255_255_255/0.1)]',
      'transition-[width] duration-200 ease-[ease] motion-reduce:transition-none data-[dragging=true]:transition-none',
    ],
    // `overflow-hidden`: on the first expand frame the rail is still 48px while the header already has its expanded
    // `px-4` content, which would otherwise poke out past the rail edge until the width transition catches up.
    header: [
      'flex min-h-16 shrink-0 items-center gap-2 overflow-hidden px-4 pt-4 pb-2 group-data-[collapsed=true]/sidebar:px-1.5',
      'transition-[padding] duration-200 ease-[ease] motion-reduce:transition-none group-data-[dragging=true]/sidebar:transition-none',
    ],
    body: [
      'flex min-h-0 flex-1 flex-col gap-1 overflow-x-hidden overflow-y-auto px-3 py-2 group-data-[collapsed=true]/sidebar:px-1.5',
      'transition-[padding] duration-200 ease-[ease] motion-reduce:transition-none group-data-[dragging=true]/sidebar:transition-none',
      '[[data-slot=dashboard-sidebar-header]+&]:pt-0 [&:has(+[data-slot=dashboard-sidebar-footer])]:pb-0',
    ],
    footer: [
      'flex shrink-0 items-center gap-1 px-3 pt-2 pb-4 group-data-[collapsed=true]/sidebar:px-1.5',
      'transition-[padding] duration-200 ease-[ease] motion-reduce:transition-none group-data-[dragging=true]/sidebar:transition-none',
    ],
    // `shrink-0`: a `w-full` header slot can't squeeze the close button. `data-idle`: the sheet just opened under a
    // pointer that hasn't moved; hovering keeps the resting background.
    toggle: 'shrink-0 data-idle:[--button-bg-hover:var(--button-bg)]',
    handle: '',
    content: 'md:hidden',
    overlay: 'md:hidden',
  },
  variants: {
    mode: {
      slideover: {
        overlay: [
          'bg-background/1 backdrop-blur-sm',
          '[&:where([data-state=open])]:[--tw-duration:500ms] [&:where([data-state=closed])]:[--tw-duration:500ms]',
          '[transition:opacity_500ms_cubic-bezier(0.32,0.72,0,1)]',
        ],
        content: [
          'w-78 max-w-[calc(100vw-3rem)] sm:w-78',
          '[&:where([data-state=open])]:[--tw-duration:500ms] [&:where([data-state=closed])]:[--tw-duration:500ms]',
          '[transition:translate_500ms_cubic-bezier(0.32,0.72,0,1)]',
        ],
      },
      modal: {},
      drawer: {},
    },
    side: {
      left: {
        root: '[--sidebar-edge-shadow:inset_-1px_0_0_var(--sidebar-edge-outline)] rtl:[--sidebar-edge-shadow:inset_1px_0_0_var(--sidebar-edge-outline)]',
      },
      right: {
        root: '[--sidebar-edge-shadow:inset_1px_0_0_var(--sidebar-edge-outline)] rtl:[--sidebar-edge-shadow:inset_-1px_0_0_var(--sidebar-edge-outline)]',
      },
    },
    toggleSide: {
      left: {
        toggle: '',
      },
      right: {
        toggle: 'ms-auto',
      },
    },
  },
  defaultVariants: {
    side: 'left',
    toggleSide: 'right',
  },
}
