// Rich-text field:
// a 16px-radius field shell (field background and border, 150ms color transitions) holding the toolbar slot,
// the scrolling document and the footer slot. The document is `px-4 py-3` with a 180px minimum height,
// 14px/24px text and 12px between blocks; headings are semibold (24/32, 20/28, 18/28px for levels 1-3).
// Inline code is monospace at 0.9em with 2px/3px padding; code blocks sit on the default hover fill (12px radius, 14px),
// quotes have a 2px start border in muted text, links are underlined 2px below the text.
// The footer is a 40px `px-3 py-2` row in 12px muted text. Disabled dims the whole field to 60%.
export default {
  slots: {
    root: [
      'relative flex w-full flex-col overflow-hidden rounded-2xl bg-field text-foreground',
      'border-(length:--border-width-field) border-field-border',
      '[transition:background-color_150ms_var(--ease-smooth),border-color_150ms_var(--ease-smooth),box-shadow_150ms_var(--ease-out)] motion-reduce:transition-none',
      'cursor-text hover:border-field-border-hover',
      'has-[.ProseMirror:focus]:border-field-border-focus has-[.ProseMirror:focus]:bg-field-focus',
    ],
    content: 'min-h-0 flex-1 cursor-text overflow-y-auto',
    base: [
      'min-h-[180px] px-4 py-3 text-sm/6 text-foreground outline-none [&>*+*]:mt-3',
      'selection:bg-accent-soft',
      // Headings
      '[&_:is(h1,h2,h3,h4,h5,h6)]:font-semibold [&_:is(h1,h2,h3,h4,h5,h6)]:tracking-normal [&_:is(h1,h2,h3,h4,h5,h6)]:text-foreground',
      '[&_h1]:text-2xl/8 [&_h2]:text-xl/7 [&_h3]:text-lg/7 [&_h4]:text-base/6 [&_h5]:text-sm/6 [&_h6]:text-sm/6 [&_h6]:text-muted',
      // Paragraphs keep one line of height when empty
      '[&_p]:min-h-6',
      // Lists
      '[&_:is(ul,ol)]:ps-6 [&_ul]:list-disc [&_ol]:list-decimal [&_li+li]:mt-1',
      '[&_ul[data-type=taskList]]:list-none [&_ul[data-type=taskList]]:ps-1 [&_li[data-checked]]:flex [&_li[data-checked]]:gap-2 [&_li[data-checked]>label]:mt-1',
      // Quotes
      '[&_blockquote]:border-s-2 [&_blockquote]:border-border [&_blockquote]:ps-4 [&_blockquote]:text-muted',
      // Inline code
      '[&_code]:rounded-md [&_code]:px-0.75 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em] [&_code]:text-foreground',
      // Code blocks
      '[&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-default-hover [&_pre]:p-3 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:text-foreground',
      '[&_pre_code]:p-0 [&_pre_code]:text-inherit',
      // Links
      '[&_a]:text-link [&_a]:underline [&_a]:underline-offset-2',
      // Horizontal rules render as `<div data-type="horizontalRule"><hr></div>`
      '[&_[data-type=horizontalRule]]:py-2 [&_hr]:border-t [&_hr]:border-separator',
      // Images
      '[&_img]:block [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl',
      // Selected nodes (images, rules)
      '[&_.ProseMirror-selectednode]:rounded-sm [&_.ProseMirror-selectednode]:outline-2 [&_.ProseMirror-selectednode]:outline-offset-2 [&_.ProseMirror-selectednode]:outline-accent',
    ],
    footer:
      'flex min-h-10 cursor-default items-center justify-between gap-3 px-3 py-2 text-xs text-muted',
  },
  variants: {
    variant: {
      primary: { root: '' },
      secondary: { root: 'bg-default shadow-none has-[.ProseMirror:focus]:bg-default' },
    },
    placeholderMode: {
      firstLine: {
        base: '[&_:is(p,h1,h2,h3,h4,h5,h6).is-editor-empty:first-child]:before:pointer-events-none [&_:is(p,h1,h2,h3,h4,h5,h6).is-editor-empty:first-child]:before:float-start [&_:is(p,h1,h2,h3,h4,h5,h6).is-editor-empty:first-child]:before:h-0 [&_:is(p,h1,h2,h3,h4,h5,h6).is-editor-empty:first-child]:before:text-muted [&_:is(p,h1,h2,h3,h4,h5,h6).is-editor-empty:first-child]:before:content-[attr(data-placeholder)]',
      },
      everyLine: {
        base: '[&_:is(p,h1,h2,h3,h4,h5,h6).is-empty]:before:pointer-events-none [&_:is(p,h1,h2,h3,h4,h5,h6).is-empty]:before:float-start [&_:is(p,h1,h2,h3,h4,h5,h6).is-empty]:before:h-0 [&_:is(p,h1,h2,h3,h4,h5,h6).is-empty]:before:text-muted [&_:is(p,h1,h2,h3,h4,h5,h6).is-empty]:before:content-[attr(data-placeholder)]',
      },
    },
    disabled: {
      true: {
        root: 'cursor-not-allowed opacity-60 hover:border-field-border',
        content: 'cursor-not-allowed',
      },
    },
  },
  defaultVariants: {
    variant: 'primary',
    placeholderMode: 'everyLine',
    disabled: false,
  },
}
