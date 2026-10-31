// Translated from @heroui/styles components/empty-state.css
// Without media, a title, a description or actions, the empty state is a plain `p-2 text-sm text-muted` line (as in
// lists and tables). With any of them (`structured`) it becomes a centred column:
// - Sizes set the padding (sm 24/16px, md 32/24px, lg 48/32px vertical/horizontal), the gap between the header and
//   the actions (12/16/20px), the media (40/48/56px with a 16/20/24px icon) and the title (14/16/18px semibold);
//   the description is 12px at sm and 14px otherwise, `text-muted`. Header parts sit 8px apart.
// - The `icon` media is a circle on `bg-default`; avatar media has no background.
// - Variants: `outline` adds a 1px dashed `border` with 16px corners, `secondary` a `bg-surface-secondary` fill.
export default {
  slots: {
    base: 'p-2 text-sm text-muted',
    header: 'flex flex-col items-center gap-2',
    media: 'flex shrink-0 items-center justify-center',
    title: 'm-0 font-semibold text-foreground',
    description: 'm-0 text-pretty text-muted',
    actions: 'flex flex-wrap items-center justify-center gap-2',
  },
  variants: {
    size: {
      sm: {
        title: 'text-sm',
        description: 'text-xs',
      },
      md: {
        title: 'text-base',
        description: 'text-sm',
      },
      lg: {
        title: 'text-lg',
        description: 'text-sm',
      },
    },
    variant: {
      default: {},
      outline: { base: 'rounded-2xl border border-dashed border-border' },
      secondary: { base: 'rounded-2xl bg-surface-secondary' },
    },
    media: {
      icon: { media: 'rounded-full bg-default text-foreground' },
      avatar: {},
      custom: {},
      none: {},
    },
    structured: {
      true: { base: 'flex flex-col items-center text-center' },
      false: {},
    },
  },
  compoundVariants: [
    { structured: true, size: 'sm', class: { base: 'gap-3 px-4 py-6' } },
    { structured: true, size: 'md', class: { base: 'gap-4 px-6 py-8' } },
    { structured: true, size: 'lg', class: { base: 'gap-5 px-8 py-12' } },
    { media: 'icon', size: 'sm', class: { media: 'size-10 [&>*]:size-4' } },
    { media: 'icon', size: 'md', class: { media: 'size-12 [&>*]:size-5' } },
    { media: 'icon', size: 'lg', class: { media: 'size-14 [&>*]:size-6' } },
  ],
  defaultVariants: {
    size: 'md',
    variant: 'default',
    structured: false,
  },
}
