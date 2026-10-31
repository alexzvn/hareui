// A row of equal-width metrics with inset vertical dividers. `stacked` turns it into a column with full-width dividers:
// always (`true`), or below a breakpoint. Each breakpoint's classes are spelled out so Tailwind finds them in the source.
export default {
  slots: {
    base: [
      'flex flex-row rounded-2xl bg-surface shadow-surface overflow-hidden',
      '[&>[data-slot=metric]]:relative [&>[data-slot=metric]]:min-w-0 [&>[data-slot=metric]]:flex-1 [&>[data-slot=metric]]:rounded-none! [&>[data-slot=metric]]:shadow-none!',
      "[&>[data-slot=metric]+[data-slot=metric]]:before:absolute [&>[data-slot=metric]+[data-slot=metric]]:before:bg-separator [&>[data-slot=metric]+[data-slot=metric]]:before:content-['']",
      '[&>[data-slot=metric]+[data-slot=metric]]:before:inset-y-4 [&>[data-slot=metric]+[data-slot=metric]]:before:start-0 [&>[data-slot=metric]+[data-slot=metric]]:before:w-px',
    ],
  },
  variants: {
    stacked: {
      true: {
        base: [
          'flex-col',
          '[&>[data-slot=metric]+[data-slot=metric]]:before:inset-x-0 [&>[data-slot=metric]+[data-slot=metric]]:before:top-0 [&>[data-slot=metric]+[data-slot=metric]]:before:bottom-auto',
          '[&>[data-slot=metric]+[data-slot=metric]]:before:h-px [&>[data-slot=metric]+[data-slot=metric]]:before:w-auto',
        ],
      },
      false: '',
      sm: {
        base: [
          'max-sm:flex-col',
          'max-sm:[&>[data-slot=metric]+[data-slot=metric]]:before:inset-x-0 max-sm:[&>[data-slot=metric]+[data-slot=metric]]:before:top-0 max-sm:[&>[data-slot=metric]+[data-slot=metric]]:before:bottom-auto',
          'max-sm:[&>[data-slot=metric]+[data-slot=metric]]:before:h-px max-sm:[&>[data-slot=metric]+[data-slot=metric]]:before:w-auto',
        ],
      },
      md: {
        base: [
          'max-md:flex-col',
          'max-md:[&>[data-slot=metric]+[data-slot=metric]]:before:inset-x-0 max-md:[&>[data-slot=metric]+[data-slot=metric]]:before:top-0 max-md:[&>[data-slot=metric]+[data-slot=metric]]:before:bottom-auto',
          'max-md:[&>[data-slot=metric]+[data-slot=metric]]:before:h-px max-md:[&>[data-slot=metric]+[data-slot=metric]]:before:w-auto',
        ],
      },
      lg: {
        base: [
          'max-lg:flex-col',
          'max-lg:[&>[data-slot=metric]+[data-slot=metric]]:before:inset-x-0 max-lg:[&>[data-slot=metric]+[data-slot=metric]]:before:top-0 max-lg:[&>[data-slot=metric]+[data-slot=metric]]:before:bottom-auto',
          'max-lg:[&>[data-slot=metric]+[data-slot=metric]]:before:h-px max-lg:[&>[data-slot=metric]+[data-slot=metric]]:before:w-auto',
        ],
      },
      xl: {
        base: [
          'max-xl:flex-col',
          'max-xl:[&>[data-slot=metric]+[data-slot=metric]]:before:inset-x-0 max-xl:[&>[data-slot=metric]+[data-slot=metric]]:before:top-0 max-xl:[&>[data-slot=metric]+[data-slot=metric]]:before:bottom-auto',
          'max-xl:[&>[data-slot=metric]+[data-slot=metric]]:before:h-px max-xl:[&>[data-slot=metric]+[data-slot=metric]]:before:w-auto',
        ],
      },
    },
  },
  defaultVariants: {
    stacked: false,
  },
}
