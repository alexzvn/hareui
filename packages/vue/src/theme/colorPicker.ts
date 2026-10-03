// Translated from @heroui/styles components/color-picker.css
// Popover state/side variants use `[&:where([data-…])]:` like theme/popover.ts, so user utilities win over the theme
// (HeroUI keeps them in @layer components). React Aria's `[data-entering]`/`[data-exiting]` map to Reka's data-state.
export default {
  slots: {
    base: 'inline-flex',
    trigger: [
      'inline-flex items-center gap-3 rounded-sm text-sm no-highlight cursor-(--cursor-interactive)',
      '[transition:background-color_150ms_var(--ease-smooth),box-shadow_150ms_var(--ease-out)] motion-reduce:transition-none',
      '[&_[data-slot=label]]:cursor-(--cursor-interactive)',
      'focus-visible:status-focused data-[focus-visible=true]:status-focused',
      'disabled:status-disabled data-[disabled=true]:status-disabled aria-disabled:status-disabled',
    ],
    popover: [
      'min-w-62 origin-(--reka-popover-content-transform-origin) scrollbar-none overflow-x-hidden overflow-y-auto overscroll-contain bg-overlay px-2 pt-2 pb-3',
      // React Aria sets `z-index: 100000` inline on popovers (HeroUI base.css `--z-index-overlay`).
      'z-(--z-index-overlay)',
      '[box-shadow:var(--overlay-shadow)] [border-radius:min(32px,calc(var(--radius)*2.5))]',
      'flex flex-col gap-3 focus-visible:outline-none',
      '[&:where([data-state=open])]:animate-in [&:where([data-state=open])]:[--tw-animation-duration:150ms] [&:where([data-state=open])]:ease-smooth [&:where([data-state=open])]:fade-in-0 [&:where([data-state=open])]:zoom-in-95',
      '[&:where([data-state=open])]:[&:where([data-side=top])]:slide-in-from-bottom-1 [&:where([data-state=open])]:[&:where([data-side=bottom])]:slide-in-from-top-1 [&:where([data-state=open])]:[&:where([data-side=left])]:slide-in-from-right-1 [&:where([data-state=open])]:[&:where([data-side=right])]:slide-in-from-left-1',
      '[&:where([data-state=closed])]:animate-out [&:where([data-state=closed])]:[--tw-animation-duration:100ms] [&:where([data-state=closed])]:ease-smooth [&:where([data-state=closed])]:zoom-out-95 [&:where([data-state=closed])]:fade-out [&:where([data-state=closed])]:pointer-events-none',
    ],
  },
}
