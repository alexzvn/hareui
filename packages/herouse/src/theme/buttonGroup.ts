// Translated from @heroui/styles components/button-group.css
export default {
  slots: {
    base: 'inline-flex h-auto items-center justify-center gap-0',
    // Classes added to each grouped Button. Edge radii live in variables so a user `rounded-*` on the
    // Button replaces them entirely, like HeroUI's utilities beating `.button-group .button` rules.
    button: 'rounded-s-(--button-group-radius-s) rounded-e-(--button-group-radius-e) [--button-group-radius-e:0px] [--button-group-radius-s:0px] active:[transform:none] focus-visible:z-10',
    // Added to grouped Buttons with `variant="outline"`: adjacent borders collapse.
    buttonOutline: '',
    separator: 'pointer-events-none absolute rounded-sm bg-current opacity-15 [transition:opacity_150ms_var(--ease-smooth)] motion-reduce:transition-none [:first-child>&]:hidden',
  },
  variants: {
    orientation: {
      horizontal: {
        base: 'flex-row',
        button: 'first:[--button-group-radius-s:var(--radius-3xl)] last:[--button-group-radius-e:var(--radius-3xl)]',
        buttonOutline: 'first:border-e-0 last:border-s-0 not-first:not-last:border-x-0',
        separator: 'start-[-1px] top-1/4 h-1/2 w-px',
      },
      vertical: {
        base: 'flex-col',
        // Vertical edges are top/bottom: swap the radius pair onto the block corners.
        button: 'rounded-none rounded-t-(--button-group-radius-s) rounded-b-(--button-group-radius-e) first:[--button-group-radius-s:var(--radius-3xl)] last:[--button-group-radius-e:var(--radius-3xl)]',
        buttonOutline: 'first:border-b-0 last:border-t-0 not-first:not-last:border-y-0',
        separator: 'start-1/4 top-[-1px] h-px w-1/2',
      },
    },
    fullWidth: {
      true: { base: 'w-full' },
      false: { base: '' },
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    fullWidth: false,
  },
}
