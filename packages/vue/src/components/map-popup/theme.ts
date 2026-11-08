// MapPopup: an overlay card (24px radius, 16px padding, 14px text, 272px max width) pinned to a position, with a 20px
// close button 8px from the top end corner. Shared by `MapMarkerPopup`.
export default {
  slots: {
    base: [
      'relative w-max max-w-68 min-w-0 rounded-3xl bg-overlay p-4 text-sm wrap-anywhere text-foreground',
      'shadow-overlay outline-none *:min-w-0 *:max-w-full',
    ],
    close: 'absolute end-2 top-2 z-10 size-5 [&_svg]:size-3',
  },
  variants: {
    closeButton: {
      true: { base: 'pe-10' },
    },
  },
}
