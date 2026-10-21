// Line resize handle: an 8px hit area over a 1px line that turns `separator-secondary` on hover and while
// dragging (120ms colour transition), with a 2px focus line. The handle is zero-width, so the line overlays the
// edge the neighbour already draws: the panel's `border-e` / left sidebar's inset edge just before it, or a right sidebar's
// inset edge just after it (`data-side="right"`, set by DashboardSidebar).
export default {
  slots: {
    base: [
      'relative z-10 hidden w-0 shrink-0 cursor-col-resize touch-none select-none outline-none md:block',
      'before:absolute before:inset-y-0 before:-inset-x-1 before:z-1',
      'after:absolute after:inset-y-0 after:start-0 after:w-px after:-translate-x-full after:bg-transparent after:transition-[background-color,width] after:duration-[120ms] motion-reduce:after:transition-none rtl:after:translate-x-full data-[side=right]:after:translate-x-0',
      'hover:after:bg-separator-secondary data-[dragging=true]:after:bg-separator-secondary',
      'focus-visible:after:w-0.5 focus-visible:after:bg-focus',
    ],
  },
}
