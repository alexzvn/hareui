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
app.use(
  createHareUI({
    ui: {
      separator: {
        slots: { base: 'bg-accent h-[2px]' },
        variants: {
          orientation: { vertical: { base: 'bg-accent w-[2px]' } },
        },
      },
    },
  }),
)
```

## Styling Reference

Each rendered element carries a `data-slot` attribute you can target in selectors.

| `ui` key | `data-slot` | Description           |
| -------- | ----------- | --------------------- |
| `base`   | `separator` | The separator element |

These props control styling:

- `orientation`: `horizontal` (default, full width / 1px height), `vertical` (full height / 1px width)
- `variant`: `default` for standard contrast, `secondary` for medium contrast, `tertiary` for subtle contrast

### CSS Classes

HareUI follows the [BEM](https://getbem.com/) methodology to keep component variants and states reusable and easy to customize. The Separator component uses these CSS classes ([View source styles](https://github.com/alexzvn/hareui/blob/main/packages/vue/src/components/separator/separator.css)):

#### Base & Orientation Classes

- `.h-separator` - Base separator styles
- `.h-separator--horizontal` - Horizontal orientation (full width, 1px height)
- `.h-separator--vertical` - Vertical orientation (full height, 1px width)

#### Variant Classes

- `.h-separator--default` - Default variant with standard contrast
- `.h-separator--secondary` - Secondary variant with medium contrast
- `.h-separator--tertiary` - Tertiary variant with subtle contrast

The classes sit in `@layer components`, so a utility you pass through `class` or `ui` wins over them.

## API Reference

### Props

<ApiTable component="Separator" kind="props" />

### Slots

<ApiTable component="Separator" kind="slots" />

## Theme

<ApiTheme component="Separator" />

## Related Components

<RelatedComponents :components="['surface', 'card']" />
