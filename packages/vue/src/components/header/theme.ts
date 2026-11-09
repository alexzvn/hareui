// Maps props to the BEM classes of ./header.css. The bar height lives in `--header-height` (4rem by default), set inline
// when the `height` prop is used. The bar has no bottom border; add `border-b border-separator` through `class`.
export default {
  slots: {
    root: 'h-header',
    container: 'h-header__container',
    left: 'h-header__left',
    center: 'h-header__center',
    right: 'h-header__right',
    title: 'h-header__title',
    toggle: 'h-header__toggle',
    toggleIcon: 'h-header__toggle-icon',
    // Utilities, not CSS: `content` and `overlay` go to the menu Modal/Drawer's `ui.dialog` / `ui.backdrop`, where they
    // must beat that component's own styles.
    // The menu panel (Modal/Drawer dialog).
    content: 'p-0',
    // The menu backdrop, positioned on the region the Header measures: from the bar's top edge to the bottom of the
    // viewport, across the bar's width (the whole viewport for a full-width sticky header).
    overlay:
      'inset-auto top-(--header-menu-top) left-(--header-menu-left) h-(--header-menu-height) w-(--header-menu-width)',
    header: 'h-header__menu-header',
    body: 'h-header__menu-body',
  },
  variants: {
    // The viewport width from which the `default` slot shows inline and the menu (toggle + overlay) is dropped.
    // `none` keeps the collapsed layout at every width.
    breakpoint: {
      sm: {
        left: 'h-header__left--sm',
        center: 'h-header__center--sm',
        right: 'h-header__right--sm',
        toggle: 'h-header__toggle--sm',
        content: 'sm:hidden',
        overlay: 'sm:hidden',
      },
      md: {
        left: 'h-header__left--md',
        center: 'h-header__center--md',
        right: 'h-header__right--md',
        toggle: 'h-header__toggle--md',
        content: 'md:hidden',
        overlay: 'md:hidden',
      },
      lg: {
        left: 'h-header__left--lg',
        center: 'h-header__center--lg',
        right: 'h-header__right--lg',
        toggle: 'h-header__toggle--lg',
        content: 'lg:hidden',
        overlay: 'lg:hidden',
      },
      xl: {
        left: 'h-header__left--xl',
        center: 'h-header__center--xl',
        right: 'h-header__right--xl',
        toggle: 'h-header__toggle--xl',
        content: 'xl:hidden',
        overlay: 'xl:hidden',
      },
      none: {
        center: 'h-header__center--none',
      },
    },
    toggleSide: {
      left: { toggle: 'h-header__toggle--left' },
      right: { toggle: 'h-header__toggle--right' },
    },
    mode: {
      // Menu: the bar's own background continues below it, no panel shadow.
      modal: { content: 'bg-background shadow-none' },
      // The panel width is relative to the anchored region rather than the viewport.
      slideover: { content: 'max-w-[85%]' },
      // A bottom sheet has no header row; it also stays within the region.
      drawer: { content: 'max-h-[min(85vh,100%)]', body: 'h-header__menu-body--drawer' },
    },
  },
  defaultVariants: {
    breakpoint: 'lg',
  },
}
