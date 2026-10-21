// Navigation menu on HeroUI tokens:
// vertical = sidebar menu (36px rows, rounded-2xl, bg-default hover/current, muted icons,
// guide lines on nested lists), horizontal = navbar items (text-muted -> foreground, rounded-lg).
// Colour strings are literals so Tailwind can scan them.
export default {
  slots: {
    root: 'relative flex [&>div]:min-w-0',
    list: 'isolate min-w-0',
    label: 'flex w-full items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-muted select-none',
    item: 'min-w-0',
    link: 'group relative flex w-full min-w-0 items-center text-start text-sm no-highlight outline-none cursor-(--cursor-interactive) focus-visible:status-focused',
    linkLeadingIcon: 'size-4 shrink-0',
    linkLeadingAvatar: 'size-5 shrink-0 rounded-full',
    linkLeadingChip: '',
    linkLeadingAvatarSize: 'sm',
    linkLeadingChipSize: 'sm',
    linkTrailing: 'group ms-auto inline-flex shrink-0 items-center gap-1.5',
    linkTrailingBadge: 'shrink-0 text-muted tabular-nums',
    linkTrailingKbd: 'shrink-0',
    // Chevron: `transition: rotate 0.15s` (CSS default `ease`)
    linkTrailingIcon: 'size-3.5 shrink-0 text-muted transition-[rotate] duration-150 ease-[ease] motion-reduce:transition-none',
    linkLabel: 'min-w-0 flex-1 truncate text-start',
    linkLabelExternalIcon: 'ms-1 inline-block size-3 align-top text-muted',
    // Per-item actions, vertical only: a sibling of the link laid over
    // its end, so the link keeps the row's background, ring and highlight. The link's end padding,
    // `--navigation-menu-actions-inset` (the buttons' measured width + 20px), keeps its label clear of them.
    linkRow: 'group/row relative',
    // Shown on row hover, keyboard focus, an open menu and the current row, and always in the mobile
    // sheet; here they fade instead of popping in, and stay on touch screens and inside a dialog.
    linkActions: [
      'absolute inset-y-0 end-2 z-1 flex items-center gap-1 opacity-0 transition-opacity duration-150 ease-out motion-reduce:transition-none',
      '[@media(hover:hover)]:group-hover/row:opacity-100 group-has-focus-visible/row:opacity-100 has-aria-expanded:opacity-100 group-data-active/row:opacity-100 [@media(hover:none)]:opacity-100 in-[[role=dialog]]:opacity-100',
    ],
    // Action button: 24px, 4px padding, 8px radius, transparent -> `default-hover`, pressed scale .98
    linkAction: [
      'relative flex size-6 shrink-0 items-center justify-center rounded-lg p-1 text-default-foreground outline-none no-highlight cursor-(--cursor-interactive)',
      '[transition:transform_250ms_var(--ease-smooth),background-color_100ms_var(--ease-out),box-shadow_100ms_var(--ease-out)] motion-reduce:transition-none',
      '[@media(hover:hover)]:hover:bg-default-hover aria-expanded:bg-default-hover active:[transform:scale(0.98)] focus-visible:status-focused',
      '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    ],
    // The `actions` menu popover: `w-44`, under the Dropdown's 220px `md:` minimum
    linkActionsMenu: 'w-44',
    // Icons of the `actions` menu entries (16px, `text-muted`, `text-danger` on destructive entries)
    linkActionsItemIcon: 'size-4 shrink-0 text-muted',
    childList: 'isolate',
    childLabel: 'text-xs font-medium text-muted',
    childItem: '',
    childLink: 'group relative flex size-full items-start text-start text-sm no-highlight outline-none cursor-(--cursor-interactive) focus-visible:status-focused',
    childLinkWrapper: 'min-w-0',
    childLinkIcon: 'size-4 shrink-0',
    childLinkLabel: 'truncate',
    childLinkLabelExternalIcon: 'ms-1 inline-block size-3 align-top text-muted',
    childLinkDescription: 'text-xs text-muted',
    // Separator: full-width 1px rule, 12px from the groups on each side
    separator: 'my-3 h-px shrink-0 bg-separator',
    viewportWrapper: 'absolute top-full start-0 flex w-full',
    viewport: [
      'relative z-1 mt-1.5 h-(--reka-navigation-menu-viewport-height) w-full origin-[top_center] overflow-hidden bg-overlay shadow-overlay',
      'rounded-[min(32px,var(--radius-3xl))]',
      // Size/position morph between triggers: 200ms, synced with the content slide and the indicator.
      'transition-[width,height,left,right] duration-200 ease-[ease] motion-reduce:transition-none',
      // Open/close: enter 150ms `ease` from opacity 0, scale .9, -4px; exit 100ms to opacity 0, scale .95.
      'data-[state=open]:animate-in data-[state=open]:animation-duration-150 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-90 data-[state=open]:slide-in-from-top-1 data-[state=closed]:animate-out data-[state=closed]:animation-duration-100 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
    ],
    content: '',
    // No `data-[state=hidden]:opacity-0`: tw-animate's `exit` keyframe starts from the computed opacity, so a
    // hidden-state opacity of 0 would cut the arrow instantly; `fill-mode-forwards` holds 0 until Reka unmounts it.
    indicator: 'absolute bottom-0 left-0 z-2 flex h-2.5 w-(--reka-navigation-menu-indicator-size) translate-x-(--reka-navigation-menu-indicator-position) items-end justify-center overflow-hidden transition-[translate,width] duration-200 ease-[ease] data-[state=hidden]:animate-out data-[state=hidden]:fade-out-0 data-[state=hidden]:fill-mode-forwards data-[state=visible]:animate-in data-[state=visible]:fade-in-0 motion-reduce:transition-none',
    arrow: 'relative top-[50%] z-1 size-2.5 rotate-45 rounded-xs bg-overlay',
  },
  variants: {
    color: {
      accent: {},
      default: {},
      success: {},
      warning: {},
      danger: {},
    },
    highlightColor: {
      accent: {},
      default: {},
      success: {},
      warning: {},
      danger: {},
    },
    variant: {
      pill: {},
      link: {},
    },
    orientation: {
      horizontal: {
        root: 'items-center justify-between gap-1.5',
        list: 'flex items-center gap-1',
        link: 'gap-2 rounded-lg px-3 py-1.5',
        linkLeadingIcon: 'size-5',
        linkTrailingIcon: 'group-data-[state=open]:rotate-180',
        childList: 'grid p-1.5',
        childLink: 'gap-3 rounded-xl px-2.5 py-2',
        childLinkLabel: 'font-medium',
        content: 'absolute top-0 start-0 max-h-[70vh] w-full overflow-y-auto',
      },
      vertical: {
        root: 'flex-col',
        list: 'flex flex-col gap-0.5',
        // Group label sits 4px above the first row (2px list gap + 2px)
        label: 'mb-0.5',
        link: 'min-h-9 gap-3 rounded-2xl px-2 py-1.5',
        linkLeadingIcon: 'mx-0.5 text-muted',
        childList: 'flex flex-col gap-0.5',
        childLabel: 'px-2 py-1.5',
        childLink: 'min-h-9 items-center gap-3 rounded-2xl px-2 py-1.5',
        childLinkIcon: 'mx-0.5',
        // 3px inset: centres the 14px chevron in a 20px trigger box
        linkTrailingIcon: 'mx-0.75 group-data-[state=open]:rotate-90',
      },
    },
    contentOrientation: {
      horizontal: {
        viewportWrapper: 'justify-center',
        // 200ms like the viewport morph, so the old and new panels finish sliding when the size settles.
        content: 'duration-200 ease-[ease] data-[motion=from-start]:animate-in data-[motion=from-start]:fade-in-0 data-[motion=from-start]:slide-in-from-left-8 data-[motion=from-end]:animate-in data-[motion=from-end]:fade-in-0 data-[motion=from-end]:slide-in-from-right-8 data-[motion=to-start]:animate-out data-[motion=to-start]:fade-out-0 data-[motion=to-start]:slide-out-to-left-8 data-[motion=to-end]:animate-out data-[motion=to-end]:fade-out-0 data-[motion=to-end]:slide-out-to-right-8',
      },
      vertical: {
        // Below `sm` the viewport spans the menu; from `sm` it follows the trigger, clamped inside the menu's width.
        viewport: 'sm:left-[clamp(0px,var(--reka-navigation-menu-viewport-left),calc(100%-var(--reka-navigation-menu-viewport-width)))] sm:w-(--reka-navigation-menu-viewport-width) sm:rtl:right-[clamp(0px,calc(100%-var(--reka-navigation-menu-viewport-left)-var(--reka-navigation-menu-viewport-width)),calc(100%-var(--reka-navigation-menu-viewport-width)))] sm:rtl:left-auto',
      },
    },
    active: {
      true: {
        childLink: 'bg-default text-foreground',
        childLinkIcon: 'text-foreground',
      },
      false: {
        link: 'text-muted',
        childLink: 'text-foreground [@media(hover:hover)]:hover:bg-default',
        childLinkIcon: 'text-muted',
      },
    },
    disabled: {
      true: {
        link: 'status-disabled',
      },
    },
    highlight: {
      true: {},
    },
    level: {
      true: {},
    },
    collapsed: {
      true: {},
    },
    // Per link: the item has an actions container next to it. The end padding applies once it renders something
    // (an `#item-actions` slot can render nothing for some items); 2.75rem = one 24px button, before it's measured.
    actions: {
      true: { link: 'group-has-[[data-slot=linkActions]:not(:empty)]/row:pe-[var(--navigation-menu-actions-inset,2.75rem)]' },
    },
    // Per `actions` entry: a destructive one
    danger: {
      true: { linkActionsItemIcon: 'text-danger' },
    },
  },
  compoundVariants: [
    // Horizontal content: two-column cards, or a single narrow column when the viewport is vertical
    { orientation: 'horizontal', contentOrientation: 'horizontal', class: { childList: 'grid-cols-2 gap-1' } },
    { orientation: 'horizontal', contentOrientation: 'vertical', class: { childList: 'gap-0.5', content: 'w-full sm:w-60' } },
    // Vertical expanded: nested rows indented 16px (`--sidebar-menu-indent`) and stacked with no gap (36px
    // step), 2px kept between the parent and its first child (`pt-0.5`) and, through the parent list's gap, after
    // the last one. The guide line at indent/2 spans 1px into those gaps (per-row line: 1px above the first
    // row to 1px below the last; `data-guide-lines="always"`). The expand/collapse motion lives in
    // `NavigationMenuAccordionContent.vue`.
    {
      orientation: 'vertical',
      collapsed: false,
      class: {
        childList: 'relative gap-0 ps-4 pt-0.5 before:pointer-events-none before:absolute before:top-px before:-bottom-px before:start-2 before:w-px before:bg-foreground/10 before:content-[""]',
      },
    },
    // Vertical collapsed (icon rail): the link is a lone icon; labels and trailing content vanish.
    // The rail row is a 36px square (48px rail minus 6px padding); `min-w-9` keeps that without a sized parent.
    // The row keeps its `px-2` start-aligned layout rather than centring: in a 36px row the icon lands centred
    // anyway (8 + 2px inset), and it never re-centres in the still-wide sidebar on the first collapse frame.
    {
      orientation: 'vertical',
      collapsed: true,
      class: {
        label: 'hidden',
        link: 'min-w-9',
        linkLabel: 'hidden',
        linkTrailing: 'hidden',
        childList: 'p-1.5',
        content: 'min-w-44',
      },
    },
    // Highlight: a line next to the active item
    {
      orientation: 'horizontal',
      highlight: true,
      class: { link: 'after:absolute after:inset-x-3 after:-bottom-1 after:block after:h-px after:rounded-full' },
    },
    {
      orientation: 'vertical',
      highlight: true,
      level: true,
      class: { link: 'after:absolute after:inset-y-0 after:-start-2 after:block after:w-px after:rounded-full' },
    },
    // Rows
    { orientation: 'vertical', variant: 'pill', class: { link: 'text-foreground' } },
    { orientation: 'vertical', active: true, class: { link: 'font-medium' } },
    // Hover / open
    {
      disabled: false,
      active: false,
      class: { link: '[@media(hover:hover)]:hover:text-foreground' },
    },
    {
      disabled: false,
      active: false,
      orientation: 'horizontal',
      class: { link: 'data-[state=open]:text-foreground' },
    },
    {
      disabled: false,
      active: false,
      variant: 'pill',
      class: { link: '[@media(hover:hover)]:hover:bg-default' },
    },
    // A row with actions: hovering the buttons, or an open actions menu, keeps the row lit.
    {
      disabled: false,
      active: false,
      actions: true,
      class: { link: '[@media(hover:hover)]:group-hover/row:text-foreground group-has-[[data-slot=linkActions]_[aria-expanded=true]]/row:text-foreground' },
    },
    {
      disabled: false,
      active: false,
      actions: true,
      variant: 'pill',
      class: { link: '[@media(hover:hover)]:group-hover/row:bg-default group-has-[[data-slot=linkActions]_[aria-expanded=true]]/row:bg-default' },
    },
    {
      disabled: false,
      variant: 'pill',
      orientation: 'horizontal',
      class: { link: 'data-[state=open]:bg-default' },
    },
    { variant: 'pill', active: true, class: { link: 'bg-default' } },
    // Active colour: text and icon
    { color: 'accent', active: true, class: { link: 'text-accent', linkLeadingIcon: 'text-accent' } },
    { color: 'success', active: true, class: { link: 'text-success', linkLeadingIcon: 'text-success' } },
    { color: 'warning', active: true, class: { link: 'text-warning', linkLeadingIcon: 'text-warning' } },
    { color: 'danger', active: true, class: { link: 'text-danger', linkLeadingIcon: 'text-danger' } },
    { color: 'default', active: true, class: { link: 'text-foreground', linkLeadingIcon: 'text-foreground' } },
    // Highlight line colour
    { highlightColor: 'accent', highlight: true, active: true, class: { link: 'after:bg-accent' } },
    { highlightColor: 'success', highlight: true, active: true, class: { link: 'after:bg-success' } },
    { highlightColor: 'warning', highlight: true, active: true, class: { link: 'after:bg-warning' } },
    { highlightColor: 'danger', highlight: true, active: true, class: { link: 'after:bg-danger' } },
    { highlightColor: 'default', highlight: true, active: true, class: { link: 'after:bg-foreground' } },
  ],
  defaultVariants: {
    color: 'default',
    highlightColor: 'default',
    variant: 'pill',
  },
}
