# Switch: docs fidelity review

**Status:** ~95%. All 11 ported demos are pixel-identical (0 px) in light and dark. Three HeroUI demos (Group, Group Horizontal, Form Integration) need the missing `SwitchGroup` component. Render Function is dropped per plan.

## Fixed
| File | Change | Evidence |
|---|---|---|
| `theme/switch.ts` | control background now flows through one `bg-(--switch-control-bg-current)` utility, and states only swap that variable. A `ui.control` `bg-*` class therefore beats every state, as in HeroUI where state rules live in `@layer components` | with-icons (per-switch `bg-*/80` colours were all accent-blue): visibly wrong → 0 px light/dark. New parity case `switch-control-bg-override` (hover/press) |
| `docs/demos/switch/custom-styles.vue` | label + Description stacked in a column beside the control (HeroUI's `Switch.Content` layout) via `#label`; checked colour via CSS vars on `ui.control` | tailwind-css: control vertically misaligned → 0 px light/dark |
| `docs/demos/switch/render-props.vue` (new) + `switch.md` section | `#label="{ checked }"` port of `render-props.tsx` | missing → 0 px light/dark |
| `Switch.vue` | new `invalid` prop (`aria-invalid` on control, `data-invalid` on root); new `readonly` (RAC `isReadOnly`); `#description` slot receives `{ checked }` | `test/switch.spec.ts` readonly + invalid tests; parity `switch-invalid`, `switch-readonly` (press) |
| `switch.md` | Styling Reference: full root state list (invalid/read-only/required); Emits table; Tailwind prose updated | — |

Parity: `bun parity/compare.ts --component switch --concurrency 2` → **16/16 cases passed** (new: `switch-control-bg-override`, `switch-invalid`, `switch-readonly`).

## Remaining gaps → decisions needed
### SwitchGroup (missing-component): Group, Group Horizontal, Form Integration demos
- HeroUI: `packages/react/src/components/switch-group/switch-group.tsx:15-29` (`SwitchGroup` with `orientation`, `switch-group.css`), used by demos `group.tsx`, `group-horizontal.tsx`, `form.tsx`, and documented under API Reference "SwitchGroup".
- herouse: no SwitchGroup. The three demos and the API section are absent (switch.md has no Group/Group Horizontal/Form Integration headings).
- Options:
  1. Add `SwitchGroup.vue` (+ `theme/switchGroup.ts`) as a styled layout wrapper (`orientation` → flex-col/row with HeroUI gaps), then port the three demos. Small, and matches HeroUI, which is also presentational only.
  2. Port the demos with a plain `<div class="flex flex-col gap-…">` and a note. Fast, but a 99.9% match needs the exact group CSS duplicated in docs.
  3. Leave missing and document it. No work; −3 demos.

### Label position (API-design, minor): currently a CSS workaround, pixel-identical
- HeroUI `label-position.tsx:16` places the text before `<Switch.Control>` in DOM order.
- herouse: `:ui="{ content: 'flex-row-reverse justify-end' }"`. 0 px diff, but the DOM/reading order stays control → label.
- Options: (1) keep (no visual difference; accessible name comes from `aria-labelledby` anyway); (2) add a `labelPlacement: 'start' | 'end'` prop that reorders children; (3) add a `#content` slot for free composition.

### `validate` / `validationBehavior` (API-design)
- HeroUI: `apps/docs/content/docs/en/react/components/(controls)/switch.mdx:234-235` lists `validate(value) => ValidationError | true | null` and `validationBehavior: 'native' | 'aria'` (RAC form-validation integration: native `setCustomValidity`, `<Form>` error aggregation, realtime vs commit display).
- herouse: validation is caller-driven (`invalid` + `error-message`/`#error`), consistent with TextField. No built-in validator, no native constraint-validation plumbing.
- Why not fixed: adds public props and a validation model across every form component, a cross-component decision.
- Options:
  1. Keep caller-driven validation (current). Zero new surface; HeroUI's `validate` demo becomes a computed `invalid`. Cost: no native form-submit blocking.
  2. Add `validate?: (v) => string | true | null` per component that sets `invalid` + message internally, `aria` behaviour only. Small, Vue-idiomatic; no native validation.
  3. Full parity: `validate` + `validationBehavior`, wiring `setCustomValidity` on the hidden input (Reka renders a native `<input>` bubble for forms). Closest to HeroUI; most work, and needs a shared form-validation composable for TextField/Checkbox/Switch/RadioGroup.

### Render Function demo (other: plan drop)
As for Checkbox: needs `as`/`asChild`; dropped per plan.

### Heading names (other: plan template)
`Global CSS`/`CSS Classes`/per-part API headings → plan template names, as in checkbox.md.

## Screenshots
/tmp/herouse-review/switch/: controlled, default-selected, disabled, label-position, render-props, sizes, tailwind-css, usage, with-description, with-icons, without-label (0 px light/dark), plus heroui-only group, group-horizontal, form-integration, render-function.
