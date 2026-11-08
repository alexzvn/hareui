// A row: the leading avatar (32px, top-aligned), then the body 12px away, which stacks the header, the content and the
// actions 8px apart. `side: 'end'` mirrors the row and aligns the body to the end; `side: 'start'` keeps 48px free
// after the body from 640px up. The content is 14px text at a relaxed line height that stacks the parts 8px apart;
// text parts keep their line breaks, and consecutive sources share a wrapping row, 8px apart. Every variant but
// `tertiary` is a bubble (16px corners, 16px × 8px padding) that fits its text: `primary` is the solid colour (with
// `default`, the inverted foreground solid), `secondary` is `default`, `soft` is the soft colour, `outline` is
// transparent with a border. `tertiary` has no bubble: the content spans the body and the row gets 8px block padding.
// The text takes the colour's soft-foreground colour (`primary`: its foreground).
// An end-side bubble is at most 80% of the row. `compact` shrinks the avatar to 24px, the gaps to 8px and 4px, and
// drops the 48px kept free after the body.
// The actions sit at 50% opacity until the message is hovered or focus moves into them.
export default {
  slots: {
    base: 'group/message flex w-full items-start gap-3',
    leading: 'shrink-0 self-start',
    avatar: '',
    icon: 'size-4',
    body: 'flex min-w-0 flex-1 flex-col gap-2',
    content: [
      'flex min-w-0 max-w-full flex-col gap-2 text-sm leading-relaxed',
      'bg-(--chat-message-bg) text-(--chat-message-fg)',
    ],
    text: 'whitespace-pre-wrap wrap-break-word',
    sources: 'flex flex-wrap gap-2',
    footer:
      'flex opacity-50 transition-opacity group-hover/message:opacity-100 focus-within:opacity-100 motion-reduce:transition-none',
  },
  variants: {
    variant: {
      primary: {
        content: 'rounded-[calc(var(--radius)*2)] px-4 py-2 [--chat-message-bg:var(--foreground)]',
      },
      secondary: {
        content: 'rounded-[calc(var(--radius)*2)] px-4 py-2 [--chat-message-bg:var(--default)]',
      },
      soft: {
        content:
          'rounded-[calc(var(--radius)*2)] px-4 py-2 [--chat-message-bg:var(--default-soft)]',
      },
      outline: {
        content:
          'rounded-[calc(var(--radius)*2)] border border-border px-4 py-2 [--chat-message-bg:transparent]',
      },
      tertiary: { base: 'py-2', content: 'w-full [--chat-message-bg:transparent]' },
    },
    color: {
      default: { content: '[--chat-message-fg:var(--default-foreground)]' },
      accent: { content: '[--chat-message-fg:var(--accent-soft-foreground)]' },
      success: { content: '[--chat-message-fg:var(--success-soft-foreground)]' },
      warning: { content: '[--chat-message-fg:var(--warning-soft-foreground)]' },
      danger: { content: '[--chat-message-fg:var(--danger-soft-foreground)]' },
    },
    side: {
      start: { body: 'items-start' },
      end: { base: 'flex-row-reverse', body: 'items-end', content: 'max-w-[80%]' },
    },
    compact: {
      true: { base: 'gap-2', avatar: 'size-6 [--avatar-size:1.5rem] rounded-xl', body: 'gap-1' },
      false: {},
    },
  },
  compoundVariants: [
    {
      variant: 'primary',
      color: 'default',
      class: { content: '[--chat-message-fg:var(--background)]' },
    },
    { side: 'start', compact: false, class: { body: 'sm:pe-12' } },
    {
      variant: 'primary',
      color: 'accent',
      class: {
        content: '[--chat-message-bg:var(--accent)] [--chat-message-fg:var(--accent-foreground)]',
      },
    },
    {
      variant: 'primary',
      color: 'success',
      class: {
        content: '[--chat-message-bg:var(--success)] [--chat-message-fg:var(--success-foreground)]',
      },
    },
    {
      variant: 'primary',
      color: 'warning',
      class: {
        content: '[--chat-message-bg:var(--warning)] [--chat-message-fg:var(--warning-foreground)]',
      },
    },
    {
      variant: 'primary',
      color: 'danger',
      class: {
        content: '[--chat-message-bg:var(--danger)] [--chat-message-fg:var(--danger-foreground)]',
      },
    },
    {
      variant: 'soft',
      color: 'accent',
      class: { content: '[--chat-message-bg:var(--accent-soft)]' },
    },
    {
      variant: 'soft',
      color: 'success',
      class: { content: '[--chat-message-bg:var(--success-soft)]' },
    },
    {
      variant: 'soft',
      color: 'warning',
      class: { content: '[--chat-message-bg:var(--warning-soft)]' },
    },
    {
      variant: 'soft',
      color: 'danger',
      class: { content: '[--chat-message-bg:var(--danger-soft)]' },
    },
  ],
  defaultVariants: {
    variant: 'tertiary',
    color: 'default',
    side: 'start',
    compact: false,
  },
}
