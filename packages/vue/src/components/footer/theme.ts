// Footer theme with HeroUI tokens: separator border, muted text.
// Spacing follows heroui.com's site footer (one 44px row on wide screens, 8px gaps), and the container matches the
// Header bar (1024px, 24px inline padding) so both bars line up on a page.
export default {
  slots: {
    root: 'border-t border-separator text-sm text-muted',
    top: 'py-8 lg:py-12',
    bottom: 'py-8 lg:py-12',
    container: 'mx-auto w-full max-w-(--container-max-width) px-(--container-padding) py-4 lg:flex lg:items-center lg:justify-between lg:gap-x-3 lg:py-3',
    left: 'mt-2 flex items-center justify-center gap-x-2 lg:order-1 lg:mt-0 lg:flex-1 lg:justify-start',
    center: 'mt-2 flex items-center justify-center lg:order-2 lg:mt-0',
    right: 'flex items-center justify-center gap-x-2 lg:order-3 lg:flex-1 lg:justify-end',
  },
}
