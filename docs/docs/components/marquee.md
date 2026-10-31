---
title: Marquee
description: Content that scrolls in an endless loop, for rows of logos, testimonials or tags.
links:
  source: marquee/Marquee.vue
  styles: marquee/theme.ts
---

## Usage

```ts
import { Marquee } from '@hareui/vue'
```

Put the content in the default slot. The marquee repeats it and scrolls it in a seamless loop. A horizontal marquee
fills the width of its container and never stretches it, however long the content.

<ComponentPreview name="marquee/basic" />

## Anatomy

```vue
<Marquee>
  <!-- the content, repeated `repeat` times -->
</Marquee>
```

The root holds `repeat` copies of the slot content.

## Examples

### Orientation

Set `orientation="vertical"` to scroll up and down. A vertical marquee needs a height.

<ComponentPreview name="marquee/vertical" />

### Reverse

`reverse` scrolls the other way. By default a horizontal marquee follows the reading direction: it moves left on
left-to-right pages and right on right-to-left pages.

<ComponentPreview name="marquee/reverse" />

### Pause on Hover

`pause-on-hover` stops the animation while the pointer is over the marquee, so longer content such as reviews can be
read.

<ComponentPreview name="marquee/pause-on-hover" />

### Overlay

The ends fade into the page background. Set `:overlay="false"` to turn the fade off, for example on a surface of
another colour.

<ComponentPreview name="marquee/overlay" />

### Repeat

`repeat` sets how many copies are rendered (4 by default). Raise it when the content is shorter than the marquee, so
the loop shows no gap.

### Speed and Spacing

One loop takes 20 s and items sit 64 px apart. Change them with these CSS variables on the root, through `class` or
`ui.root`:

- `--marquee-duration`: the time of one loop
- `--marquee-gap`: the space between items

<ComponentPreview name="marquee/duration" />

## Accessibility

- Screen readers read the content once: copies after the first carry `aria-hidden="true"`.
- Links and buttons in those copies are skipped by the Tab key, so keyboard users reach each one once.
- When reduced motion is requested, by the system setting or a `data-reduce-motion="true"` ancestor, the content
  holds still.

## API Reference

### Props

<ApiTable component="Marquee" kind="props" />

### Slots

<ApiTable component="Marquee" kind="slots" />

## Theme

<ApiTheme component="Marquee" />
