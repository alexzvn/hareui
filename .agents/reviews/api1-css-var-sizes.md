# API 1: CSS-variable responsive sizes (-8sP15N)

## Scope correction

`next.md` lists button, avatar, chip, modal, spinner and switch as themes "with `md:`". A grep for real breakpoint prefixes in class strings (`(sm|md|lg|xl):<utility>`) finds them only in **button**, **modal** and **input**. The avatar/chip/spinner/switch hits were the `sm:`/`md:` *variant keys* (`size: { sm: …, md: … }`), not breakpoints. HeroUI's CSS confirms this: `@media`/`sm:`/`md:` appear only in `button.css`, `modal.css` and `input.css`. So avatar, chip, spinner and switch are unchanged, and input was added.

## Changes

| Theme | Before (HeroUI) | After |
|---|---|---|
| `button.ts` base | `h-10 md:h-9` | `h-(--button-height) [--button-height:--spacing(10)] md:[--button-height:--spacing(9)]` |
| `button.ts` size sm / lg | `h-9 md:h-8` / `h-11 md:h-10` | `[--button-height:--spacing(9)] md:[--button-height:--spacing(8)]` / `…(11)… md:…(10)` |
| `button.ts` iconOnly | `w-10 p-0 md:w-9` plus 2 compound variants | `w-(--button-height) p-0`. Icon-only width always equals the size's height, so the compound variants are gone. |
| `modal.ts` container | `w-full p-4 sm:w-fit sm:p-10` | `w-(--modal-container-width)` and `p-(--modal-container-padding)`, each with a base and `sm:` variable value |
| `modal.ts` size full | `p-0 sm:p-0` | `p-0` |
| `modal.ts` placement auto dialog | `mt-auto sm:my-auto` | `mt-auto mb-(--modal-dialog-margin-bottom) [--…:0px] sm:[--…:auto]` |
| `input.ts` | `text-base sm:text-sm` | `text-(length:--input-font-size)/(--input-line-height)` with `--text-base*` and `sm:` `--text-sm*` values |

Unchanged:
- Button's `sm:` icon size and margin inside `[:where(&_svg…)]`. These rules have zero specificity, so an icon's own `size-*` class already wins.
- Modal's `sm:data-[state=open]:slide-in-from-bottom-0` entry-animation offset. It's transient, and tailwind-merge doesn't group the animate plugin's classes, so a variable wouldn't make user overrides more reliable.

Result: a plain user `h-11` / `w-12` / `p-2` / `my-4` / `text-lg` now removes the theme class through tailwind-merge and wins at every breakpoint, like HeroUI's `@layer components` (checked with tailwind-merge 3.7.0).

## Follow-ups done
- `docs/demos/button/custom-variants.vue`: the `md:h-*` workaround is removed, so the demo is now the same as HeroUI's (`h-10 px-4`, …).
- `packages/herouse/test/ui.spec.ts`: "app config can change default variants" now checks for the lg size's `[--button-height:--spacing(11)]` instead of `h-11`.

## Verification
- Parity at the default threshold: button 16/16, modal 16/16, input 8/8, textfield 7/7.
- Below-breakpoint probe: computed width, height, font-size, line-height, padding and margin of every `[data-slot]` in every button/input/modal parity case at 600, 700 and 1280 px viewports, playground vs reference: **120/120 identical**.
- `bun run typecheck` is clean and vitest passes 54/54 (before Alert/Typography were added).
