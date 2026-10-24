// Translated from @heroui/styles components/toggle-button-group.css
export default {
  slots: {
    base: 'inline-flex h-auto w-fit items-center justify-center gap-0',
    // Classes added to each ToggleButton in the group. Edge radii live in variables so a user `rounded-*`
    // on the ToggleButton replaces them entirely, like HeroUI's utilities beating the group rules.
    button:
      'rounded-s-(--toggle-button-group-radius-s) rounded-e-(--toggle-button-group-radius-e) [--toggle-button-group-radius-e:0px] [--toggle-button-group-radius-s:0px] active:[transform:none] focus-visible:ring-inset focus-visible:[--tw-ring-offset-width:0px]',
    separator:
      'pointer-events-none absolute rounded-sm bg-current opacity-15 [transition:opacity_150ms_var(--ease-smooth)] motion-reduce:transition-none [:first-child>&]:hidden',
  },
  variants: {
    orientation: {
      horizontal: {
        base: 'flex-row',
        button:
          'first:[--toggle-button-group-radius-s:var(--radius-3xl)] last:[--toggle-button-group-radius-e:var(--radius-3xl)]',
        separator: 'start-[-1px] top-1/4 h-1/2 w-px',
      },
      vertical: {
        base: 'flex-col',
        // Vertical edges are top/bottom: move the radius pair onto the block corners.
        button:
          'rounded-none rounded-t-(--toggle-button-group-radius-s) rounded-b-(--toggle-button-group-radius-e) first:[--toggle-button-group-radius-s:var(--radius-3xl)] last:[--toggle-button-group-radius-e:var(--radius-3xl)]',
        separator: 'start-1/4 top-[-1px] h-px w-1/2',
      },
    },
    fullWidth: {
      true: { base: 'w-full', button: 'flex-1' },
      false: { base: '' },
    },
    detached: {
      true: {
        base: 'gap-1',
        button:
          '[--toggle-button-group-radius-e:var(--radius-3xl)] [--toggle-button-group-radius-s:var(--radius-3xl)]',
        separator: 'hidden',
      },
      false: { base: '' },
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    fullWidth: false,
    detached: false,
  },
}
