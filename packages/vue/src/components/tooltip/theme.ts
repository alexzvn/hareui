// Maps the slots to the BEM classes of ./tooltip.css (ported from @heroui/styles components/tooltip.css).
export default {
  slots: {
    base: 'h-tooltip',
    arrow: '',
    kbds: 'h-tooltip__kbds',
    // Utilities, not CSS: they go to Kbd's `ui.base` and must beat `.h-kbd`'s size, radius and padding. A compact
    // key: 20px tall to fit the 12px tooltip text.
    kbd: 'h-5 rounded-md px-1.5 text-xs',
  },
}
