// Translated from @heroui/styles components/tooltip.css
// State/side variants use `[&:where([data-…])]:` (zero added specificity): HeroUI keeps these animations in
// @layer components, so user utilities such as `data-[state=open]:zoom-in-95` must win over the theme.
export default {
  slots: {
    base: [
      'max-w-xs origin-(--trigger-anchor-point) bg-overlay p-2 text-xs break-all',
      // React Aria sets `z-index: 100000` inline on tooltips (HeroUI base.css `--z-index-overlay`); Reka copies it to the wrapper.
      'z-(--z-index-overlay)',
      '[border-radius:min(32px,var(--radius-xl))] shadow-overlay',
      // Entering animations (React Aria `[data-entering=true]` -> Reka's non-closed states)
      '[&:where([data-state=delayed-open])]:animate-in [&:where([data-state=delayed-open])]:duration-150 [&:where([data-state=delayed-open])]:ease-smooth [&:where([data-state=delayed-open])]:fade-in-0 [&:where([data-state=delayed-open])]:zoom-in-90',
      '[&:where([data-state=instant-open])]:animate-in [&:where([data-state=instant-open])]:duration-150 [&:where([data-state=instant-open])]:ease-smooth [&:where([data-state=instant-open])]:fade-in-0 [&:where([data-state=instant-open])]:zoom-in-90',
      // Placement-specific translations
      '[&:where([data-state=delayed-open])]:[&:where([data-side=top])]:slide-in-from-bottom-1 [&:where([data-state=instant-open])]:[&:where([data-side=top])]:slide-in-from-bottom-1',
      '[&:where([data-state=delayed-open])]:[&:where([data-side=bottom])]:slide-in-from-top-1 [&:where([data-state=instant-open])]:[&:where([data-side=bottom])]:slide-in-from-top-1',
      '[&:where([data-state=delayed-open])]:[&:where([data-side=left])]:slide-in-from-right-1 [&:where([data-state=instant-open])]:[&:where([data-side=left])]:slide-in-from-right-1',
      '[&:where([data-state=delayed-open])]:[&:where([data-side=right])]:slide-in-from-left-1 [&:where([data-state=instant-open])]:[&:where([data-side=right])]:slide-in-from-left-1',
      // Exiting animation (React Aria `[data-exiting=true]` -> Reka's closed state)
      '[&:where([data-state=closed])]:animate-out [&:where([data-state=closed])]:duration-100 [&:where([data-state=closed])]:ease-smooth [&:where([data-state=closed])]:zoom-out-95 [&:where([data-state=closed])]:fade-out [&:where([data-state=closed])]:pointer-events-none',
      '[&:where([data-state=delayed-open])]:transition-[opacity,transform] [&:where([data-state=delayed-open])]:will-change-[opacity,transform]',
      '[&:where([data-state=instant-open])]:transition-[opacity,transform] [&:where([data-state=instant-open])]:will-change-[opacity,transform]',
      '[&:where([data-state=closed])]:transition-[opacity,transform] [&:where([data-state=closed])]:will-change-[opacity,transform]',
      // Arrow styling
      '[&_[data-slot=overlay-arrow]]:stroke-border/40 [&_[data-slot=overlay-arrow]]:fill-(--overlay)',
    ],
    arrow: '',
    // Shortcut wrapper after the text, separated from it by a middle dot; hidden on small (touch) screens.
    kbds: "hidden shrink-0 items-center gap-0.5 align-middle lg:inline-flex not-first-of-type:before:me-1 not-first-of-type:before:ms-1 not-first-of-type:before:content-['·']",
    // Compact key: 20px tall to fit the 12px tooltip text.
    kbd: 'h-5 rounded-md px-1.5 text-xs',
  },
}
