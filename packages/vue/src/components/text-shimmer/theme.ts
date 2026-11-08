// The text shows at 45% of the current colour. A hidden copy on top masks a full-colour band (`spread` either side
// of its centre) to the glyphs, and the band sweeps across on the compositor (a `transform` animation). The mask is
// `mask-clip: text` where supported, else an element mask of the text (`--text-shimmer-mask`). Both copies inherit the
// root's flex layout, so icons in the slot line up the same way. With reduced motion the band is gone and the text
// shows at full colour.
export default {
  slots: {
    base: 'relative inline-block w-fit',
    text: '[display:inherit] [gap:inherit] [align-items:inherit] text-current/45 motion-reduce:text-current',
    highlight: [
      'pointer-events-none absolute inset-0 overflow-clip select-none [contain:strict] motion-reduce:hidden',
      '[display:inherit] [gap:inherit] [align-items:inherit] [-webkit-text-fill-color:transparent]',
      'supports-[-webkit-mask-clip:text]:[mask-image:linear-gradient(#fff,#fff)] supports-[-webkit-mask-clip:text]:[-webkit-mask-clip:text] supports-[-webkit-mask-clip:text]:[mask-clip:text]',
      'supports-[mask-image:-moz-element(#a)]:[mask-image:var(--text-shimmer-mask)]',
      "after:pointer-events-none after:absolute after:inset-0 after:content-[''] after:will-change-transform after:animate-text-shimmer rtl:after:[animation-direction:reverse]",
      'after:[background-image:linear-gradient(90deg,transparent_calc(50%_-_var(--text-shimmer-spread)),currentColor_50%,transparent_calc(50%_+_var(--text-shimmer-spread)))]',
    ],
  },
}
