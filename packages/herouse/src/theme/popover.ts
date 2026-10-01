// Translated from @heroui/styles components/popover.css
export default {
  slots: {
    base: [
      'origin-(--reka-popover-content-transform-origin) bg-overlay p-0 text-sm',
      '[border-radius:min(32px,var(--radius-3xl))] [box-shadow:var(--overlay-shadow)]',
      // Entering animation (React Aria `[data-entering=true]` -> Reka's open state).
      // `transition-[opacity,transform]` is intentionally NOT ported: HeroUI only keeps it
      // active while `[data-entering]`/`[data-exiting]` are present (a transient flag removed
      // once the transition ends), whereas Reka's `data-state` stays "open" for as long as the
      // popover is visible, which would leave a stray `transition-property`/`transition-duration`
      // on the steady-state element. The one-shot `animate-in`/`animate-out` keyframes below do
      // not depend on the `transition` property, so dropping it does not affect the animation.
      // `duration-150`/`duration-100` are avoided too: Tailwind's `duration-*` utility also sets
      // the literal `transition-duration` property as a side effect, causing the same persistent
      // leak; `[--tw-animation-duration:_]` feeds only the `animate-in`/`animate-out` keyframes.
      'data-[state=open]:animate-in data-[state=open]:[--tw-animation-duration:150ms] data-[state=open]:ease-smooth data-[state=open]:fade-in-0 data-[state=open]:zoom-in-90',
      'data-[state=open]:data-[side=top]:slide-in-from-bottom-1 data-[state=open]:data-[side=bottom]:slide-in-from-top-1 data-[state=open]:data-[side=left]:slide-in-from-right-1 data-[state=open]:data-[side=right]:slide-in-from-left-1',
      'data-[state=closed]:animate-out data-[state=closed]:[--tw-animation-duration:100ms] data-[state=closed]:ease-smooth data-[state=closed]:zoom-out-95 data-[state=closed]:fade-out data-[state=closed]:pointer-events-none',
    ],
    dialog: 'p-4 outline-none',
    heading: 'font-medium',
    arrow: 'fill-overlay',
  },
}
