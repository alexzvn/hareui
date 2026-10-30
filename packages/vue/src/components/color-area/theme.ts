// Translated from @heroui/styles components/color-area.css
export default {
  slots: {
    base: [
      'relative aspect-square w-full max-w-56 shrink-0 rounded-2xl no-highlight',
      // Background is set inline by ColorArea.vue from Reka's `getAreaBackgroundStyle` (a
      // `backgroundImage`/`backgroundColor` pair, not a single CSS value a Tailwind var could hold).
      'shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]',
      // `&[data-disabled="true"]` (Reka's ColorAreaArea sets a boolean `data-disabled`)
      'data-disabled:status-disabled',
    ],
    // Reka positions the thumb inline (`left`/`top`/`transform`), so only visual styles live here.
    thumb: [
      'size-4 rounded-xl bg-(--color-area-thumb-color) no-highlight will-change-[width,height]',
      'border-3 border-white [box-shadow:0_0_0_1px_rgba(0,0,0,0.1),inset_0_0_0_1px_rgba(0,0,0,0.1)]',
      '[transition:width_150ms_var(--ease-out),height_150ms_var(--ease-out)] motion-reduce:transition-none',
      // RAC focuses a hidden <input> inside the thumb, so the thumb never shows a native outline (the `outline: none`
      // shorthand also resets the width/colour of Chrome's `:focus-visible` UA rule). Reka focuses the thumb itself,
      // and does so on a mouse press too, so `data-focus-visible` is tracked by ColorArea.vue like RAC's.
      '[outline:none] data-[focus-visible=true]:status-focused',
      // Reka doesn't expose a `data-dragging` attribute either; ColorArea.vue tracks it locally.
      'data-[dragging=true]:size-5',
      'data-disabled:status-disabled',
    ],
  },
  variants: {
    showDots: {
      false: {},
      true: {
        base: [
          "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:content-['']",
          'after:[background-image:radial-gradient(circle,rgba(255,255,255,0.2)_1px,transparent_1px)]',
          'after:[background-size:8px_8px]',
        ],
      },
    },
  },
  defaultVariants: {
    showDots: false,
  },
}
