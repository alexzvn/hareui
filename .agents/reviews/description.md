# Description: docs fidelity review

**Status:** 100%. Both demos are 0 px light and dark; content is complete.

## Content diff
Section order and prose match the HeroUI mdx. The only differences are the project-wide Vue conventions used by every herouse page: an extra `## Anatomy` section, `### Global Configuration` instead of `### Global CSS`, `### Slots` / `### State Variants` instead of `### CSS Classes`, and API tables split into Props / Slots / Emits. Demos: basic, custom-styles, same positions.

## Variant / config coverage
HeroUI API: `className` and `children` (RAC `Text`, renders `<span>`). herouse: `class`, default slot, `id`; renders `<span>`. Full coverage.

## Fixed
Nothing needed.

## Remaining gaps → decisions needed
None.

## Screenshots
- /tmp/herouse-review/description/basic-{heroui,ours}-{light,dark}.png (+ `basic-diff-*.png`)
- /tmp/herouse-review/description/custom-styles-{heroui,ours}-{light,dark}.png (+ `custom-styles-diff-*.png`)
