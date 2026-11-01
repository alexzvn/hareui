// ActionBar: a fixed, bottom-centred row (24px from the bottom, plus the bottom safe-area inset so it clears the home
// indicator in `viewport-fit=cover` pages; full width, `pointer-events-none`) holding a Toolbar pill that takes
// pointer events back.
// - The pill: `rounded-3xl`, `shadow-overlay`, 6px × 12px padding (4px × 8px below 640px). `attached` only toggles
//   the toolbar's `bg-surface`; radius, shadow and padding stay.
// - Sections: prefix gap 10px (6px below 640px), content gap 4px; Separators between them are half the row height.
// - Enter/exit: opacity 0 → 1 and translateY 8px → 0 (reversed on exit) over 300ms on a critically damped spring,
//   sampled as `linear()`. Off under `prefers-reduced-motion`, so the bar appears and disappears at once.
// - `label`: text-sm medium, visually hidden (`sr-only`) below 640px so buttons collapse to their icons.
// State variants use `[&:where([data-…])]:` (zero added specificity), as in theme/modal.ts.
export default {
  slots: {
    base: [
      'pointer-events-none fixed inset-x-0 bottom-[calc(--spacing(6)+env(safe-area-inset-bottom,0px))] z-50 flex justify-center',
      'duration-300 ease-[linear(0,0.1342_6.9%,0.3638_13.8%,0.5692_20.7%,0.7222_27.6%,0.8267_34.5%,0.8944_41.4%,0.9367_48.3%,0.9626_55.2%,0.9782_62.1%,0.9874_69%,0.9927_75.9%,0.9959_82.8%,0.9976_89.7%,0.9987_96.6%,1)]',
      '[&:where([data-state=open])]:animate-in [&:where([data-state=open])]:fade-in-0 [&:where([data-state=open])]:slide-in-from-bottom-2',
      '[&:where([data-state=closed])]:animate-out [&:where([data-state=closed])]:fade-out-0 [&:where([data-state=closed])]:slide-out-to-bottom-2',
      'motion-reduce:[&:where([data-state=open])]:animate-none motion-reduce:[&:where([data-state=closed])]:animate-none',
    ],
    toolbar: 'pointer-events-auto rounded-3xl p-1.5 px-3 shadow-overlay max-sm:p-1 max-sm:px-2',
    prefix: 'flex items-center gap-2.5 max-sm:gap-1.5',
    content: 'flex items-center gap-1',
    suffix: 'flex items-center',
    label: 'text-sm font-medium max-sm:sr-only',
  },
  variants: {
    orientation: {
      horizontal: {},
      vertical: { prefix: 'flex-col', content: 'flex-col', suffix: 'flex-col' },
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  } as const,
}
