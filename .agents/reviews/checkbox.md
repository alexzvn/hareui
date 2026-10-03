# Checkbox: docs fidelity review

**Status:** ~99.5%. All 14 HeroUI demos that we port are pixel-identical (0 px pixelmatch) in light and dark. Section order matches. The gaps are the plan-sanctioned Render Function drop and `validate`/`validationBehavior`.

## Fixed
| File | Change | Evidence |
|---|---|---|
| `docs/demos/checkbox/custom-styles.vue` | removed spurious `default-value` (HeroUI demo starts unchecked) | tailwind-css: visibly checked vs unchecked → 0 px light/dark |
| `docs/demos/checkbox/render-props.vue` (new) + `checkbox.md` "Render Props" section in HeroUI's position | port of HeroUI `render-props.tsx` via `#label`/`#description` `{ state }` | render-props: missing → 0 px light/dark |
| `Checkbox.vue` | `#description` slot now receives `{ state }` (needed by the render-props demo); new `readonly` prop (RAC `isReadOnly`: focusable, `aria-readonly`, `data-readonly`, state never changes even uncontrolled); `aria-invalid` on the control button, `data-invalid` on root | `test/checkbox.spec.ts` "readonly ignores toggles in uncontrolled mode"; vue-tsc clean |
| `theme/checkbox.ts` | hover border no longer applies to a read-only *selected* checkbox. RAC never sets `data-hovered` when read-only, so HeroUI's `:has([data-hovered])` branch drops out and the plain `:hover` branch loses to the selected rule | parity `checkbox-readonly` (hover/press) failed on control border-color → passes; new `checkbox-readonly-unchecked` (hover) |
| `checkbox.md` | Styling Reference: read-only state; API Reference: Emits table | — |

Parity: `bun parity/compare.ts --component checkbox --concurrency 2` → **16/16 cases passed** (new: `checkbox-readonly`, `checkbox-readonly-unchecked`).

## API changes made (additive, need integrator sign-off per brief line 30)
- New prop `readonly` (RAC `isReadOnly`).
- `#description` slot now receives `{ state }` (previously no props).
Nothing renamed or removed; option A (props + named slots) kept.

## Remaining gaps → decisions needed
### Render Function demo (other: plan drop)
- HeroUI `checkbox.mdx` "Render Function" (`render-function.tsx`) uses RAC's `render` prop to swap the DOM element.
- Dropped per /tmp/herouse-plan.md (render-function demos are excluded across components). A Vue equivalent would be `as`/`as-child` on the root.
- Options: (1) keep dropped (current); (2) expose Reka's `as`/`asChild` on the root and add a demo; cheap, though it changes the public prop surface.

### `validate` / `validationBehavior` (API-design)
- HeroUI: `apps/docs/content/docs/en/react/components/(forms)/checkbox.mdx:213-214` lists `validate(value) => ValidationError | true | null` and `validationBehavior: 'native' | 'aria'` (RAC form-validation integration: native `setCustomValidity`, `<Form>` error aggregation, realtime vs commit display).
- herouse: validation is caller-driven (`invalid` + `error-message`/`#error`), consistent with TextField. No built-in validator, no native constraint-validation plumbing.
- Why not fixed: adds public props and a validation model across every form component, a cross-component decision.
- Options:
  1. Keep caller-driven validation (current). Zero new surface; HeroUI's `validate` demo becomes a computed `invalid`. Cost: no native form-submit blocking.
  2. Add `validate?: (v) => string | true | null` per component that sets `invalid` + message internally, `aria` behaviour only. Small, Vue-idiomatic; no native validation.
  3. Full parity: `validate` + `validationBehavior`, wiring `setCustomValidity` on the hidden input (Reka renders a native `<input>` bubble for forms). Closest to HeroUI; most work, and needs a shared form-validation composable for TextField/Checkbox/Switch/RadioGroup.

### Heading names (other: plan template)
`Global CSS` → `Global Configuration`, `CSS Classes` → `Slots`, and the per-part API headings (`Checkbox`, `Checkbox.Content`, `CheckboxFieldRenderProps`, `CheckboxButtonRenderProps`) → `Props`/`Slots`/`Emits`. All of these follow the plan's page template (/tmp/herouse-plan.md:290). We add `## Accessibility`. No action unless the integrator wants HeroUI's headings verbatim.

## Screenshots
/tmp/herouse-review/checkbox/: `<demo>-{heroui,ours,diff}-{light,dark}.png` for controlled, custom-indicator, default-selected, disabled, external-label, form-integration, full-rounded, indeterminate, invalid, render-props, tailwind-css, usage, variants, with-description (all 0 px), plus render-function-heroui-* (dropped).
