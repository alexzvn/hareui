// Sidebar: a 240px panel (`--sidebar-width`) on the page background with a 1px inset edge (black 8% / white 10% in
// dark), header `pt-4 px-4 pb-2` (64px min), body `px-3` with 4px between items, footer `pt-2 px-3 pb-4`.
// - The root holds the space in the page flow and animates its width (200ms `ease`); the container inside sticks to
//   the top of the viewport at `100svh`. `icon` collapses to a 48px rail (`--sidebar-width-icon`) with `px-1.5`
//   padding, `offcanvas` shrinks the root to 0 while the container slides out (`translate` + `visibility`).
// - The rail is a 16px strip straddling the inner edge (2px past it); hovering it darkens the edge to `default-hover`.
// - `floating` is a 16px-radius `surface` card with a 1px border and `shadow-lg`, 8px from the viewport edges;
//   `inset` drops the background and the edge.
// - Below `breakpoint` (768px by default) the sidebar opens as a menu. The side sheet is 80vw wide (max 500px) and
//   slides in 500ms with `cubic-bezier(0.32,0.72,0,1)` over a lightly blurred backdrop. The menu panel sits inside
//   its backdrop, so the side and bottom sheets keep the backdrop opaque and fade its blur and tint instead: the panel
//   slides in and out solid.
export default {
  slots: {
    root: [
      'group/sidebar relative shrink-0 text-foreground',
      '[--sidebar-width:15rem] [--sidebar-width-icon:3rem]',
      '[--sidebar-edge-outline:rgb(0_0_0/0.08)] dark:[--sidebar-edge-outline:rgb(255_255_255/0.1)]',
    ],
    container: [
      'flex flex-col bg-background shadow-sidebar-edge',
      '[@media(hover:hover)]:has-[[data-slot=sidebar-rail]:hover]:[--sidebar-edge-outline:var(--color-default-hover)]',
      'has-[[data-slot=sidebar-rail]:focus-visible]:[--sidebar-edge-outline:var(--color-default-hover)]',
    ],
    header: 'flex min-h-16 shrink-0 items-center gap-2 overflow-hidden px-4 pt-4 pb-2',
    wrapper: 'flex min-w-0 flex-1 flex-col px-1',
    title: 'truncate text-sm leading-tight font-semibold text-foreground',
    description: 'truncate text-xs leading-tight text-muted',
    actions: 'flex shrink-0 items-center gap-1',
    close: 'shrink-0',
    body: [
      'flex min-h-0 flex-1 flex-col gap-1 overflow-x-hidden px-3 py-2',
      '[[data-slot=sidebar-header]+&]:pt-0 [&:has(+[data-slot=sidebar-footer])]:pb-0',
    ],
    footer: 'flex shrink-0 flex-col gap-1 px-3 pt-2 pb-4',
    rail: [
      'absolute inset-y-0 z-10 w-4 appearance-none border-0 bg-transparent p-0 outline-none',
      '[-webkit-tap-highlight-color:transparent]',
    ],
    handle: [
      'flex items-center justify-center pt-2 pb-1',
      '[&>[data-slot=sidebar-handle-bar]]:h-1 [&>[data-slot=sidebar-handle-bar]]:w-9 [&>[data-slot=sidebar-handle-bar]]:rounded-xs [&>[data-slot=sidebar-handle-bar]]:bg-separator',
    ],
    content: 'gap-0 p-0',
    overlay: '',
  },
  variants: {
    variant: {
      sidebar: {},
      floating: {
        container: 'm-2 rounded-2xl border border-border bg-surface shadow-lg',
      },
      inset: {
        container: 'bg-transparent shadow-none',
      },
    },
    collapsible: {
      offcanvas: {
        root: 'hidden w-(--sidebar-width) data-[state=collapsed]:w-0',
        container: [
          'sticky top-0 h-svh w-(--sidebar-width) shrink-0',
          'group-data-[state=collapsed]/sidebar:invisible',
        ],
      },
      icon: {
        root: 'hidden w-(--sidebar-width) data-[state=collapsed]:w-(--sidebar-width-icon)',
        container: 'sticky top-0 h-svh min-w-0 flex-1 overflow-x-clip',
        header: 'group-data-[state=collapsed]/sidebar:px-1.5',
        wrapper: 'group-data-[state=collapsed]/sidebar:hidden',
        actions: 'group-data-[state=collapsed]/sidebar:hidden',
        body: 'group-data-[state=collapsed]/sidebar:gap-0.5 group-data-[state=collapsed]/sidebar:px-1.5',
        footer: 'group-data-[state=collapsed]/sidebar:px-1.5',
      },
      none: {
        root: 'flex h-full w-(--sidebar-width)',
        container: 'min-w-0 flex-1',
      },
    },
    side: {
      left: {
        container:
          '[--sidebar-edge-shadow:inset_-1px_0_0_var(--sidebar-edge-outline)] rtl:[--sidebar-edge-shadow:inset_1px_0_0_var(--sidebar-edge-outline)]',
        rail: '-end-0.5',
      },
      right: {
        root: 'justify-end',
        container:
          '[--sidebar-edge-shadow:inset_1px_0_0_var(--sidebar-edge-outline)] rtl:[--sidebar-edge-shadow:inset_-1px_0_0_var(--sidebar-edge-outline)]',
        rail: '-start-0.5',
      },
    },
    transition: {
      true: {
        root: 'transition-[width] duration-200 ease-[ease] motion-reduce:transition-none',
        container:
          'transition-[translate,visibility,box-shadow] duration-200 ease-[ease] motion-reduce:transition-none',
        header: 'transition-[padding] duration-200 ease-[ease] motion-reduce:transition-none',
        body: 'transition-[padding,gap] duration-200 ease-[ease] motion-reduce:transition-none',
        footer: 'transition-[padding] duration-200 ease-[ease] motion-reduce:transition-none',
      },
      false: {},
    },
    breakpoint: {
      sm: {},
      md: {},
      lg: {},
      xl: {},
      '2xl': {},
    },
    mode: {
      slideover: {
        overlay: [
          'bg-background/1 backdrop-blur-sm',
          'data-[state=open]:[--tw-enter-opacity:1] data-[state=closed]:[--tw-exit-opacity:1]',
          'starting:backdrop-blur-none data-[state=closed]:backdrop-blur-none',
          '[&:where([data-state=open])]:[--tw-duration:500ms] [&:where([data-state=closed])]:[--tw-duration:500ms]',
          '[transition:backdrop-filter_500ms_cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none',
        ],
        content: [
          'w-[80vw] max-w-125 sm:w-[80vw]',
          '[&:where([data-state=open])]:[--tw-duration:500ms] [&:where([data-state=closed])]:[--tw-duration:500ms]',
          '[transition:translate_500ms_cubic-bezier(0.32,0.72,0,1)]',
        ],
      },
      drawer: {
        overlay: [
          'data-[state=open]:[--tw-enter-opacity:1] data-[state=closed]:[--tw-exit-opacity:1]',
          'starting:bg-transparent starting:backdrop-blur-none',
          'data-[state=closed]:bg-transparent data-[state=closed]:backdrop-blur-none',
          '[transition:background-color_250ms_cubic-bezier(0.32,0.72,0,1),backdrop-filter_250ms_cubic-bezier(0.32,0.72,0,1)]',
          'data-[state=closed]:[transition-duration:200ms] motion-reduce:transition-none',
        ],
      },
      modal: {},
    },
  },
  compoundVariants: [
    { breakpoint: 'sm', collapsible: ['offcanvas', 'icon'], class: { root: 'sm:flex' } },
    { breakpoint: 'md', collapsible: ['offcanvas', 'icon'], class: { root: 'md:flex' } },
    { breakpoint: 'lg', collapsible: ['offcanvas', 'icon'], class: { root: 'lg:flex' } },
    { breakpoint: 'xl', collapsible: ['offcanvas', 'icon'], class: { root: 'xl:flex' } },
    { breakpoint: '2xl', collapsible: ['offcanvas', 'icon'], class: { root: '2xl:flex' } },
    {
      side: 'left',
      collapsible: 'offcanvas',
      class: {
        container:
          'group-data-[state=collapsed]/sidebar:-translate-x-full rtl:group-data-[state=collapsed]/sidebar:translate-x-full',
      },
    },
    // On the right, the slid-out panel would widen the page. `clip` hides it without making a scroll container, so
    // the panel still sticks. It only applies while the panel is outside the root (collapsed, and until the
    // expanding slide ends), so the open panel's rail and shadow can reach past the root's inner edge.
    {
      side: 'right',
      collapsible: 'offcanvas',
      class: {
        root: 'data-[state=collapsed]:overflow-x-clip',
        container:
          'group-data-[state=collapsed]/sidebar:translate-x-full rtl:group-data-[state=collapsed]/sidebar:-translate-x-full',
      },
    },
    {
      side: 'right',
      collapsible: 'offcanvas',
      transition: true,
      class: {
        root: '[transition:width_200ms_ease,overflow-x_0s_200ms_allow-discrete] data-[state=collapsed]:[transition:width_200ms_ease] motion-reduce:transition-none',
      },
    },
    {
      side: 'left',
      collapsible: ['offcanvas', 'icon'],
      class: {
        rail: 'cursor-w-resize group-data-[state=collapsed]/sidebar:cursor-e-resize rtl:cursor-e-resize rtl:group-data-[state=collapsed]/sidebar:cursor-w-resize',
      },
    },
    {
      side: 'right',
      collapsible: ['offcanvas', 'icon'],
      class: {
        rail: 'cursor-e-resize group-data-[state=collapsed]/sidebar:cursor-w-resize rtl:cursor-w-resize rtl:group-data-[state=collapsed]/sidebar:cursor-e-resize',
      },
    },
    {
      variant: 'floating',
      class: { root: 'w-[calc(var(--sidebar-width)+1rem)]' },
    },
    {
      variant: 'floating',
      collapsible: ['offcanvas', 'icon'],
      class: { container: 'top-2 h-[calc(100svh-1rem)]' },
    },
    {
      variant: 'floating',
      collapsible: 'icon',
      class: { root: 'data-[state=collapsed]:w-[calc(var(--sidebar-width-icon)+1rem)]' },
    },
  ],
  defaultVariants: {
    variant: 'sidebar',
    collapsible: 'offcanvas',
    side: 'left',
    transition: true,
    breakpoint: 'md',
    mode: 'slideover',
  },
}
