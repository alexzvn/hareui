// Maps props to the BEM classes of ./context-menu.css. The menu reuses the Dropdown menu internals, so its slots
// extend the Dropdown theme.
import dropdown from '@/components/dropdown/theme'

export default {
  slots: {
    ...dropdown.slots,
    trigger: 'h-context-menu__trigger',
    popover: 'h-context-menu__popover',
    item: [dropdown.slots.item, 'h-context-menu__item'],
    separator: [dropdown.slots.separator, 'h-context-menu__separator'],
  },
  variants: dropdown.variants,
  defaultVariants: dropdown.defaultVariants,
}
