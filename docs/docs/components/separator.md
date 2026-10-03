---
title: Separator
description: Visually divide content sections
links:
  reka: separator
  source: separator/Separator.vue
  styles: separator/theme.ts
  heroui: separator
---

## Usage

```ts
import { Separator } from '@hareui/vue'
```

<ComponentPreview name="separator/basic" />

## Examples

### Variants

<ComponentPreview name="separator/variants" />

### With Surface

The Separator component adapts to different surface backgrounds for better visibility.

<ComponentPreview name="separator/with-surface" />

### Vertical

<ComponentPreview name="separator/vertical" />

### With Content

<ComponentPreview name="separator/with-content" />

### Render Function

<ComponentPreview name="separator/render-function" />

## Customization

### Tailwind CSS

<ComponentPreview name="separator/custom-styles" />

### Global theme override

Override the `separator` theme app-wide with `createHareUI`:

```ts
app.use(createHareUI({
  ui: {
    separator: {
      slots: { base: 'bg-accent h-[2px]' },
      variants: {
        orientation: { vertical: { base: 'bg-accent w-[2px]' } },
      },
    },
  },
}))
```

## Styling Reference

Each rendered element carries the same `data-slot` string as HeroUI, so selectors translate 1:1.

| `ui` key | `data-slot` | Description |
|---|---|---|
| `base` | `separator` | The separator element |

HeroUI's modifier classes correspond to these props (HareUI renders utilities, not BEM classes, so
style through `class`, `ui` or `createHareUI`):

- `orientation`: `horizontal` (default, full width / 1px height), `vertical` (full height / 1px width)
- `variant`: `default` (standard contrast), `secondary` (medium contrast), `tertiary` (subtle contrast)

## API Reference

### Props

<ApiTable component="Separator" kind="props" />

### Slots

<ApiTable component="Separator" kind="slots" />

## Related Components

<RelatedComponents :components="['surface', 'card']" />
