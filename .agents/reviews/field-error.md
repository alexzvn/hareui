# FieldError: docs fidelity review

**Status:** about 98%. Both demos are 0 px light and dark. The remaining gap is RAC's built-in validation; see below.

## Content diff
Section order and prose match the HeroUI mdx. The only differences are the project-wide Vue conventions used by every herouse page: an extra `## Anatomy` section, `### Global Configuration` instead of `### Global CSS`, `### Slots` / `### State Variants` instead of `### CSS Classes`, and API tables split into Props / Slots / Emits. Demos: basic, custom-styles. The intro prose said FieldError appears "when the parent field is marked as invalid" without saying how that works in herouse. It now explains the TextField `invalid` + `error-message` / `#error` wiring.

## Variant / config coverage
HeroUI API: `className`, and `children` as a node or as a function of `ValidationResult`. herouse: `class`, default slot, `id`. The function-children form (`validation.validationErrors`) has no equivalent; see below.

## Fixed
- docs/docs/components/field-error.md: intro and Accessibility bullets now describe how herouse decides visibility (rendered only while the field is `invalid`) instead of RAC's automatic validation state.

## Remaining gaps → decisions needed
1. **API-design: no built-in validation state.** HeroUI's FieldError children can be `(validation) => validation.validationErrors.join(', ')` (field-error.mdx:53). That comes from RAC's form validation (native constraint validation, `validate`, `validationBehavior`, text-field.mdx:168). herouse has no validation layer: errors are driven by `invalid` + `errorMessage`, so there is no `ValidationResult` to pass in.
   - A) Keep it consumer-driven, as today, and document it as a deliberate difference. No cost.
   - B) Add `validate?: (value) => string | string[] | true` plus native `checkValidity()` to TextField, and expose `validationErrors` as a FieldError slot prop. Medium cost; it's a new public API and also affects Checkbox and RadioGroup.
   - C) Integrate with an external form library (vee-validate) through docs recipes only. Low cost, but no built-in parity.

## Screenshots
- /tmp/herouse-review/field-error/basic-{heroui,ours}-{light,dark}.png (+ `basic-diff-*.png`)
- /tmp/herouse-review/field-error/custom-styles-{heroui,ours}-{light,dark}.png (+ `custom-styles-diff-*.png`)
