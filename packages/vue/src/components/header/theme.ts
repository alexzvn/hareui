// Header theme (bar height, solid background, 1024px
// container with 24px inline padding, hide-on-scroll transform) using HeroUI tokens only. The bar has no
// bottom border; add `border-b border-separator` through `class` when the page needs one.
// The bar height lives in `--header-height` (4rem by default), set inline when the `height` prop is used.
export default {
  slots: {
    root: [
      'sticky top-0 z-40 h-(--header-height) [--header-height:4rem]',
      'bg-background',
      // Hide-on-scroll: the bar keeps its layout box and only slides out.
      // It animates `transform` over `--navbar-transition-duration: .3s` with CSS `ease` (fitted from per-frame samples).
      'transition-transform duration-300 ease-[ease] motion-reduce:transition-none',
      'data-[hidden=true]:pointer-events-none data-[hidden=true]:-translate-y-full',
    ],
    // Inner row: `--navbar-max-width: 1024px`, `px-6`, `gap-4` (`--container-max-width` / `--container-padding`) at every width.
    container:
      'mx-auto flex h-full w-full max-w-(--container-max-width) px-(--container-padding) items-center justify-between gap-4',
    left: 'flex items-center gap-2',
    center: 'items-center gap-1',
    right: 'flex items-center justify-end gap-1.5',
    title:
      'flex shrink-0 items-center gap-2 rounded-lg text-lg font-semibold text-foreground no-underline outline-none focus-visible:status-focused',
    // Menu toggle: a 36px square, `--radius` corners.
    toggle: 'rounded-lg [--button-height:--spacing(9)]',
    // Toggle icon: two 24px hairlines 8px apart that rotate into an X (`transform 0.15s`, CSS `ease`).
    toggleIcon: [
      'pointer-events-none flex h-full w-6 flex-col items-center justify-center',
      'before:block before:h-px before:w-6 before:bg-current before:content-[""] after:block after:h-px after:w-6 after:bg-current after:content-[""]',
      'before:transition-transform before:duration-150 before:ease-[ease] after:transition-transform after:duration-150 after:ease-[ease] motion-reduce:before:transition-none motion-reduce:after:transition-none',
      'before:-translate-y-1 after:translate-y-1',
      'data-[open=true]:before:translate-y-[0.5px] data-[open=true]:before:rotate-45 data-[open=true]:after:-translate-y-[0.5px] data-[open=true]:after:-rotate-45',
    ],
    // The menu panel (Modal/Drawer dialog).
    content: 'p-0',
    // The menu backdrop, positioned on the region the Header measures: from the bar's top edge to the bottom of the
    // viewport, across the bar's width (the whole viewport for a full-width sticky header).
    overlay:
      'inset-auto top-(--header-menu-top) left-(--header-menu-left) h-(--header-menu-height) w-(--header-menu-width)',
    // The menu's own header row repeats the bar (same height and container), so brand and toggle sit exactly over the bar's.
    header: 'flex h-(--header-height) shrink-0 [--header-height:4rem]',
    // Same inline padding and max width as `container`, so the item pills line up with the brand (px-6 pt-2 pb-6).
    body: 'mx-auto min-h-0 w-full max-w-(--container-max-width) px-(--container-padding) flex-1 overflow-y-auto overscroll-contain pt-2 pb-6 text-foreground',
  },
  variants: {
    // The viewport width from which the `default` slot shows inline and the menu (toggle + overlay) is dropped.
    // `none` keeps the collapsed layout at every width.
    breakpoint: {
      sm: {
        left: 'sm:flex-1',
        center: 'hidden sm:flex',
        right: 'sm:flex-1',
        toggle: 'sm:hidden',
        content: 'sm:hidden',
        overlay: 'sm:hidden',
      },
      md: {
        left: 'md:flex-1',
        center: 'hidden md:flex',
        right: 'md:flex-1',
        toggle: 'md:hidden',
        content: 'md:hidden',
        overlay: 'md:hidden',
      },
      lg: {
        left: 'lg:flex-1',
        center: 'hidden lg:flex',
        right: 'lg:flex-1',
        toggle: 'lg:hidden',
        content: 'lg:hidden',
        overlay: 'lg:hidden',
      },
      xl: {
        left: 'xl:flex-1',
        center: 'hidden xl:flex',
        right: 'xl:flex-1',
        toggle: 'xl:hidden',
        content: 'xl:hidden',
        overlay: 'xl:hidden',
      },
      none: {
        center: 'hidden',
      },
    },
    // Pull the 36px toggle out by the gap around its 24px icon, so the icon's edge sits on the container padding like the brand's.
    toggleSide: {
      left: { toggle: '-ms-1.5' },
      right: { toggle: '-me-1.5' },
    },
    mode: {
      // Menu: the bar's own background continues below it, no panel shadow.
      modal: { content: 'bg-background shadow-none' },
      // The panel width is relative to the anchored region rather than the viewport.
      slideover: { content: 'max-w-[85%]' },
      // A bottom sheet has no header row; it also stays within the region.
      drawer: { content: 'max-h-[min(85vh,100%)]', body: 'pt-6' },
    },
  },
  defaultVariants: {
    breakpoint: 'lg',
  },
}
