// Table of contents, two looks:
// - `list`: a sticky column below `--header-height`. From `lg` (1024px) the title is a 14px semibold label over the
//   links (14px/20px with `py-1`, 28px rows); below `lg` the title is a collapsible trigger with a 16px chevron that
//   turns 180deg in 200ms, and the list slides open over 200ms. Inactive links are `text-muted` and turn
//   `text-foreground` on hover; the active link takes the `color`. `highlight` draws a 1px rail next to the links with
//   the active segment in `highlight.color`, sliding over 200ms (`straight`), or traced along the nesting (`circuit`).
// - `floating`: one 2px mark per link stacked 12px apart in a `p-1` button (32px wide). Marks are 16px wide, 3px shorter
//   per nesting level, and the active one grows to 24px in the `color`, over 150ms. The panel opens 8px from the marks:
//   16px radius, `bg-overlay`, `shadow-overlay`, 6px padding, at most `min(60vh,400px)` tall, fading and scaling in
//   from 97% over 150ms (out over 100ms). Its links are 32px rows (14px/20px text, `py-1.5 px-3`, 8px radius) indented
//   12px per level, `bg-default` on hover and `bg-default-hover` while pressed.
export default {
  slots: {
    root: '',
    container: '',
    top: '',
    bottom: '',
    trigger: '',
    title: 'truncate',
    trailing: 'ms-auto inline-flex items-center gap-1.5',
    trailingIcon: [
      'size-4 shrink-0 text-muted lg:hidden',
      'transition-transform duration-200 ease-out motion-reduce:transition-none group-data-[state=open]:rotate-180',
    ],
    content: '',
    list: 'min-w-0',
    listWithChildren: 'ms-3',
    item: 'min-w-0',
    itemWithChildren: '',
    link: '',
    linkText: 'truncate',
    indicator: '',
    indicatorLine: '',
    indicatorActive: '',
    marks: [
      'inline-flex flex-col gap-3 rounded-sm p-1 outline-none no-highlight cursor-(--cursor-interactive)',
      'focus-visible:status-focused',
    ],
    mark: [
      'flex h-0.5 w-6 items-center',
      // 16px wide, 3px shorter per nesting level; 24px when active.
      'after:block after:h-0.5 after:w-[calc(16px-var(--toc-level,0)*3px)] after:rounded-sm after:bg-border',
      'after:transition-all after:duration-150 motion-reduce:after:transition-none',
    ],
    panel: [
      'z-(--z-index-overlay) max-h-[min(60vh,400px)] overflow-y-auto overscroll-contain rounded-2xl bg-overlay p-1.5 shadow-overlay outline-none',
      'origin-(--reka-popover-content-transform-origin)',
      // `[&:where(…)]` keeps the animation states at zero added specificity, so user utilities win.
      '[&:where([data-state=open])]:animate-in [&:where([data-state=open])]:[--tw-animation-duration:150ms] [&:where([data-state=open])]:ease-out [&:where([data-state=open])]:fade-in-0 [&:where([data-state=open])]:zoom-in-97',
      '[&:where([data-state=open])]:[&:where([data-side=left])]:slide-in-from-right-1 [&:where([data-state=open])]:[&:where([data-side=right])]:slide-in-from-left-1',
      '[&:where([data-state=closed])]:animate-out [&:where([data-state=closed])]:[--tw-animation-duration:100ms] [&:where([data-state=closed])]:ease-out [&:where([data-state=closed])]:fade-out-0 [&:where([data-state=closed])]:zoom-out-97 [&:where([data-state=closed])]:pointer-events-none',
    ],
    panelLink: [
      'relative flex w-full items-center rounded-lg py-1.5 pe-3 ps-[calc(0.75rem+var(--toc-level,0)*0.75rem)]',
      'text-start text-sm whitespace-nowrap text-muted outline-none select-none no-highlight cursor-(--cursor-interactive)',
      'hover:bg-default active:bg-default-hover focus-visible:bg-default focus-visible:status-focused',
    ],
  },
  variants: {
    variant: {
      list: {
        root: [
          'sticky top-(--header-height,0px) z-10 flex max-h-[calc(100vh-var(--header-height,0px))] flex-col overflow-y-auto',
          // A grid or flex item stretched to its row fills the whole box `sticky` moves in, so it never sticks.
          'h-fit',
          // Scrolling boxes clip what overflows them: 4px of margin turned into padding, here and on the list, keeps
          // the focus rings of the full-width trigger and links (2px offset plus 2px ring) visible without moving them.
          '-mx-1 px-1',
          'bg-background/75 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none',
        ],
        container: [
          'flex flex-col border-b border-dashed border-separator pt-4 pb-2.5 sm:pt-6 sm:pb-4.5',
          'lg:min-h-0 lg:border-0 lg:py-8',
        ],
        top: 'lg:shrink-0',
        bottom: 'hidden gap-6 lg:flex lg:shrink-0 lg:flex-col',
        trigger: [
          'group -mt-1.5 flex flex-1 items-center gap-1.5 rounded-sm py-1.5 text-sm font-semibold text-foreground outline-none',
          'focus-visible:status-focused lg:shrink-0',
        ],
        content: [
          'relative focus:outline-none',
          'data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up data-[state=closed]:overflow-hidden motion-reduce:animate-none',
          'lg:-m-1 lg:min-h-[min(calc(var(--list-height,8rem)+0.5rem),16rem)] lg:p-1',
        ],
        link: 'group relative flex items-center rounded-sm py-1 text-sm outline-none focus-visible:status-focused',
      },
      floating: {
        root: 'inline-flex',
        top: 'mb-1',
        bottom: 'mt-1',
      },
    },
    side: {
      left: {
        marks: 'items-start',
        mark: 'justify-start',
      },
      right: {
        marks: 'items-end',
        mark: 'justify-end',
      },
    },
    color: {
      default: {
        root: '[--toc-color:var(--foreground)]',
        panel: '[--toc-color:var(--foreground)]',
      },
      accent: {
        root: '[--toc-color:var(--accent)]',
        panel: '[--toc-color:var(--accent)]',
      },
      success: {
        root: '[--toc-color:var(--success)]',
        panel: '[--toc-color:var(--success)]',
      },
      warning: {
        root: '[--toc-color:var(--warning)]',
        panel: '[--toc-color:var(--warning)]',
      },
      danger: {
        root: '[--toc-color:var(--danger)]',
        panel: '[--toc-color:var(--danger)]',
      },
    },
    highlightColor: {
      default: { indicatorActive: 'bg-foreground' },
      accent: { indicatorActive: 'bg-accent' },
      success: { indicatorActive: 'bg-success' },
      warning: { indicatorActive: 'bg-warning' },
      danger: { indicatorActive: 'bg-danger' },
    },
    active: {
      true: {
        link: 'text-(--toc-color)',
        mark: 'after:w-[calc(24px-var(--toc-level,0)*3px)] after:bg-(--toc-color)',
        panelLink: 'text-(--toc-color)',
      },
      false: {
        link: 'text-muted transition-colors duration-150 hover:text-foreground motion-reduce:transition-none',
      },
    },
    highlight: {
      true: {},
      false: {},
    },
    highlightVariant: {
      straight: {},
      circuit: {},
    },
    body: {
      true: {},
    },
  },
  compoundVariants: [
    {
      variant: 'list',
      body: true,
      class: { bottom: 'mt-6' },
    },
    {
      highlight: true,
      highlightVariant: 'straight',
      class: {
        list: 'ms-2.5 border-s border-border ps-4',
        item: '-ms-px',
        itemWithChildren: '-ms-px',
        indicator: [
          'absolute ms-2.5 h-(--indicator-size) w-px translate-y-(--indicator-position) rounded-full',
          'transition-[translate,height] duration-200 ease-out motion-reduce:transition-none',
        ],
        indicatorLine: 'hidden',
        indicatorActive: 'size-full',
      },
    },
    {
      highlight: true,
      highlightVariant: 'circuit',
      class: {
        list: 'ps-6.5',
        item: '-ms-px',
        itemWithChildren: '-ms-px',
        indicator: 'absolute ms-2.5 rtl:-scale-x-100',
        indicatorLine: 'absolute inset-0 bg-border',
        indicatorActive: [
          'absolute h-(--indicator-size) w-full translate-y-(--indicator-position)',
          'transition-[translate,height] duration-200 ease-out motion-reduce:transition-none',
        ],
      },
    },
  ],
  defaultVariants: {
    variant: 'list',
    side: 'right',
    color: 'accent',
    highlightColor: 'accent',
    highlight: false,
    highlightVariant: 'straight',
  },
}
