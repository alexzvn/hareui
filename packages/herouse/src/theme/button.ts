// Translated from @heroui/styles components/button.css
export default {
  slots: {
    base: [
      'relative isolate inline-flex h-10 w-fit origin-center items-center justify-center gap-2 rounded-3xl px-4 text-sm font-medium whitespace-nowrap outline-none select-none no-highlight md:h-9',
      '[transition:transform_250ms_var(--ease-smooth),background-color_100ms_var(--ease-out),box-shadow_100ms_var(--ease-out)] transform-gpu motion-reduce:transition-none',
      'cursor-(--cursor-interactive)',
      '[--button-bg:transparent] [--button-bg-hover:var(--button-bg)] [--button-bg-pressed:var(--button-bg-hover)] [--button-fg:currentColor]',
      'bg-(--button-bg) text-(--button-fg)',
      'focus-visible:status-focused',
      'disabled:status-disabled aria-disabled:status-disabled',
      'data-[pending=true]:status-pending',
      'active:will-change-transform active:bg-(--button-bg-pressed) active:[transform:scale(0.97)]',
      // HeroUI declares :hover after :active, so hover background wins while pressing on hover-capable devices
      'hover:bg-(--button-bg-hover) hover:active:bg-(--button-bg-hover)',
      '[&_svg:not([data-slot=spinner]_svg,[data-slot=link-icon]_svg)]:pointer-events-none [&_svg:not([data-slot=spinner]_svg,[data-slot=link-icon]_svg)]:-mx-0.5 [&_svg:not([data-slot=spinner]_svg,[data-slot=link-icon]_svg)]:my-0.5 [&_svg:not([data-slot=spinner]_svg,[data-slot=link-icon]_svg)]:size-5 [&_svg:not([data-slot=spinner]_svg,[data-slot=link-icon]_svg)]:shrink-0 [&_svg:not([data-slot=spinner]_svg,[data-slot=link-icon]_svg)]:self-center sm:[&_svg:not([data-slot=spinner]_svg,[data-slot=link-icon]_svg)]:my-1 sm:[&_svg:not([data-slot=spinner]_svg,[data-slot=link-icon]_svg)]:size-4',
    ],
    spinner: '',
  },
  variants: {
    variant: {
      primary: { base: '[--button-bg:var(--accent)] [--button-bg-hover:var(--accent-hover)] [--button-bg-pressed:var(--accent-hover)] [--button-fg:var(--accent-foreground)]' },
      secondary: { base: '[--button-bg:var(--default)] [--button-bg-hover:var(--default-hover)] [--button-bg-pressed:var(--default-hover)] [--button-fg:var(--accent-soft-foreground)]' },
      tertiary: { base: '[--button-bg:var(--default)] [--button-bg-hover:var(--default-hover)] [--button-bg-pressed:var(--default-hover)]' },
      ghost: { base: '[--button-bg:transparent] [--button-bg-hover:var(--default)] [--button-bg-pressed:var(--default)] [--button-fg:var(--default-foreground)]' },
      outline: { base: '[--button-bg:transparent] [--button-bg-hover:color-mix(in_srgb,var(--default)_60%,transparent)] [--button-bg-pressed:var(--default)] [--button-fg:var(--default-foreground)] border border-border' },
      danger: { base: '[--button-bg:var(--danger)] [--button-bg-hover:var(--danger-hover)] [--button-bg-pressed:var(--danger-hover)] [--button-fg:var(--danger-foreground)]' },
      'danger-soft': { base: '[--button-bg:var(--danger-soft)] [--button-bg-hover:var(--danger-soft-hover)] [--button-bg-pressed:var(--danger-soft-hover)] [--button-fg:var(--danger-soft-foreground)]' },
    },
    size: {
      sm: { base: 'h-9 px-3 md:h-8 [&_svg:not([data-slot=spinner]_svg,[data-slot=link-icon]_svg)]:size-4 sm:[&_svg:not([data-slot=spinner]_svg,[data-slot=link-icon]_svg)]:size-4 active:[transform:scale(0.98)]' },
      md: { base: '' },
      lg: { base: 'h-11 text-base md:h-10 active:[transform:scale(0.96)]' },
    },
    fullWidth: {
      true: { base: 'w-full' },
      false: { base: '' },
    },
    iconOnly: {
      true: { base: 'w-10 p-0 md:w-9' },
    },
  },
  compoundVariants: [
    { iconOnly: true, size: 'sm', class: { base: 'w-9 md:w-8' } },
    { iconOnly: true, size: 'lg', class: { base: 'w-11 md:w-10' } },
  ],
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    fullWidth: false,
    iconOnly: false,
  },
}
