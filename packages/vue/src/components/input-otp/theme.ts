// Maps props to the BEM classes of ./input-otp.css (ported from @heroui/styles components/input-otp.css).
// HeroUI's `InputOTP` is built on the `input-otp` npm library: a single real (invisible) text input overlays a row of
// decorative slot `<div>`s, so typing/backspace/arrow-keys/paste are native browser text-editing behavior rather than
// custom per-slot focus management. `base` is HareUI's own addition (a flex-col wrapper for the bundled
// Label/Description/FieldError, following the TextField/SearchField/NumberField convention); `root` is HeroUI's actual
// `.input-otp` anatomy class.
export default {
  slots: {
    base: 'h-input-otp-field',
    root: 'h-input-otp',
    group: 'h-input-otp__group',
    slot: 'h-input-otp__slot',
    slotValue: 'h-input-otp__slot-value',
    caret: 'h-input-otp__caret',
    separator: 'h-input-otp__separator',
    input: 'h-input-otp__input',
  },
  variants: {
    variant: {
      primary: {},
      secondary: { root: 'h-input-otp--secondary' },
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
}
