// The root is the scroll viewport: a flex column that fills its parent (`flex-1 min-h-0`), 14px text, the themed
// scrollbar, and a 32px fade masked into the top and bottom edges (the 10px scrollbar strip on the right stays
// unmasked). Messages stack in a centred column 32px apart with 16px side and 32px block padding, at most 768px wide.
// The scroll-to-bottom button sticks 16px above the bottom edge, centred: a small icon-only button in `surface` and
// `foreground` with the surface shadow and a transparent 1px border. While hidden it keeps its place but is invisible
// and ignores the pointer. The footer sticks to the bottom edge in the message column on `background`; with it the
// bottom fade is dropped and the scroll button rises above the footer's measured height.
export default {
  slots: {
    base: [
      'relative flex min-h-0 flex-1 flex-col overflow-y-auto text-sm scrollbar',
      '[--chat-conversation-fade:32px] [--chat-conversation-fade-end:32px] [--chat-conversation-scrollbar:10px]',
      'data-footer:[--chat-conversation-fade-end:0px]',
      '[mask-image:linear-gradient(to_bottom,transparent,black_var(--chat-conversation-fade),black_calc(100%_-_var(--chat-conversation-fade-end)),transparent_calc(100%_-_var(--chat-conversation-fade-end)+var(--chat-conversation-fade))),linear-gradient(black,black)]',
      '[mask-position:0_0,100%_0] [mask-repeat:no-repeat]',
      '[mask-size:calc(100%_-_var(--chat-conversation-scrollbar))_100%,var(--chat-conversation-scrollbar)_100%]',
    ],
    content: 'mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8',
    scrollButtonContainer: [
      'sticky bottom-[calc(var(--chat-conversation-footer,0px)+1rem)] z-10 mx-auto w-max',
      'data-[state=hidden]:invisible data-[state=hidden]:pointer-events-none',
    ],
    footer: 'sticky bottom-0 z-10 mx-auto w-full max-w-3xl bg-background px-4 pb-4',
    scrollButton: [
      'border border-transparent shadow-surface',
      '[--button-bg:var(--surface)] [--button-bg-hover:var(--surface)] [--button-bg-pressed:var(--surface)] [--button-fg:var(--foreground)]',
    ],
  },
}
