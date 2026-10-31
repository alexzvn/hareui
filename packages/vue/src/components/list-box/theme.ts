// Translated from @heroui/styles components/{list-box,list-box-item,list-box-section,header,empty-state,separator}.css
export default {
  slots: {
    base: [
      'relative w-full overflow-clip p-1',
      // Spacing between direct children (HeroUI avoids flex+gap for its virtualizer)
      '[&>*+*]:mt-1',
      '[&_[data-slot=separator][data-orientation=horizontal]]:ms-[3%] [&_[data-slot=separator][data-orientation=horizontal]]:w-[94%]',
    ],
    item: [
      'relative flex min-h-9 w-full items-center justify-start gap-3 rounded-2xl px-2 py-1.5 outline-none no-highlight',
      '[transition:transform_250ms_var(--ease-out-quart),box-shadow_150ms_var(--ease-out)] motion-reduce:transition-none',
      'cursor-(--cursor-interactive)',
      '[&_[data-slot=label]]:pointer-events-none [&_[data-slot=label]]:w-fit [&_[data-slot=label]]:select-none',
      '[&_[data-slot=description]]:pointer-events-none [&_[data-slot=description]]:text-wrap [&_[data-slot=description]]:select-none',
      'has-[[data-slot=list-box-item-indicator]]:pe-7',
      'data-[focus-visible=true]:status-focused',
      'active:[transform:scale(0.98)] data-[pressed=true]:[transform:scale(0.98)]',
      // `:where()` keeps hover at one class of specificity (HeroUI's `@layer components`), so a user `data-[selected=true]:bg-*` wins
      '[@media(hover:hover)]:[&:where(:hover,[data-hovered=true])]:bg-default',
      // Reka's ListboxItem sets `data-disabled=""` itself (it wins over ours), so match on presence
      'data-disabled:status-disabled',
    ],
    itemIcon: 'size-4 shrink-0',
    indicator: [
      'absolute end-2 top-1/2 flex size-4 shrink-0 -translate-y-1/2 items-center justify-center text-default-foreground',
      'transition duration-250 motion-reduce:transition-none',
      '[&_[data-slot=list-box-item-indicator--checkmark]]:size-2.5 [&_[data-slot=list-box-item-indicator--checkmark]]:transition-all [&_[data-slot=list-box-item-indicator--checkmark]]:duration-300 motion-reduce:[&_[data-slot=list-box-item-indicator--checkmark]]:transition-none',
      // HeroUI's selected-checkmark `stroke-dashoffset 250ms linear` rule is nested under the indicator, so it never matches; not ported
    ],
    section: 'flex flex-col items-start gap-0',
    header: 'w-full px-2 pt-1.5 pb-1 text-start text-xs font-medium text-muted',
    separator: 'h-px w-full shrink-0 rounded-sm border-t-0 border-b-0 bg-separator',
    emptyState: 'p-2 text-sm text-muted',
  },
  variants: {
    // Per item (`item.variant`)
    variant: {
      default: {},
      danger: {
        item: '[&_[data-slot=label]]:text-danger',
        indicator: 'text-danger',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
}
