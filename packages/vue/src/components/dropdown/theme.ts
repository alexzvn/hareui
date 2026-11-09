// Maps props to the BEM classes of ./dropdown.css (ported from @heroui/styles
// components/{dropdown,menu-item,menu-section,header}.css).
// Menu, MenuItem and MenuSection are internal parts of Dropdown (HeroUI doesn't document them
// standalone), so the `.dropdown__popover [data-slot=dropdown-menu|menu-item]` overrides from
// dropdown.css are folded into the `menu`/`item` classes.
// HeroUI's `.dropdown__trigger` only styles `<Dropdown.Trigger>` wrappers around non-button content;
// HareUI's default slot is the trigger itself (see the custom-trigger demo), so there's no trigger slot.
export default {
  slots: {
    popover: 'h-dropdown__popover',
    menu: 'h-dropdown__menu',
    // `group`: the indicators react to the item's state, and item slots can use `group-*` variants
    item: 'group h-dropdown__item',
    indicator: 'h-dropdown__indicator',
    submenuIndicator: 'h-dropdown__submenu-indicator',
    // `item.icon`, in the leading position before the label. Utilities, not CSS: an icon's own classes (an iconify class
    // string) must not outrank them.
    itemIcon: 'size-4 shrink-0 text-muted',
    section: 'h-dropdown__section',
    header: 'h-dropdown__header',
    separator: 'h-dropdown__separator',
  },
  variants: {
    // Per item (`item.variant`)
    variant: {
      default: {},
      danger: {
        // Utilities, not CSS: they must outrank the Label's own `text-foreground`.
        item: '[&_[data-slot=label]]:text-danger',
        indicator: 'h-dropdown__indicator--danger',
        submenuIndicator: 'h-dropdown__submenu-indicator--danger',
        itemIcon: 'text-danger',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
}
