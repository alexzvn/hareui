# Button — docs fidelity review

## Status

**Match: ~99.99%.** Every demo that belongs on heroui.com's Button page is on ours, in the same order. Final capture (chat widget hidden, animations frozen, 1440×900):
- light/dark `basic, variants, sizes, with-icons, icon-only, loading, loading-state, full-width, disabled, custom-variants, custom-styles`: **0 px diff (0.000%)** each
- light/dark `social`: **2 px (0.001%)**: anti-aliasing on the inlined brand SVGs
- light/dark `render-function`: **0 px (0.000%)**. Ported with `:as="CustomButton"`, which needed no API change: `Button.vue:13` already declares `as`. While the button is pressed it has `data-custom="pressed"`; otherwise `"bar"`.
- `ripple-effect`: MISSING on ours. The plan has no rule that drops it, so it is open decision #4 below.

## Fixed

1. **Missing demo: `social.vue`** (`docs/demos/button/social.vue`, new) — ported HeroUI's
   `button-social` demo (three `variant="tertiary"` full-width buttons with Google/GitHub/Apple
   icons). None of the three icons exist in the only installed iconify collection
   (`@iconify-json/gravity-ui`); inlined the exact `devicon:google`, `mdi:github`, `ion:logo-apple`
   SVG paths per the brief's fallback rule. Added to `button.md` as a new "Social Buttons" section,
   positioned exactly where HeroUI's mdx has it (after "Disabled State").
   Evidence: final capture 2 px (0.001%) light and dark.

2. **Missing demo: `custom-variants.vue`** (`docs/demos/button/custom-variants.vue`, new) —
   ported HeroUI's "Adding custom variants" demo, which extends `buttonVariants` with
   `tailwind-variants`. Ported using herouse's own extension mechanism: exported `tv` from
   `packages/herouse/src/index.ts` (one new line, alongside the already-exported `themes`
   namespace) so docs/userland code can do `tv({ extend: themes.button, ... })` exactly like
   every internal theme composition. The demo re-declares `radius`, `size`, and a `variant.primary`
   override, matching HeroUI's demo source line-for-line (menu of radius values, `h-{n} px-{n}`
   per size, `text-white dark:bg-white/10 ...` for primary).
   - **Debugging notes (two real bugs found and fixed in the demo while porting):**
     a. HeroUI's demo includes a dead utility `text-md` in its `base` string, which produces no
        CSS in either HeroUI or herouse (no `--text-md` token exists anywhere upstream). In
        HeroUI's BEM-class architecture this is harmless (the real font-size comes from the
        `.button--md` CSS rule, untouched). In herouse's utility-only `base` string, `text-sm`
        from the base theme is already present — `tailwind-merge`, however, still recognizes
        `text-md` as a same-group (font-size) class and evicted the working `text-sm`, leaving
        the button with the browser-default 16px text instead of 14px. Fix: dropped the dead
        `text-md` class from the demo (it did nothing in the original either).
     b. HeroUI's demo overrides `size.md` to `h-11 px-6` (44px tall) and this instantly wins in
        their app because Tailwind's `@layer utilities` (where `h-11` lives) always wins over
        `@layer components` (where `.button--md`'s own height lives) regardless of any responsive
        media query. herouse's `button` theme instead bakes its own responsive downscale directly
        as a plain utility, `md:h-9`, inside `slots.base` (unconditional for every size unless a
        size variant supplies its own `md:` override — see `sm`/`lg` in `theme/button.ts`, which
        do). Because my new `size.md` override only supplied an unprefixed `h-11`, the inherited
        `md:h-9` (same specificity, later in the generated stylesheet because of the `md:`
        variant) kept winning at desktop width, shrinking the button to 36px instead of 44px.
        Fix: added matching `md:h-{n}` to every size value in the demo's `size` variant so it
        neutralizes the inherited breakpoint downscale, exactly mirroring what `theme/button.ts`
        itself does for `sm`/`lg`.
   Added to `button.md` as "Adding custom variants", positioned exactly where HeroUI has it
   (after Social Buttons and Render Function).
   Evidence: before fix 3812px/1.335% (light) / 7466px/2.614% (dark) with a visible outline/text
   offset; after fix 0 px (0.000%) light and dark, confirmed by computed-style comparison (`getBoundingClientRect`,
   `font-size`, `padding`, `box-shadow`, `text-shadow` all byte-identical between heroui.com and
   ours).
   Parity: `bun parity/compare.ts --component button` → **16/16 cases passed** (re-run after the
   `index.ts` export addition; Button.vue/theme/button.ts themselves were not touched).

## Remaining gaps → decisions needed

1. **other — `release-outline-variant.tsx` demo is NOT part of the Button docs page.**
   HeroUI's `apps/docs/src/demos/en/button/release-outline-variant.tsx` is exported from the
   demo `index.ts` but is only referenced by `<ComponentPreview name="release-button-outline-variant" />`
   in `apps/docs/content/docs/en/react/releases/v3-0-0-beta-4.mdx` (a release-notes page) — it
   does **not** appear anywhere in `button.mdx`. Adding it to our `button.md` would make our page
   diverge from the real heroui.com Button page (the actual 99.9%-match target), not converge.
   Decision: left it out of `button.md`, consistent with the live site. Options if the user
   disagrees: (a) leave as-is (recommended — matches heroui.com's real Button page exactly),
   (b) add a "Release Notes" style callout section anyway for completeness even though heroui.com
   doesn't show it there, (c) port it to a new `docs/docs/releases/*` page mirroring the upstream
   release notes (out of scope for this component review).

2. **missing-component — `ButtonGroup` (referenced only by the excluded demo above).**
   `release-outline-variant.tsx` also demonstrates `<ButtonGroup variant="outline">`, which
   herouse doesn't implement (not in the Step 5 component list). Not a gap on the actual Button
   page since the demo isn't shown there (see #1), but flagged in case ButtonGroup coverage is
   later requested. Options: (a) skip (ButtonGroup isn't part of the 18 Step-9 components), (b)
   add a minimal `ButtonGroup.vue` (Reka has no primitive for it — would be a plain flex wrapper
   that passes `variant`/`size` context down to child Buttons via `provide`/`inject`), (c) document
   it as an explicit "not ported" note on the Button page's Related Components section.

3. **API-design — size overrides through `tv({ extend: themes.button })` need `md:` prefixes.**
   HeroUI applies the responsive height (`h-10 md:h-9`, /tmp/heroui/packages/styles/components/button.css:5,70,87) in `@layer components`, so any utility a user adds (for example `h-11`, custom-variants.tsx:23-28) wins at every breakpoint. herouse puts the same classes in `theme/button.ts:5,31,33` as plain utilities. tailwind-merge only treats classes as conflicting when they share a modifier, so `h-11` does not remove `md:h-9`, and at ≥768px the button stays 36px tall. The ported demo works around this with `md:h-11` and similar, which HeroUI users never have to write. The same mechanism lets a dead `text-md` remove the working `text-sm`; the port just dropped the dead `text-md`.
   Options:
   (a) Document it on the Customization section: when overriding height, also override `md:h-*`. No code change, but the API is less ergonomic than HeroUI's.
   (b) Move the responsive heights into a CSS variable, e.g. `h-(--button-h)` with `--button-h` set per size plus an `md:` value, so a plain `h-11` override wins. Small theme change; parity must still match the computed height.
   (c) Ship the responsive downscale as a named variant (`responsive: true` by default) that users can turn off. Adds a public variant, so it's a public API change.

4. **missing-component/API: `ripple-effect` is missing.** It needs a ripple primitive that herouse doesn't have. Options: (a) add a small `useRipple` composable plus a `#ripple` slot or `ripple` prop on Button (new API, needs a parity case); (b) port the demo with inline markup in the demo file only; (c) leave it out and add a note on the page.

## Screenshots

All in `/tmp/herouse-review/button/`: `{demo}-{heroui,ours}-{light,dark}.png` for `basic, variants, sizes, with-icons, icon-only, loading,
loading-state, full-width, disabled, social, render-function, custom-variants, custom-styles`
(13 demos × 2 themes). Diff PNGs exist only for non-zero results: currently
`social-diff-{light,dark}.png`. `ripple-effect` has no capture on our side (see #4).
