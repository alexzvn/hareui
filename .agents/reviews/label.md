# Label: docs fidelity review

**Status:** 100%. Both demos match pixel for pixel (0 px, light and dark); content is complete.

## Content diff
Section order and prose match the HeroUI mdx. The only differences are the project-wide Vue conventions used by every herouse page: an extra `## Anatomy` section, `### Global Configuration` instead of `### Global CSS`, `### Slots` / `### State Variants` instead of `### CSS Classes`, and API tables split into Props / Slots / Emits. No missing, extra or reordered demos (basic, custom-styles).

## Variant / config coverage
HeroUI API: `isRequired`, `isDisabled`, `isInvalid`, `htmlFor`, `className`, `children`. herouse equivalents: `required`, `disabled`, `invalid`, `for`, `class`, default slot. Ancestor rules (`[data-required]`, `[data-disabled]`, `[data-invalid]`) are replicated in theme/label.ts. Full coverage.

## Fixed
Nothing needed.

## Remaining gaps → decisions needed
None.

## Screenshots
- /tmp/herouse-review/label/basic-{heroui,ours}-{light,dark}.png (+ `basic-diff-*.png`)
- /tmp/herouse-review/label/custom-styles-{heroui,ours}-{light,dark}.png (+ `custom-styles-diff-*.png`)
