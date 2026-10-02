// Translated from @heroui/styles components/time-field.css
// Self-referencing data-attribute states use `[&:where([data-…])]:` (zero added specificity): HeroUI keeps
// these in @layer components, so a user `data-[invalid=true]:` / `:ui` override must still win.
export default {
  slots: {
    base: [
      'flex flex-col gap-1',
      '[&:where([data-invalid=true])]:[&_[data-slot=description]]:hidden [&:where([aria-invalid=true])]:[&_[data-slot=description]]:hidden',
      '[&_[data-slot=label]]:w-fit',
    ],
  },
  variants: {
    fullWidth: {
      false: { base: '' },
      true: { base: 'w-full' },
    },
  },
  defaultVariants: {
    fullWidth: false,
  },
}
