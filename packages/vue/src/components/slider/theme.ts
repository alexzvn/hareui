// Translated from @heroui/styles components/slider.css
// The root (Reka `SliderRoot`) mirrors RAC's `data-orientation`/`data-disabled`/`aria-disabled`; `data-dragging`
// on the thumb and `data-fill-start`/`data-fill-end` on the track are computed by the component itself (Reka
// doesn't expose them) to match `@heroui/react`'s exact selectors.
export default {
  slots: {
    base: [
      'grid w-full gap-1 [grid-template-areas:"label_output"_"track_track"] grid-cols-[1fr_auto]',
      'data-[orientation=horizontal]:flex-col data-[orientation=vertical]:flex-row',
      'data-[orientation=vertical]:h-full data-[orientation=vertical]:gap-2 data-[orientation=vertical]:grid-cols-[1fr] data-[orientation=vertical]:grid-rows-[auto_1fr_auto] data-[orientation=vertical]:[grid-template-areas:"output"_"track"_"label"]',
      '[&_[data-slot=label]]:w-fit [&_[data-slot=label]]:text-sm [&_[data-slot=label]]:font-medium [&_[data-slot=label]]:[grid-area:label]',
      'data-[orientation=vertical]:[&_[data-slot=label]]:text-center',
      'disabled:status-disabled data-disabled:status-disabled aria-disabled:status-disabled',
      'disabled:[&_[data-slot=label]]:opacity-100 data-disabled:[&_[data-slot=label]]:opacity-100 aria-disabled:[&_[data-slot=label]]:opacity-100',
    ],
    // Styled by the root's `[data-slot=label]` rules; the slot exists so `:ui.label` can target the Label
    label: '',
    output: [
      'text-sm font-medium tabular-nums [grid-area:output]',
      'data-[orientation=vertical]:text-center',
    ],
    track: [
      // `touch-none`: a touch drag moves the thumb instead of scrolling the page (RAC sets `touch-action: none`)
      'relative touch-none rounded-xl bg-default [grid-area:track]',
      'data-[orientation=horizontal]:h-5 data-[orientation=horizontal]:w-full data-[orientation=horizontal]:border-x-[0.75rem] data-[orientation=horizontal]:border-x-transparent',
      'data-[orientation=horizontal]:data-[fill-start=true]:border-s-accent data-[orientation=horizontal]:data-[fill-end=true]:border-e-accent',
      'data-[orientation=vertical]:h-full data-[orientation=vertical]:w-5 data-[orientation=vertical]:justify-self-center data-[orientation=vertical]:border-y-[0.75rem] data-[orientation=vertical]:border-y-transparent',
      'data-[orientation=vertical]:data-[fill-start=true]:border-b-accent data-[orientation=vertical]:data-[fill-end=true]:border-t-accent',
    ],
    fill: [
      'pointer-events-none absolute bg-accent',
      'data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full',
    ],
    thumb: [
      'absolute flex cursor-grab items-center justify-center rounded-xl bg-accent no-highlight',
      '[transition:background-color_250ms_var(--ease-smooth),transform_250ms_var(--ease-out),box-shadow_150ms_var(--ease-out)] motion-reduce:transition-none',
      "after:relative after:z-10 after:rounded-lg after:bg-accent-foreground after:text-black after:shadow-field after:content-[''] after:origin-center after:transition-all motion-reduce:after:transition-none",
      'data-[dragging=true]:cursor-grabbing data-[dragging=true]:after:scale-[0.9] motion-reduce:data-[dragging=true]:after:scale-100',
      // RAC focuses a hidden <input> inside the thumb, so the thumb never shows a native outline. The `outline: none`
      // shorthand also resets the width/colour that Chrome's `:focus-visible` UA rule would otherwise set.
      '[outline:none] data-[focus-visible=true]:z-10 data-[focus-visible=true]:status-focused',
      'data-disabled:cursor-default',
      // RAC centres the thumb on both axes (`translate(-50%, -50%)`); Reka's `--reka-slider-thumb-transform`
      // only covers the main axis, so add the cross axis (sign of the main axis follows Reka: flipped in RTL / from bottom)
      'data-[orientation=horizontal]:top-1/2 data-[orientation=horizontal]:h-full data-[orientation=horizontal]:w-7 data-[orientation=horizontal]:after:w-6 data-[orientation=horizontal]:after:h-4',
      // Reka flips the thumb from its own `dir` (prop / ConfigProvider), not CSS direction, and always renders it on the root
      'data-[orientation=horizontal]:[--reka-slider-thumb-transform:translate(-50%,-50%)] [[data-slot=slider][dir=rtl]_&]:data-[orientation=horizontal]:[--reka-slider-thumb-transform:translate(50%,-50%)]',
      'data-[orientation=vertical]:left-1/2 data-[orientation=vertical]:w-full data-[orientation=vertical]:h-7 data-[orientation=vertical]:after:w-4 data-[orientation=vertical]:after:h-6',
      // Reka positions vertical thumbs by `bottom`, RAC by `top`; keep RAC's computed `translate(-50%,-50%)` and move the
      // thumb down by its full height with the separate `translate` property, so it ends up centred on the value
      'data-[orientation=vertical]:[--reka-slider-thumb-transform:translate(-50%,-50%)] data-[orientation=vertical]:[translate:0_100%]',
    ],
  },
}
