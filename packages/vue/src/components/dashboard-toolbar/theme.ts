// Dashboard toolbar row: bg-background, border-b border-border, px-4 py-2.
// Content that does not fit scrolls sideways (no visible scrollbar); the groups never shrink, so
// their items keep their size instead of wrapping.
export default {
  slots: {
    root: 'flex min-h-[49px] shrink-0 items-center justify-between gap-2 overflow-x-auto overscroll-x-contain border-b border-border bg-background px-4 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    left: 'flex shrink-0 items-center gap-2',
    right: 'flex shrink-0 items-center gap-2',
  },
}
