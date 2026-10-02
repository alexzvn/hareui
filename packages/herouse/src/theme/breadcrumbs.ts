// Translated from @heroui/styles components/breadcrumbs.css
// `link` is merged onto the Link component's own classes (HeroUI's `link breadcrumbs__link`).
export default {
  slots: {
    base: 'flex items-center gap-1.5',
    item: 'flex shrink-0 items-center justify-center gap-1',
    link: [
      'relative text-sm leading-5 font-medium text-muted no-underline opacity-100',
      // HeroUI's `[data-current]` rule outranks `.link[aria-disabled]` (the current item is disabled).
      'data-[current=true]:text-link data-[current=true]:aria-disabled:opacity-100',
      'hover:underline',
    ].join(' '),
    separator: 'size-3 text-muted rtl:rotate-180',
  },
  variants: {},
  defaultVariants: {},
}
