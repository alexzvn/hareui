// Grip at the start of the block under the pointer: a 24px-wide ghost small Button with a muted icon and a grab
// cursor, 8px before the block, gliding between blocks over 200ms and fading in and out over 150ms. The Editor leaves
// a 48px start gutter for it. Hidden below `sm`, where there's no hover to place it by.
// While a block is dragged, its siblings slide out of its way over 200ms and the block itself, at 40% opacity, moves
// into the gap it will land in.
export default {
  slots: {
    // The element tiptap positions next to the hovered block. tiptap hides it with an inline `visibility: hidden`,
    // which the fade keys off; visibility transitions too, so the handle stays visible while it fades out.
    base: [
      'hidden items-center justify-center sm:flex',
      '[transition:top_200ms_var(--ease-out-quart),left_200ms_var(--ease-out-quart),opacity_150ms_var(--ease-smooth),visibility_150ms_var(--ease-smooth)] motion-reduce:transition-none',
      '[&[style*="visibility:_hidden"]]:opacity-0',
    ],
    handle: 'w-6 cursor-grab px-0 text-muted active:cursor-grabbing',
    handleIcon: 'size-4',
    // The dragged block and its siblings, while it's dragged. The slide's duration and easing also time the glide
    // into place after the drop.
    block: '[transition:transform_200ms_var(--ease-out-quart)] motion-reduce:transition-none',
    // The dragged block, shown where it will land.
    draggedBlock: 'opacity-40',
  },
}
