# RadioGroup: docs fidelity review

**Status:** ~97%. All 11 ported demos are pixel-identical (0 px) in light and dark, including the two that were badly off before (Delivery & Payment, Tailwind CSS). Missing: In Surface (needs `Surface`), Render Function (plan drop), Related Showcases (site widget).

## Fixed
| File | Change | Evidence |
|---|---|---|
| `RadioGroup.vue` | `data-selected="true"` mirrored on `[data-slot=radio-content]` (RAC sets it on the item's content element too), so HeroUI's `Radio.Content` classes like `data-[selected=true]:border-accent` port verbatim | delivery-payment & tailwind-css selected-card styling |
| `RadioGroup.vue` | new `readonly` (RAC `isReadOnly`); passes `null` instead of `undefined` to Reka when nothing is selected. Otherwise Reka switches to self-managed state and a click selects despite `readonly` | `test/radio-group.spec.ts` "readonly keeps the selection, also when nothing is selected yet"; parity `radio-group-readonly` (hover/press) |
| `theme/radioGroup.ts` | hover rules gated on `[data-slot=radio-group]:not([data-readonly=true])`. HeroUI keys radio hover only on RAC's `data-hovered`, which a read-only group never sets | parity `radio-group-readonly`: control border-color diff → pass |
| `theme/radioGroup.ts` | vertical item margin `[:where(&)_[data-slot=radio]]:mt-4`: zero-specificity root so user utilities win, matching HeroUI's `@layer components` rule (`radio-group.css:6-9`) | tailwind-css: item gap 28 px vs 12 px (3.8k px) → 0 px; new parity case `radio-group-user-overrides` (margin-top + content `data-selected`) |
| `docs/demos/radio-group/delivery-and-payment.vue` | rewritten: 3-col / 2-col grid with the label spanning; price/description inside the card; HeroUI's exact `Radio.Content` classes; real Mastercard/Visa/PayPal logos (Iconify `uim:master-card`, `streamline-logos:visa-logo-solid`, `ic:baseline-paypal`) inlined as `IconifyIcon` data with a 24×24 viewBox, so docs stay offline with only gravity-ui bundled. Previously: stacked full-width cards, descriptions outside the cards, generic card icons | visibly different → 0 px light/dark |
| `docs/demos/radio-group/custom-styles.vue` | HeroUI class strings ported verbatim (`data-[hovered|pressed|focus-visible]` → `hover:`/`active:`/`focus-visible:`), descriptions inside the card via `#item-label` | 3.8k px → 0 px light/dark |
| `radio-group.md` | Styling Reference: content `data-selected`, read-only state; Tailwind prose | — |

Parity: `bun parity/compare.ts --component radio-group --concurrency 2` → **16/16 cases passed** (new: `radio-group-readonly`, `radio-group-user-overrides`).

## Remaining gaps → decisions needed
### In Surface demo (missing-component)
- HeroUI `apps/docs/src/demos/en/radio-group/on-surface.tsx:1-5` wraps the group in `<Surface className="w-full rounded-3xl p-6">`.
- herouse has no `Surface`.
- Options: (1) add `Surface` (shared by many HeroUI "on surface" demos; small presentational component with its variants), then port; (2) port with a `<div class="bg-surface rounded-3xl p-6 …">` that copies surface.css; quick, but duplicated styling; (3) leave missing.

### Render Function demo (other: plan drop)
Needs `as`/`asChild` on the root/items; dropped per plan.

### Related Showcases section (other: site feature)
- HeroUI `radio-group.mdx` ends with `## Related Showcases` → `<RelatedShowcases component="RadioGroup" />` (12 HeroUI component pages use it). It links to HeroUI showcase apps.
- Not in the plan; would need a docs-site widget plus showcase content. Options: (1) skip (no showcase pages exist); (2) link to heroui.com showcases; (3) build showcase pages later.

### Heading names (other: plan template)
Per-part API headings (`RadioGroup`, `Radio`, `Radio.Control`, `Radio.Indicator`, `Radio.Content`, render-props types) → `Props`/`Slots`/`Emits`, per plan template.

## Screenshots
/tmp/herouse-review/radio-group/: controlled, custom-indicator, delivery-payment, disabled, horizontal-orientation, tailwind-css, uncontrolled, usage, validation, variants (0 px light/dark), plus heroui-only in-surface, render-function.
