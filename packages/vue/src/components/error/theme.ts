// Error page, recoloured with HeroUI tokens (`primary` -> accent, `highlighted` -> foreground).
export default {
  slots: {
    root: 'flex min-h-[calc(100vh-var(--header-height,0px))] flex-col items-center justify-center text-center',
    leading: 'mb-4 flex items-center justify-center text-accent [&>svg]:size-10 [&>svg]:shrink-0',
    statusCode: 'text-base font-semibold text-accent',
    statusMessage: 'mt-2 text-4xl font-bold text-balance text-foreground sm:text-5xl',
    message: 'mt-4 text-lg text-balance text-muted',
    links: 'mt-8 flex items-center justify-center gap-6',
  },
}
