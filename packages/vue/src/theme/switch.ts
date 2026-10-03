// Translated from @heroui/styles components/switch.css
// The root mirrors HeroUI's state attributes (`data-selected`, `data-disabled` = "true").
export default {
  slots: {
    base: [
      'group/switch flex flex-col items-start gap-1 no-highlight cursor-(--cursor-interactive)',
      '[--switch-control-bg:var(--default)] [--switch-control-bg-hover:color-mix(in_oklab,var(--switch-control-bg),transparent_20%)] [--switch-control-bg-pressed:var(--switch-control-bg-hover)] [--switch-control-bg-checked:var(--accent)] [--switch-control-bg-checked-hover:var(--accent-hover)]',
      'data-[disabled=true]:status-disabled data-[disabled=true]:[&_[data-slot=description]]:status-disabled data-[disabled=true]:[&_[data-slot=field-error]]:status-disabled',
      // `& > [data-slot=description]`, `& > [data-slot=field-error]`; `&&` beats FieldError's own toggle-field reset (`p-0`)
      '[&>[data-slot=description]]:w-full [&>[data-slot=description]]:min-w-0 [&>[data-slot=description]]:ps-[calc(2.5rem+0.75rem)]',
      '[&>[data-slot=field-error]]:w-full [&>[data-slot=field-error]]:min-w-0 [&&>[data-slot=field-error]]:ps-[calc(2.5rem+0.75rem)] [&>[data-slot=field-error]]:text-xs [&>[data-slot=field-error]]:text-muted',
      '[&_[data-slot=label]]:select-none [&_[data-slot=description]]:cursor-default [&_[data-slot=description]]:select-none',
    ],
    content: [
      'relative inline-flex cursor-[inherit] items-center gap-3 text-start text-sm font-medium text-foreground outline-none focus-visible:[outline:none] select-none no-highlight',
      '[&_[data-slot=label]]:cursor-(--cursor-interactive)',
    ],
    control: [
      'relative flex h-5 w-10 shrink-0 items-center overflow-hidden rounded-xl bg-(--switch-control-bg-current)',
      '[transition:background-color_250ms_var(--ease-smooth),box-shadow_150ms_var(--ease-out)] motion-reduce:transition-none',
      'group-has-focus-visible/switch:status-focused',
      // HeroUI's state rules live in `@layer components`, so a user `bg-*` utility beats every state.
      // States only swap `--switch-control-bg-current`; the single `bg-*` above is what a `ui.control` class replaces.
      '[--switch-control-bg-current:var(--switch-control-bg)]',
      // HeroUI's hover/pressed selector lists include `:has(… [data-hovered|data-pressed])`, so they out-rank the checked rule
      '[[data-slot=switch]:hover_&]:[--switch-control-bg-current:var(--switch-control-bg-hover)]',
      '[[data-slot=switch]:active_&]:[--switch-control-bg-current:var(--switch-control-bg-pressed)] motion-reduce:[[data-slot=switch]:active_&]:transform-none',
      'group-data-[selected=true]/switch:[--switch-control-bg-current:var(--switch-control-bg-checked)]',
      '[[data-slot=switch][data-selected=true]:hover_&]:[--switch-control-bg-current:var(--switch-control-bg-checked-hover)]',
      '[[data-slot=switch][data-selected=true]:active_&]:[--switch-control-bg-current:var(--switch-control-bg-checked-hover)]',
    ],
    thumb: [
      'ms-0.5 flex h-4 w-[1.375rem] origin-center rounded-lg bg-white text-black shadow-field',
      '[transition:margin_300ms_var(--ease-out-fluid),background-color_200ms_var(--ease-out)] motion-reduce:transition-none',
      'group-data-[disabled=true]/switch:bg-default-foreground/20',
      'group-data-[selected=true]/switch:[box-shadow:0px_0px_5px_0px_rgb(0_0_0_/_0.02),0px_2px_10px_0px_rgb(0_0_0_/_0.06),0px_0px_1px_0px_rgb(0_0_0_/_0.3)]',
      'group-data-[selected=true]/switch:ms-[calc(100%-1.5rem)] group-data-[selected=true]/switch:bg-accent-foreground group-data-[selected=true]/switch:text-accent',
      '[[data-slot=switch][data-disabled=true][data-selected=true]_&]:opacity-40',
      '*:flex *:size-full *:items-center *:justify-center',
    ],
    icon: '',
  },
  variants: {
    size: {
      sm: {
        base: '[&>[data-slot=description]]:ps-[calc(2rem+0.75rem)] [&&>[data-slot=field-error]]:ps-[calc(2rem+0.75rem)]',
        control: 'h-4 w-8 rounded-lg',
        thumb: 'h-3 w-[1.03125rem] rounded-md group-data-[selected=true]/switch:ms-[calc(100%-1.15625rem)]',
      },
      md: {},
      lg: {
        base: '[&>[data-slot=description]]:ps-[calc(3rem+0.75rem)] [&&>[data-slot=field-error]]:ps-[calc(3rem+0.75rem)]',
        control: 'h-6 w-12',
        thumb: 'h-5 w-[1.71875rem] rounded-xl group-data-[selected=true]/switch:ms-[calc(100%-1.84375rem)]',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
}
