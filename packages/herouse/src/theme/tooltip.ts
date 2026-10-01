// Translated from @heroui/styles components/tooltip.css
export default {
  slots: {
    base: [
      'max-w-xs origin-(--trigger-anchor-point) bg-overlay p-2 text-xs break-all',
      '[border-radius:min(32px,var(--radius-xl))] shadow-overlay',
      // Entering animations (React Aria `[data-entering=true]` -> Reka's non-closed states)
      'data-[state=delayed-open]:animate-in data-[state=delayed-open]:duration-150 data-[state=delayed-open]:ease-smooth data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-90',
      'data-[state=instant-open]:animate-in data-[state=instant-open]:duration-150 data-[state=instant-open]:ease-smooth data-[state=instant-open]:fade-in-0 data-[state=instant-open]:zoom-in-90',
      // Placement-specific translations
      'data-[state=delayed-open]:data-[side=top]:slide-in-from-bottom-1 data-[state=instant-open]:data-[side=top]:slide-in-from-bottom-1',
      'data-[state=delayed-open]:data-[side=bottom]:slide-in-from-top-1 data-[state=instant-open]:data-[side=bottom]:slide-in-from-top-1',
      'data-[state=delayed-open]:data-[side=left]:slide-in-from-right-1 data-[state=instant-open]:data-[side=left]:slide-in-from-right-1',
      'data-[state=delayed-open]:data-[side=right]:slide-in-from-left-1 data-[state=instant-open]:data-[side=right]:slide-in-from-left-1',
      // Exiting animation (React Aria `[data-exiting=true]` -> Reka's closed state)
      'data-[state=closed]:animate-out data-[state=closed]:duration-100 data-[state=closed]:ease-smooth data-[state=closed]:zoom-out-95 data-[state=closed]:fade-out data-[state=closed]:pointer-events-none',
      'data-[state=delayed-open]:transition-[opacity,transform] data-[state=delayed-open]:will-change-[opacity,transform]',
      'data-[state=instant-open]:transition-[opacity,transform] data-[state=instant-open]:will-change-[opacity,transform]',
      'data-[state=closed]:transition-[opacity,transform] data-[state=closed]:will-change-[opacity,transform]',
      // Arrow styling
      '[&_[data-slot=overlay-arrow]]:stroke-border/40 [&_[data-slot=overlay-arrow]]:fill-(--overlay)',
    ],
    arrow: '',
  },
}
