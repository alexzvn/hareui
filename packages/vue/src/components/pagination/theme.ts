// Translated from @heroui/styles components/pagination.css
// Width and height are split (`w-9 h-9`, not `size-9`) so the nav modifier's `w-auto` replaces the
// width at every breakpoint, as HeroUI's later `.pagination__link--nav` rule does.
export default {
  slots: {
    base: 'flex w-full flex-col items-center justify-between gap-4 sm:flex-row',
    summary: 'flex items-center gap-2 self-start text-sm text-muted sm:self-center',
    content: 'flex items-center gap-1 self-start sm:self-center',
    item: 'inline-flex',
    link: [
      'relative isolate inline-flex h-9 w-9 origin-center items-center justify-center rounded-3xl text-sm font-medium whitespace-nowrap outline-none select-none no-highlight md:h-8 md:w-8',
      'cursor-(--cursor-interactive)',
      '[transition:transform_250ms_var(--ease-smooth),background-color_100ms_var(--ease-out),box-shadow_100ms_var(--ease-out)] transform-gpu motion-reduce:transition-none',
      '[--pagination-link-bg:transparent] [--pagination-link-bg-hover:var(--default-hover)] [--pagination-link-bg-pressed:var(--default-hover)] [--pagination-link-fg:var(--default-foreground)]',
      'data-[active=true]:[--pagination-link-bg:var(--default)]',
      'bg-(--pagination-link-bg) text-(--pagination-link-fg)',
      'focus-visible:status-focused',
      'disabled:status-disabled aria-disabled:status-disabled',
      'hover:bg-(--pagination-link-bg-hover)',
      'active:bg-(--pagination-link-bg-pressed) active:[transform:scale(0.97)]',
    ],
    // Added to `link` on Previous / Next (HeroUI's `.pagination__link--nav`).
    nav: 'w-auto gap-1.5 px-2.5 md:w-auto',
    // Icon wrappers: HeroUI flips them in RTL.
    icon: 'rtl:rotate-180',
    ellipsis: 'inline-flex h-9 w-9 items-center justify-center text-sm text-muted select-none md:h-8 md:w-8',
  },
  variants: {
    size: {
      sm: {
        summary: 'text-xs',
        link: 'h-8 w-8 text-xs md:h-7 md:w-7 active:[transform:scale(0.98)]',
        nav: 'px-2',
        ellipsis: 'h-8 w-8 text-xs md:h-7 md:w-7',
      },
      md: {},
      lg: {
        summary: 'text-base',
        link: 'h-10 w-10 text-base md:h-9 md:w-9 active:[transform:scale(0.96)]',
        nav: 'px-3',
        ellipsis: 'h-10 w-10 text-base md:h-9 md:w-9',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
}
