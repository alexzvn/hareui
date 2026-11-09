// Maps props to the BEM classes of ./tabs.css (ported from @heroui/styles components/tabs.css).
// The list scroller is a ScrollShadow (overflow, hidden scrollbar and fade come from it).
export default {
  slots: {
    base: 'h-tabs',
    tabListContainer: 'h-tabs__list-container',
    scroller: '',
    // Overflow chevrons; Tabs.vue adds `inline-flex` while there's hidden content on that side.
    scrollPrev: 'h-tabs__scroll-prev',
    scrollNext: 'h-tabs__scroll-next',
    tabList: 'h-tabs__list',
    tab: 'h-tabs__tab',
    // Utilities, not CSS: an icon's own classes (an iconify class string) must not outrank them.
    tabIcon: 'me-1.5 size-4 shrink-0',
    tabIndicator: 'h-tabs__indicator',
    tabPanel: 'h-tabs__panel',
    separator: 'h-tabs__separator',
  },
  variants: {
    align: {
      center: {},
      start: { base: 'h-tabs--start' },
      end: { base: 'h-tabs--end' },
    },
    variant: {
      primary: {},
      secondary: { base: 'h-tabs--secondary' },
    },
    orientation: {
      horizontal: { base: 'h-tabs--horizontal' },
      // Utilities, not CSS: `scroller` goes to ScrollShadow's `class`.
      vertical: { base: 'h-tabs--vertical', scroller: 'h-full' },
    },
  },
  defaultVariants: {
    align: 'center',
    variant: 'primary',
    orientation: 'horizontal',
  },
}
