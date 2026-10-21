// Dashboard sidebar toggle: the mobile trigger is hidden from `md` up, where the sidebar is docked.
export default {
  slots: {
    base: 'shrink-0 md:hidden',
  },
  variants: {
    side: {
      left: { base: '' },
      right: { base: '' },
    },
  },
}
