# TextField: docs fidelity review

**Status:** about 95%. 10 of 13 HeroUI demos are 0 px light and dark. The other three (on-surface, validation, controlled) differ only because herouse has no TextArea: a 4-row textarea is replaced by a one-line Input. The `textarea` demo is missing for the same reason.

## Content diff
Section order and prose match the HeroUI mdx. The only differences are the project-wide Vue conventions used by every herouse page: an extra `## Anatomy` section, `### Global Configuration` instead of `### Global CSS`, `### Slots` / `### State Variants` instead of `### CSS Classes`, and API tables split into Props / Slots / Emits. Before this review the page was missing `### In Surface`, `### Render Function` and the `### Render Props` table. All three are now added in HeroUI's order. `### TextArea` is still missing (missing-component). `## Related Showcases` is a heroui.com marketing block and is not ported.

## Visual diff (after fixes)
- 0 px: basic, with-description, required, disabled, full-width, with-error, input-types, render-function, custom-styles.
- validation 3589 / 2833 px (light / dark), controlled 2501 / 1886 px, on-surface: size differs (816×441 vs 816×381). All three come from TextArea → Input.
- textarea: not ported.

## Variant / config coverage
HeroUI TextField API (text-field.mdx:160–235): `isRequired`, `isInvalid`, `isDisabled`, `isReadOnly`, `value` / `defaultValue` / `onChange`, `name`, `type`, `fullWidth`, `variant`, `validationBehavior`, `validate`, `autoFocus`, `aria-label`, `aria-labelledby`, plus render props (`isDisabled`, `isInvalid`, `isReadOnly`, `isRequired`, `isFocusWithin`, `isFocusVisible`). Before this review herouse lacked `readonly`, `defaultValue`, the focus states, and working `aria-label`.

## Fixed
- packages/herouse/src/components/TextField.vue:
  - New `defaultValue` and `readonly` props.
  - Root now has `data-required`, `data-readonly`, `data-focus-within` and `data-focus-visible`, as in HeroUI's render props.
  - The default slot now gets `required`, `readonly`, `focusWithin` and `focusVisible` as well as `id`, `describedBy`, `invalid` and `disabled`.
- textFieldContext.ts: adds `readonly`, `ariaLabel` and `ariaLabelledby`.
- **Accessibility bug:** `<TextField aria-label="Email">` used to put the label on the wrapper `<div>`, leaving the input unnamed. It's now forwarded to the input (default or slotted). Other attributes still fall through to the root.
- Tests (test/text-field.spec.ts): defaultValue vs v-model, readonly reaching a default and a slotted Input, focus-within tracking, aria-label forwarding. New test/input.spec.ts covers a bare Input with defaultValue (number type emits a number) and v-model precedence. The package test suite passes (10 files, 48 tests) and `typecheck` is clean.
- Parity: added `textfield-readonly` (React `isReadOnly defaultValue`), which passes 1/1. Full run: `bun parity/compare.ts --component textfield --concurrency 1` → 7/7 cases passed.
- Docs: added docs/demos/textfield/on-surface.vue and docs/demos/textfield/render-function.vue (0 px); added the "In Surface", "Render Function" and "Render Props" sections; updated the Anatomy slot props and the Interactive States (Required, Read Only, Focus Within, Focus Visible).

## Remaining gaps → decisions needed
1. **missing-component: TextArea.** Affects the textarea demo (text-field.mdx:78) and the Bio fields in validation.tsx:33, controlled.tsx:19 and on-surface.tsx. Our demos use Input instead.
   - A) Build `TextArea.vue` mirroring Input (same theme tokens, `rows`, `data-slot="textarea"`; textfield.css already targets it). Then the default TextField slot can host it. Medium cost; this is the fix that brings all 4 demos to 0 px.
   - B) Add `as="textarea"` to Input. Low cost, but it diverges from HeroUI's component list.
   - C) Keep the Input substitution. No cost, but 3 demos stay visibly different and one is missing.
2. **missing-component: Surface.** The on-surface demo inlines Surface's classes.
3. **API-design: input-level attributes on TextField.** In HeroUI, `autoFocus`, `maxLength`, `pattern` and `autoComplete` on TextField reach the input. In herouse, non-prop attributes fall through to the root `<div>`; only `aria-label` / `aria-labelledby` are forwarded. Options:
   - A) Forward every attribute to the default Input and keep `class` on the root (Nuxt UI UInput style). This is a breaking change for anyone setting `data-*` on the root.
   - B) Add an explicit allow-list of input props (`autofocus`, `maxlength`, `pattern`, `autocomplete`, `inputmode`). This is additive.
   - C) Document "use the default slot with `<Input …>`". No code change.
4. **API-design: validation** (`validate`, `validationBehavior`, native constraint errors). See field-error.md, gap 1.

## Screenshots
- /tmp/herouse-review/text-field/basic-{heroui,ours}-{light,dark}.png (+ `textfield-basic-diff-*.png`)
- /tmp/herouse-review/text-field/on-surface-{heroui,ours}-{light,dark}.png (+ `textfield-on-surface-diff-*.png`)
- /tmp/herouse-review/text-field/with-description-{heroui,ours}-{light,dark}.png (+ `textfield-with-description-diff-*.png`)
- /tmp/herouse-review/text-field/required-{heroui,ours}-{light,dark}.png (+ `textfield-required-diff-*.png`)
- /tmp/herouse-review/text-field/disabled-{heroui,ours}-{light,dark}.png (+ `textfield-disabled-diff-*.png`)
- /tmp/herouse-review/text-field/full-width-{heroui,ours}-{light,dark}.png (+ `textfield-full-width-diff-*.png`)
- /tmp/herouse-review/text-field/validation-{heroui,ours}-{light,dark}.png (+ `textfield-validation-diff-*.png`)
- /tmp/herouse-review/text-field/controlled-{heroui,ours}-{light,dark}.png (+ `textfield-controlled-diff-*.png`)
- /tmp/herouse-review/text-field/with-error-{heroui,ours}-{light,dark}.png (+ `textfield-with-error-diff-*.png`)
- /tmp/herouse-review/text-field/input-types-{heroui,ours}-{light,dark}.png (+ `textfield-input-types-diff-*.png`)
- /tmp/herouse-review/text-field/render-function-{heroui,ours}-{light,dark}.png (+ `textfield-render-function-diff-*.png`)
- /tmp/herouse-review/text-field/custom-styles-{heroui,ours}-{light,dark}.png
- /tmp/herouse-review/text-field/textarea-heroui-{light,dark}.png (no herouse counterpart)
