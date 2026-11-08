// The editor fills the composer's input area, which already carries the field padding, text size and colors: no
// shell of its own (no border, background, radius or 180px minimum height), lines without the 12px block gap, and
// scrolling once the text passes `--prompt-input-max-height`. Tokens are medium accent text on `accent-soft` pills
// with a 6px radius and 4px inline padding. The trigger and the text typed after it stay plain text until an entry is
// picked.
export default {
  slots: {
    root: [
      'rounded-none border-0 bg-transparent shadow-none hover:border-transparent',
      'has-[.ProseMirror:focus]:border-transparent has-[.ProseMirror:focus]:bg-transparent',
    ],
    content: 'overflow-visible',
    base: [
      'max-h-(--prompt-input-max-height) min-h-0 overflow-y-auto p-0 text-[length:inherit] leading-[inherit]',
      '[&>*+*]:mt-0 [&_p]:min-h-0',
      '[&_.mention]:rounded-md [&_.mention]:bg-accent-soft [&_.mention]:px-1 [&_.mention]:font-medium [&_.mention]:text-accent',
    ],
    trigger: 'rounded-none bg-transparent text-inherit',
  },
}
