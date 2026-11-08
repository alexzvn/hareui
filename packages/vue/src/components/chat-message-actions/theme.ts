// A row of small icon-only ghost buttons in `muted`, each with a tooltip naming it. A pressed toggle turns
// `foreground`. A copy button shows a check for two seconds after it copies, and a visually hidden status announces it.
export default {
  slots: {
    base: 'flex items-start',
    action: 'text-muted aria-pressed:text-foreground',
    icon: 'size-4',
    status: 'sr-only',
  },
}
