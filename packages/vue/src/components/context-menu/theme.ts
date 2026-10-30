// The menu reuses the Dropdown menu internals, so its slots extend the Dropdown theme.
import dropdown from '@/components/dropdown/theme'

export default {
  slots: {
    ...dropdown.slots,
    trigger: 'relative',
    popover: [
      'max-h-(--reka-popper-available-height) origin-(--reka-popper-transform-origin) scroll-py-1 scrollbar overflow-y-auto overscroll-contain bg-overlay p-0 text-sm',
      // Phones get the viewport minus the 12px collision padding on each side, so labels don't wrap
      'max-w-[min(100svw-1.5rem,24rem)] md:max-w-[min(48svw,24rem)]',
      // 220px wide at least; `:where` drops the specificity so a user `min-w-*` still wins
      '[:where(&)]:min-w-55',
      'rounded-[min(32px,var(--radius-3xl))] shadow-overlay',
      'z-(--z-index-overlay) outline-none',
      '[&:where([data-state=open])]:animate-in [&:where([data-state=open])]:[--tw-animation-duration:150ms] [&:where([data-state=open])]:ease-smooth [&:where([data-state=open])]:fade-in-0 [&:where([data-state=open])]:zoom-in-90',
      '[&:where([data-state=open])]:[&:where([data-side=top])]:slide-in-from-bottom-1 [&:where([data-state=open])]:[&:where([data-side=bottom])]:slide-in-from-top-1 [&:where([data-state=open])]:[&:where([data-side=left])]:slide-in-from-right-1 [&:where([data-state=open])]:[&:where([data-side=right])]:slide-in-from-left-1',
      '[&:where([data-state=closed])]:animate-out [&:where([data-state=closed])]:[--tw-animation-duration:100ms] [&:where([data-state=closed])]:ease-smooth [&:where([data-state=closed])]:zoom-out-95 [&:where([data-state=closed])]:fade-out [&:where([data-state=closed])]:pointer-events-none',
      'motion-reduce:animate-none',
    ],
    item: [...dropdown.slots.item, 'px-2'],
    separator: [dropdown.slots.separator, 'my-1'],
  },
  variants: dropdown.variants,
  defaultVariants: dropdown.defaultVariants,
}
