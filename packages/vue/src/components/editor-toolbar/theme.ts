// Editor toolbar:
// `fixed` is a wrapping row, 48px minimum height, 8px padding and 4px gaps. `bubble` and `floating` sit
// in a 24px-radius overlay card with 4px padding and the overlay shadow.
// Groups are 4px-gap rows split by a 1px x 24px separator line with 4px of margin on each side.
// Buttons are 32px round icon buttons; a pressed toggle shows the accent-soft fill and accent text.
// The link popover is a 320px, 16px-radius overlay card: a 12px-padded column holding the URL field and
// a right-aligned row of Remove and Apply.
export default {
  slots: {
    root: 'z-50 rounded-3xl bg-overlay p-1 shadow-overlay',
    base: 'flex items-center gap-1',
    group: 'flex items-center gap-1',
    separator: 'mx-1 h-6 w-px shrink-0 self-center rounded-sm bg-separator',
    button: 'shrink-0 [--toggle-button-fg-selected:var(--accent)]',
    urlTrigger: 'inline-flex',
    urlPopover: 'w-80 cursor-auto [border-radius:var(--radius-2xl)]',
    urlForm: 'flex flex-col gap-3 p-3',
    urlActions: 'flex items-center justify-end gap-2',
  },
  variants: {
    layout: {
      fixed: { base: 'min-h-12 w-full flex-wrap p-2' },
      bubble: { base: 'w-fit' },
      floating: { base: 'w-fit' },
    },
  },
  defaultVariants: {
    layout: 'fixed',
  } as const,
}
