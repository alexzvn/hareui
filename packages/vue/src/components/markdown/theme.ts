// Blocks render as direct children of `base`, so a leading heading drops its top margin and a trailing paragraph,
// list or nested paragraph drops its bottom margin, as in any prose container.
export default {
  slots: {
    base: 'w-full text-sm leading-relaxed text-foreground',
    h1: 'mt-4 mb-2 text-xl font-semibold text-foreground first:mt-0',
    h2: 'mt-4 mb-2 text-lg font-semibold text-foreground first:mt-0',
    h3: 'mt-4 mb-2 text-base font-semibold text-foreground first:mt-0',
    h4: 'mt-4 mb-2 font-semibold text-foreground first:mt-0',
    h5: 'mt-4 mb-2 font-semibold text-foreground first:mt-0',
    h6: 'mt-4 mb-2 font-semibold text-foreground first:mt-0',
    p: 'mb-3 last:mb-0',
    a: 'text-link underline underline-offset-2',
    strong: '',
    em: '',
    del: '',
    code: 'rounded-sm bg-default px-1.5 py-0.5 font-mono text-[0.875em] text-foreground',
    pre: 'my-2',
    ul: 'mb-3 list-outside list-disc space-y-1 ps-5 marker:text-muted/40 last:mb-0',
    ol: 'mb-3 list-outside list-decimal space-y-1 ps-5 last:mb-0',
    // A task item shows its checkbox in place of the bullet, pulled back into the gutter so its text lines up with
    // the other items; in a loose list the checkbox opens the first paragraph.
    li: 'leading-relaxed has-[>input:first-child]:-ms-5 has-[>input:first-child]:list-none has-[>p:first-child>input:first-child]:-ms-5 has-[>p:first-child>input:first-child]:list-none',
    // A read-only box drawn like Checkbox: field border when unchecked, accent fill and check mark when checked.
    input: [
      'me-2 inline-block size-4 shrink-0 appearance-none rounded-md border [border-width:var(--border-width-field)] border-field-border bg-field bg-center bg-no-repeat align-[-0.2em] shadow-field',
      `checked:border-transparent checked:bg-accent checked:bg-size-[0.75rem] checked:bg-[url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2016%2016'%20fill='none'%20stroke='white'%20stroke-width='2.5'%20stroke-linecap='round'%20stroke-linejoin='round'%3E%3Cpath%20d='M3.5%208.5l3%203l6-7'/%3E%3C/svg%3E")]`,
    ],
    blockquote: 'my-3 border-s-2 border-border ps-4 text-muted italic',
    hr: 'my-4 border-border',
    img: '',
    // Wide tables scroll inside the wrapper instead of pushing past the message width.
    tableWrapper: 'mb-3 overflow-x-auto',
    table:
      'w-full border-separate border-spacing-0 overflow-hidden rounded-xl border border-border text-sm',
    thead: '',
    tbody: '',
    tr: '',
    th: 'bg-default px-3 py-2 text-start text-xs font-medium text-muted',
    td: 'border-t border-border px-3 py-2 text-start',
  },
}
