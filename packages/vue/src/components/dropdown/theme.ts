// Translated from @heroui/styles components/{dropdown,menu-item,menu-section,header}.css.
// Menu, MenuItem and MenuSection are internal parts of Dropdown (HeroUI doesn't document them
// standalone), so the `.dropdown__popover [data-slot=dropdown-menu|menu-item]` overrides from
// dropdown.css are folded into the `menu`/`item` base classes.
// HeroUI's `.dropdown__trigger` only styles `<Dropdown.Trigger>` wrappers around non-button content;
// HareUI's default slot is the trigger itself (see the custom-trigger demo), so there's no trigger slot.
const indicator = [
  'absolute start-2 top-1/2 flex size-4 shrink-0 -translate-y-1/2 items-center justify-center text-muted',
  'transition duration-250 motion-reduce:transition-none',
  'group-data-[has-submenu=true]:start-auto group-data-[has-submenu=true]:end-2',
]

export default {
  slots: {
    popover: [
      'max-w-[48svw] max-h-(--reka-dropdown-menu-content-available-height) origin-(--reka-dropdown-menu-content-transform-origin) scroll-py-1 scrollbar overflow-y-auto overscroll-contain bg-overlay p-0 text-sm',
      // `:where` drops the specificity so a user `min-w-*` (unprefixed, sorted earlier) still wins, as it
      // does over HeroUI's component-layer `md:min-w-55`
      'md:[:where(&)]:min-w-55',
      // Mergeable forms (not arbitrary properties) so user `rounded-*` / `shadow-*` replace them, as HeroUI's component layer does
      'rounded-[min(32px,var(--radius-3xl))] shadow-overlay',
      'z-(--z-index-overlay) outline-none',
      '[&:where([data-state=open])]:animate-in [&:where([data-state=open])]:[--tw-animation-duration:150ms] [&:where([data-state=open])]:ease-smooth [&:where([data-state=open])]:fade-in-0 [&:where([data-state=open])]:zoom-in-90',
      '[&:where([data-state=open])]:[&:where([data-side=top])]:slide-in-from-bottom-1 [&:where([data-state=open])]:[&:where([data-side=bottom])]:slide-in-from-top-1 [&:where([data-state=open])]:[&:where([data-side=left])]:slide-in-from-right-1 [&:where([data-state=open])]:[&:where([data-side=right])]:slide-in-from-left-1',
      '[&:where([data-state=closed])]:animate-out [&:where([data-state=closed])]:[--tw-animation-duration:100ms] [&:where([data-state=closed])]:ease-smooth [&:where([data-state=closed])]:zoom-out-95 [&:where([data-state=closed])]:fade-out [&:where([data-state=closed])]:pointer-events-none',
    ],
    menu: [
      'relative flex w-full flex-col gap-0.5 overflow-clip p-1.5 outline-none',
      '[&_[data-slot=separator][data-orientation=horizontal]]:ms-[3%] [&_[data-slot=separator][data-orientation=horizontal]]:w-[94%]',
    ],
    item: [
      'group relative flex min-h-9 w-full items-center justify-start gap-3 rounded-2xl px-2.5 py-1.5 outline-none no-highlight',
      '[transition:transform_250ms_var(--ease-out-quart),box-shadow_150ms_var(--ease-out)] motion-reduce:transition-none',
      'cursor-(--cursor-interactive)',
      '[&_[data-slot=label]]:pointer-events-none [&_[data-slot=label]]:w-fit [&_[data-slot=label]]:select-none',
      '[&_[data-slot=description]]:pointer-events-none [&_[data-slot=description]]:text-wrap [&_[data-slot=description]]:select-none',
      '[&_[data-slot=submenu-indicator]_svg]:size-3.5',
      'has-[[data-slot=menu-item-indicator],[data-slot=submenu-indicator]]:ps-7',
      'data-[has-submenu=true]:has-[[data-slot=menu-item-indicator],[data-slot=submenu-indicator]]:ps-2 data-[has-submenu=true]:has-[[data-slot=menu-item-indicator],[data-slot=submenu-indicator]]:pe-7',
      'data-[focus-visible=true]:status-focused',
      'active:will-change-transform active:[transform:scale(0.98)] data-[pressed=true]:will-change-transform data-[pressed=true]:[transform:scale(0.98)]',
      // The highlight follows Reka's `data-highlighted` alone (the item under a moving mouse or the keyboard's item),
      // so a mouse resting on an item doesn't keep it lit once the keyboard moves on. `:where()` keeps it at one class
      // of specificity, so a user `data-[focused=true]:bg-*` wins
      '[&:where([data-highlighted])]:bg-default',
      // Selected single-mode checkmark draws in; multiple mode keeps the indicator's 300ms transition
      // (HeroUI's multiple rule wins on specificity, so scope this one to single mode)
      '[&[aria-checked=true][data-selection-mode=single]_[data-slot=menu-item-indicator--checkmark]]:[transition:stroke-dashoffset_100ms_linear] motion-reduce:[&[aria-checked=true][data-selection-mode=single]_[data-slot=menu-item-indicator--checkmark]]:transition-none',
      '[&[aria-checked=true]_[data-slot=menu-item-indicator--dot]]:scale-100 [&[aria-checked=true]_[data-slot=menu-item-indicator--dot]]:opacity-100',
      // Reka sets `data-disabled=""` on disabled items, so match on presence
      'data-disabled:status-disabled',
    ],
    indicator: [
      ...indicator,
      '[&_[data-slot=menu-item-indicator--checkmark]]:size-2.5',
      'group-data-[selection-mode=multiple]:[&_[data-slot=menu-item-indicator--checkmark]]:transition-all group-data-[selection-mode=multiple]:[&_[data-slot=menu-item-indicator--checkmark]]:duration-300',
      '[&_[data-slot=menu-item-indicator--dot]]:size-2 [&_[data-slot=menu-item-indicator--dot]]:scale-70 [&_[data-slot=menu-item-indicator--dot]]:opacity-0',
      'group-data-[selection-mode=multiple]:[&_[data-slot=menu-item-indicator--dot]]:transition-all group-data-[selection-mode=multiple]:[&_[data-slot=menu-item-indicator--dot]]:duration-250',
    ],
    submenuIndicator: [...indicator, 'text-muted'],
    section: 'flex flex-col items-start gap-0',
    header: 'w-full px-2 pt-1.5 pb-1 text-start text-xs font-medium text-muted',
    separator: 'h-px w-full shrink-0 rounded-sm border-t-0 border-b-0 bg-separator',
  },
  variants: {
    // Per item (`item.variant`)
    variant: {
      default: {},
      danger: {
        item: '[&_[data-slot=label]]:text-danger',
        indicator: 'text-danger',
        submenuIndicator: 'text-danger',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
}
