// Translated from @heroui/styles components/textfield.css
export default {
  slots: {
    base: 'flex flex-col gap-1 data-[invalid=true]:[&_[data-slot=description]]:hidden aria-[invalid=true]:[&_[data-slot=description]]:hidden',
  },
  variants: {
    fullWidth: {
      false: { base: '' },
      true: { base: 'w-full [&_[data-slot=input]]:w-full [&_[data-slot=textarea]]:w-full' },
    },
  },
  defaultVariants: {
    fullWidth: false,
  },
}
