// Translated from @heroui/styles components/button.css
export default {
  slots: {
    base: [
      'relative isolate inline-flex w-fit origin-center items-center justify-center gap-2 rounded-3xl px-4 text-sm font-medium whitespace-nowrap outline-none select-none no-highlight',
      // Responsive height lives in a variable so a plain `h-*` from the user wins at every breakpoint
      // (HeroUI's `md:h-9` sits in @layer components, below utilities).
      'h-(--button-height) [--button-height:--spacing(10)] md:[--button-height:--spacing(9)]',
      '[transition:transform_250ms_var(--ease-smooth),background-color_100ms_var(--ease-out),box-shadow_100ms_var(--ease-out)] transform-gpu motion-reduce:transition-none',
      'cursor-(--cursor-interactive)',
      '[--button-bg:transparent] [--button-bg-hover:var(--button-bg)] [--button-bg-pressed:var(--button-bg-hover)] [--button-fg:currentColor]',
      'bg-(--button-bg) text-(--button-fg)',
      'focus-visible:status-focused',
      'disabled:status-disabled aria-disabled:status-disabled',
      'data-[pending=true]:status-pending',
      // HeroUI styles `:active` and `[data-pressed=true]` alike; RAC sets the latter on a menu trigger while its menu is open
      'active:will-change-transform active:bg-(--button-bg-pressed) active:[transform:scale(0.97)]',
      'data-[pressed=true]:will-change-transform data-[pressed=true]:bg-(--button-bg-pressed) data-[pressed=true]:[transform:scale(0.97)]',
      // HeroUI declares :hover after :active, so hover background wins while pressing on hover-capable devices
      'hover:bg-(--button-bg-hover) hover:active:bg-(--button-bg-hover) hover:data-[pressed=true]:bg-(--button-bg-hover)',
      // :where() keeps these at zero specificity: HeroUI's `.button svg:not(…)` sits in @layer components,
      // so any utility on the icon itself (e.g. `size-3.5`) wins over the button's default icon size.
      '[:where(&_svg:not([data-slot=spinner]_svg,[data-slot=link-icon]_svg))]:pointer-events-none [:where(&_svg:not([data-slot=spinner]_svg,[data-slot=link-icon]_svg))]:-mx-0.5 [:where(&_svg:not([data-slot=spinner]_svg,[data-slot=link-icon]_svg))]:my-0.5 [:where(&_svg:not([data-slot=spinner]_svg,[data-slot=link-icon]_svg))]:size-5 [:where(&_svg:not([data-slot=spinner]_svg,[data-slot=link-icon]_svg))]:shrink-0 [:where(&_svg:not([data-slot=spinner]_svg,[data-slot=link-icon]_svg))]:self-center sm:[:where(&_svg:not([data-slot=spinner]_svg,[data-slot=link-icon]_svg))]:my-1 sm:[:where(&_svg:not([data-slot=spinner]_svg,[data-slot=link-icon]_svg))]:size-4',
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
      sm: { base: '[--button-height:--spacing(9)] px-3 md:[--button-height:--spacing(8)] [:where(&_svg:not([data-slot=spinner]_svg,[data-slot=link-icon]_svg))]:size-4 sm:[:where(&_svg:not([data-slot=spinner]_svg,[data-slot=link-icon]_svg))]:size-4 active:[transform:scale(0.98)] data-[pressed=true]:[transform:scale(0.98)]' },
      md: { base: '' },
      lg: { base: '[--button-height:--spacing(11)] text-base md:[--button-height:--spacing(10)] active:[transform:scale(0.96)] data-[pressed=true]:[transform:scale(0.96)]' },
    },
    iconOnly: {
      // Before fullWidth: HeroUI's `.button--full-width` comes later, so `w-full` beats the square width.
      // Icon-only buttons are square: HeroUI's per-size `w-10 md:w-9` etc. equal the size's height.
      true: { base: 'w-(--button-height) p-0' },
    },
    fullWidth: {
      true: { base: 'w-full' },
      false: { base: '' },
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    fullWidth: false,
    iconOnly: false,
  } as const,
}
