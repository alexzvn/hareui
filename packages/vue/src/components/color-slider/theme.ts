// Translated from @heroui/styles components/color-slider.css
// The `:has()` grid-area variants are driven by the `label` / `output` variants, set from the
// presence of the label / output parts.
export default {
  slots: {
    base: 'grid w-full data-disabled:status-disabled aria-disabled:status-disabled data-disabled:[&_[data-slot=label]]:opacity-100 aria-disabled:[&_[data-slot=label]]:opacity-100',
    label: 'w-fit text-sm font-medium [grid-area:label]',
    output: 'text-sm font-medium tabular-nums [grid-area:output]',
    track: [
      'relative rounded-2xl [grid-area:track]',
      "before:absolute before:z-0 before:pointer-events-none before:content-['']",
      "after:absolute after:z-0 after:pointer-events-none after:content-['']",
    ],
    thumb: [
      'absolute flex cursor-grab items-center justify-center rounded-2xl no-highlight',
      'border-3 border-white shadow-overlay',
      'z-1',
      '[transition:transform_250ms_var(--ease-out),box-shadow_150ms_var(--ease-out)] motion-reduce:transition-none',
      'data-[dragging=true]:cursor-grabbing',
      'focus-visible:z-10 focus-visible:status-focused',
      // RAC focuses an inner input, so the thumb never receives the UA `:focus-visible` outline width/colour
      'focus-visible:[outline-width:medium] focus-visible:[outline-color:currentcolor]',
      'data-disabled:cursor-default data-disabled:bg-default',
    ],
  },
  variants: {
    orientation: {
      horizontal: {
        base: "gap-1 [grid-template-areas:'label_output'_'track_track'] grid-cols-[1fr_auto] grid-rows-[auto_auto]",
        label: '',
        track: [
          'h-5 w-[calc(100%-1.25rem)] justify-self-center rounded-none',
          '[:where(&)]:[box-shadow:inset_0_1px_0_0_rgba(0,0,0,0.1),inset_0_-1px_0_0_rgba(0,0,0,0.1)]',
          'before:top-0 before:h-full before:w-2.5 before:rounded-ss-2xl before:rounded-es-2xl before:start-[-0.625rem]',
          'before:[box-shadow:inset_1px_0_0_0_rgba(0,0,0,0.1),inset_0_1px_0_0_rgba(0,0,0,0.1),inset_0_-1px_0_0_rgba(0,0,0,0.1)]',
          'before:[background:linear-gradient(var(--track-start-color,transparent)),repeating-conic-gradient(#efefef_0%_25%,#f7f7f7_0%_50%)_50%_/_16px_16px]',
          'after:top-0 after:h-full after:w-2.5 after:rounded-se-2xl after:rounded-ee-2xl after:end-[-0.625rem]',
          'after:[box-shadow:inset_-1px_0_0_0_rgba(0,0,0,0.1),inset_0_1px_0_0_rgba(0,0,0,0.1),inset_0_-1px_0_0_rgba(0,0,0,0.1)]',
          'after:bg-(--track-end-color,transparent)',
        ],
        thumb: 'top-1/2 size-4',
      },
      vertical: {
        base: "h-full gap-2 [grid-template-areas:'output'_'track'_'label'] grid-rows-[auto_1fr_auto] grid-cols-[1fr] items-center justify-items-center",
        output: 'text-center',
        label: 'text-center',
        track: [
          'w-5 h-[calc(100%-1.25rem)] justify-self-center rounded-none',
          '[:where(&)]:[box-shadow:inset_1px_0_0_0_rgba(0,0,0,0.1),inset_-1px_0_0_0_rgba(0,0,0,0.1)]',
          'before:start-0 before:w-full before:h-2.5 before:bottom-[-0.625rem] before:rounded-es-full before:rounded-ee-full',
          'before:[box-shadow:inset_1px_0_0_0_rgba(0,0,0,0.1),inset_-1px_0_0_0_rgba(0,0,0,0.1),inset_0_-1px_0_0_rgba(0,0,0,0.1)]',
          'before:[background:linear-gradient(var(--track-start-color,transparent)),repeating-conic-gradient(#efefef_0%_25%,#f7f7f7_0%_50%)_50%_/_16px_16px]',
          'after:start-0 after:w-full after:h-2.5 after:top-[-0.625rem] after:rounded-ss-full after:rounded-se-full',
          'after:[box-shadow:inset_1px_0_0_0_rgba(0,0,0,0.1),inset_-1px_0_0_0_rgba(0,0,0,0.1),inset_0_1px_0_0_rgba(0,0,0,0.1)]',
          'after:bg-(--track-end-color,transparent)',
        ],
        thumb: 'left-1/2 bottom-auto! size-4',
      },
    },
    hasLabel: { true: {}, false: {} },
    hasOutput: { true: {}, false: {} },
  },
  compoundVariants: [
    {
      orientation: 'horizontal',
      hasLabel: false,
      hasOutput: false,
      class: { base: "gap-0 [grid-template-areas:'track'] grid-cols-[1fr] grid-rows-[auto]" },
    },
    {
      orientation: 'horizontal',
      hasLabel: true,
      hasOutput: false,
      class: { base: "[grid-template-areas:'label'_'track'] grid-cols-[1fr]" },
    },
    {
      orientation: 'horizontal',
      hasLabel: false,
      hasOutput: true,
      class: {
        base: "[grid-template-areas:'output'_'track'] grid-cols-[1fr]",
        output: 'justify-self-end',
      },
    },
    {
      orientation: 'vertical',
      hasLabel: false,
      hasOutput: false,
      class: { base: "gap-0 [grid-template-areas:'track'] grid-rows-[1fr]" },
    },
    {
      orientation: 'vertical',
      hasLabel: true,
      hasOutput: false,
      class: { base: "[grid-template-areas:'track'_'label'] grid-rows-[1fr_auto]" },
    },
    {
      orientation: 'vertical',
      hasLabel: false,
      hasOutput: true,
      class: { base: "[grid-template-areas:'output'_'track'] grid-rows-[auto_1fr]" },
    },
  ],
  defaultVariants: {
    orientation: 'horizontal',
    hasLabel: false,
    hasOutput: false,
  },
}
