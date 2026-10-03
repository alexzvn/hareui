// Translated from @heroui/styles components/input-otp.css
// HeroUI's `InputOTP` is built on the `input-otp` npm library: a single real (invisible) text input
// overlays a row of decorative slot `<div>`s, so typing/backspace/arrow-keys/paste are native browser
// text-editing behavior rather than custom per-slot focus management. `base` is HareUI's own addition
// (a flex-col wrapper for the bundled Label/Description/FieldError, following the TextField/SearchField/
// NumberField convention); `root` is HeroUI's actual `.input-otp` anatomy class.
export default {
  slots: {
    base: 'flex w-full flex-col gap-1',
    root: [
      'relative flex w-full items-center gap-2',
      'data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50',
      // Inline style of the `input-otp` library's container (HeroUI renders through it)
      'cursor-text select-none pointer-events-none has-[>input[data-disabled=true]]:cursor-default',
    ],
    group: 'flex min-w-0 items-center gap-2',
    slot: [
      'relative flex h-10 w-9.5 min-w-0 flex-1 items-center justify-center',
      'border bg-field text-field-foreground shadow-field',
      'rounded-field text-sm font-semibold outline-none',
      'border-(length:--border-width-field) border-(--field-border)',
      '[transition:background-color_150ms_var(--ease-smooth),border-color_150ms_var(--ease-smooth),box-shadow_150ms_var(--ease-out)] motion-reduce:transition-none',
      'hover:bg-field-hover hover:border-(--field-border-hover) data-[hovered=true]:bg-field-hover data-[hovered=true]:border-(--field-border-hover)',
      'data-[active=true]:z-10 data-[active=true]:bg-(--field-focus) data-[active=true]:status-focused-field',
      'data-[filled=true]:bg-(--field-focus)',
      'data-[disabled=true]:status-disabled',
      'data-[invalid=true]:status-invalid-field data-[invalid=true]:bg-(--field-focus)',
    ],
    slotValue: [
      'text-lg leading-6 tracking-[-0.27px]',
      'animate-slot-value-in [transform-origin:bottom_center] motion-reduce:animate-none',
    ],
    caret: 'absolute h-4 w-[2px] animate-caret-blink rounded-sm bg-field-placeholder',
    separator: 'h-[2px] w-[6px] shrink-0 rounded-sm bg-separator',
    // The real <input> overlays the whole box, with the `input-otp` library's inline input style: invisible
    // text/caret/selection, glyphs sized to the box height (`--root-height`, measured by the component).
    input: [
      'absolute inset-0 flex h-full w-full text-left opacity-100 text-transparent pointer-events-auto bg-transparent caret-transparent shadow-none',
      '[border:0_solid_transparent] [outline:0_solid_transparent] leading-none tracking-[-.5em] [font-size:var(--root-height,16px)] [font-family:monospace] tabular-nums',
      'selection:bg-transparent selection:text-transparent',
    ],
  },
  variants: {
    variant: {
      primary: { root: '' },
      secondary: {
        slot: [
          'shadow-none bg-(--input-otp-slot-bg)',
          '[--input-otp-slot-bg:var(--default)] [--input-otp-slot-bg-hover:var(--default-hover)] [--input-otp-slot-bg-focus:var(--default)]',
          'hover:bg-(--input-otp-slot-bg-hover) data-[hovered=true]:bg-(--input-otp-slot-bg-hover)',
          'data-[active=true]:bg-(--input-otp-slot-bg-focus) data-[filled=true]:bg-(--input-otp-slot-bg-focus)',
        ],
      },
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
}
