// The indicator of a reply that hasn't started. `dots`: three `muted` dots (6px) that brighten and grow in turn over
// 1.2s, 4px apart. `pulse`: one `accent` dot (8px) that breathes over 1.4s. `spinner`: the accent Spinner.
// `skeleton`: a 32px `default` circle beside 12px `default` bars 8px apart (three by default: full, 85% and, last,
// 65% width), as a stand-in for an assistant message. The dots, the pulse and the spinner take one line box, so they
// centre on the first line of the text around them. Sizes scale the dots, the pulse, the circle and the bars. With reduced motion the
// dots and the pulse hold still at 70% opacity.
export default {
  slots: {
    base: 'inline-flex items-center',
    dot: 'shrink-0 animate-chat-loader-bounce rounded-full bg-muted nth-1:[animation-delay:-0.24s] nth-2:[animation-delay:-0.12s] motion-reduce:animate-none motion-reduce:opacity-70',
    pulse:
      'shrink-0 animate-chat-loader-pulse rounded-full bg-accent motion-reduce:animate-none motion-reduce:opacity-70',
    spinner: '',
    avatar: 'shrink-0 rounded-full bg-default',
    bars: 'flex min-w-0 flex-1 flex-col gap-2',
    bar: 'w-full rounded-[calc(var(--radius)*0.75)] bg-default nth-2:w-[85%] last:w-[65%]',
    label: 'sr-only',
  },
  variants: {
    variant: {
      dots: { base: 'min-h-[1lh] gap-1' },
      pulse: { base: 'min-h-[1lh]' },
      spinner: { base: 'min-h-[1lh]' },
      skeleton: { base: 'flex w-full items-start gap-3' },
    },
    size: {
      sm: { dot: 'size-1.25', pulse: 'size-1.5', avatar: 'size-6', bar: 'h-2.5' },
      md: { dot: 'size-1.5', pulse: 'size-2', avatar: 'size-8', bar: 'h-3' },
      lg: { dot: 'size-2', pulse: 'size-2.5', avatar: 'size-9', bar: 'h-3.5' },
    },
  },
  defaultVariants: {
    variant: 'dots',
    size: 'md',
  },
}
