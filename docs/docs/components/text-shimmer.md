---
title: Text Shimmer
description: Text with a highlight that sweeps across it, for work in progress such as a reply being prepared.
links:
  source: text-shimmer/TextShimmer.vue
  styles: text-shimmer/theme.ts
---

## Usage

Pass the text to the `text` prop. It shows at a dimmed version of the current colour while a band of full colour sweeps across it. The colour comes from the parent, so set it with a text colour class.

```ts
import { TextShimmer } from '@hareui/vue'
```

<ComponentPreview name="text-shimmer/basic" />

## Anatomy

```vue
<TextShimmer text="…">
  <template #default />  <!-- optional: content in place of `text` -->
</TextShimmer>
```

The content renders twice: once as the visible text, and once as the mask the highlight shows through. Screen readers skip the mask, so they read the text once. With reduced motion the highlight is gone and the text shows at full colour.

### Speed and spread

`duration` sets how many seconds one sweep takes. `spread` sets how far the highlight reaches either side of its centre, in characters.

<ComponentPreview name="text-shimmer/speed" />

### Custom content

Use the default slot for content other than plain text, such as an icon before the words. Both copies inherit the root's layout, so a `flex` root lines up icons the same way in each.

Keep the slot content static. It renders twice, so a component with its own state or timers runs twice.

<ComponentPreview name="text-shimmer/custom-content" />

### Custom element

The root renders a `span` by default. Use `as` to render another element, such as a heading.

<ComponentPreview name="text-shimmer/element" />

### In a reasoning header

The most common place for a shimmer is the trigger of a [ChainOfThought](/docs/components/chain-of-thought) while the reasoning streams in. Fill its `#label` slot to shimmer your own text and icon, then show a plain summary once `streaming` ends.

<ComponentPreview name="text-shimmer/reasoning" />

## API

### TextShimmer props

<ApiTable component="TextShimmer" kind="props" />

### TextShimmer slots

<ApiTable component="TextShimmer" kind="slots" />

## Theme

<ApiTheme component="TextShimmer" />
