// Translated from @heroui/styles components/tabs.css
// The list scroller is a ScrollShadow (overflow, hidden scrollbar and fade come from it).
export default {
  slots: {
    base: 'flex gap-2 data-[orientation=horizontal]:flex-col data-[orientation=vertical]:flex-row',
    tabListContainer: 'relative bg-default [border-radius:calc(var(--radius)*2.5)]',
    scroller: '',
    // Overflow chevrons; Tabs.vue adds `inline-flex` while there's hidden content on that side.
    scrollPrev: [
      'absolute z-2 hidden size-4 cursor-(--cursor-interactive) items-center justify-center rounded-full border-0 bg-transparent p-0 text-foreground outline-none',
      '[transition:opacity_150ms_var(--ease-smooth)] motion-reduce:transition-none',
      '[@media(hover:hover)]:hover:opacity-70 focus-visible:status-focused',
    ],
    scrollNext: [
      'absolute z-2 hidden size-4 cursor-(--cursor-interactive) items-center justify-center rounded-full border-0 bg-transparent p-0 text-foreground outline-none',
      '[transition:opacity_150ms_var(--ease-smooth)] motion-reduce:transition-none',
      '[@media(hover:hover)]:hover:opacity-70 focus-visible:status-focused',
    ],
    tabList: 'isolate inline-flex p-1 data-[orientation=horizontal]:w-max data-[orientation=horizontal]:min-w-full data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col data-[orientation=vertical]:gap-1',
    tab: [
      'relative flex h-8 w-full items-center justify-center rounded-3xl px-4 text-center text-sm font-medium text-muted outline-none no-highlight',
      'z-[1] cursor-(--cursor-interactive)',
      '[transition:color_150ms_var(--ease-smooth),background-color_150ms_var(--ease-smooth),box-shadow_150ms_var(--ease-out),opacity_150ms_var(--ease-smooth)] motion-reduce:transition-none',
      'data-[state=active]:text-segment-foreground',
      'disabled:status-disabled data-disabled:status-disabled aria-disabled:status-disabled',
      '[@media(hover:hover){&:not([data-state=active]):not([data-disabled]):hover}]:opacity-70',
      'focus-visible:status-focused',
      'data-[orientation=vertical]:min-w-20',
    ],
    tabIndicator: [
      'absolute start-0 top-0 rounded-3xl bg-segment shadow-surface -z-1',
      'text-center text-sm leading-5 font-medium text-segment-foreground cursor-(--cursor-interactive)',
      '[transition-duration:250ms] [transition-property:translate,width,height] [transition-timing-function:var(--ease-out-fluid)] motion-reduce:transition-none',
      'w-(--tabs-indicator-width) h-(--tabs-indicator-height) translate-x-(--tabs-indicator-x) translate-y-(--tabs-indicator-y)',
    ],
    tabPanel: 'w-full p-2 outline-none',
    separator: [
      'pointer-events-none absolute rounded-sm bg-muted/25',
      '[transition:opacity_150ms_var(--ease-smooth)] motion-reduce:transition-none',
      'data-[orientation=horizontal]:start-0 data-[orientation=horizontal]:top-1/4 data-[orientation=horizontal]:h-1/2 data-[orientation=horizontal]:w-px',
      'data-[orientation=vertical]:start-[5%] data-[orientation=vertical]:top-0 data-[orientation=vertical]:h-px data-[orientation=vertical]:w-[90%]',
    ],
  },
  variants: {
    align: {
      center: {},
      start: { tab: 'justify-start text-start', tabIndicator: 'text-start' },
      end: { tab: 'justify-end text-end', tabIndicator: 'text-end' },
    },
    variant: {
      primary: {},
      secondary: {
        tabListContainer: 'rounded-none bg-transparent',
        tabList: 'p-0',
        tab: 'rounded-none data-[state=active]:text-foreground',
        tabIndicator: 'rounded-none bg-accent text-foreground shadow-none',
        separator: 'hidden',
      },
    },
    orientation: {
      horizontal: {
        scrollPrev: 'start-1 top-1/2 -translate-y-1/2 rtl:rotate-180',
        scrollNext: 'end-1 top-1/2 -translate-y-1/2 rtl:rotate-180',
      },
      vertical: {
        scroller: 'h-full',
        scrollPrev: 'top-1 left-1/2 -translate-x-1/2',
        scrollNext: 'bottom-1 left-1/2 -translate-x-1/2',
      },
    },
  },
  compoundVariants: [
    {
      variant: 'secondary',
      orientation: 'horizontal',
      class: { tabListContainer: 'border-b border-border', tabIndicator: 'top-auto bottom-0 h-0.5 translate-y-0' },
    },
    {
      variant: 'secondary',
      orientation: 'vertical',
      class: { tabListContainer: 'border-s border-border', tabIndicator: 'start-0 w-0.5 translate-x-0' },
    },
  ],
  defaultVariants: {
    align: 'center',
    variant: 'primary',
    orientation: 'horizontal',
  },
}
