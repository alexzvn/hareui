---
title: Badge
description: Displays a small indicator positioned relative to another element, commonly used for notification counts, status dots, and labels
links:
  source: badge/Badge.vue
  styles: badge/theme.ts
  heroui: badge
---

## Usage

```ts
import { Badge } from '@hareui/vue'
```

<ComponentPreview name="badge/basic" />

## Anatomy

```vue
<template>
  <!-- the default slot is the anchored element (HeroUI's Badge.Anchor children) -->
  <Badge content="5">
    <Avatar fallback="JD" />
  </Badge>
</template>
```

| `ui` key | Element | Description |
|---|---|---|
| `anchor` | `[data-slot="badge-anchor"]` | Wraps the default slot; only rendered when it is filled |
| `base` | `[data-slot="badge"]` | The badge (receives `class`) |
| `label` | `[data-slot="badge-label"]` | Wraps `content` (HeroUI's `Badge.Label`) |

## Examples

### Variants

<ComponentPreview name="badge/variants" />

### Sizes

<ComponentPreview name="badge/sizes" />

### Colors

<ComponentPreview name="badge/colors" />

### Placements

<ComponentPreview name="badge/placements" />

### Dot Badge

Empty badges act as status indicators — useful for online/offline states or activity signals.

<ComponentPreview name="badge/dot" />

### With Content

Badge supports text, numbers, and icons as content. When no content is provided, it renders as a dot indicator.

<ComponentPreview name="badge/with-content" />

## Customization

### Tailwind CSS

<ComponentPreview name="badge/custom-styles" />

### Global theme override

```ts
app.use(createHareUI({
  ui: {
    badge: {
      slots: { base: 'border-2' },
      defaultVariants: { size: 'sm' },
    },
  },
}))
```

## Styling Reference

### Slots

- `anchor` → `[data-slot="badge-anchor"]` – Positioning wrapper (`relative inline-flex`)
- `base` → `[data-slot="badge"]` – Badge styles; colors come from `--badge-bg`, `--badge-fg` and `--badge-border`
- `label` → `[data-slot="badge-label"]` – Text content padding

### Variants

- `color`: `default`, `accent`, `success`, `warning`, `danger`
- `variant`: `primary` (solid background), `secondary` (default background, colored text), `soft` (muted background)
- `size`: `sm`, `md`, `lg`
- `placement`: `top-right`, `top-left`, `bottom-right`, `bottom-left`

## API Reference

### Props

<ApiTable component="Badge" kind="props" />

### Slots

<ApiTable component="Badge" kind="slots" />

### Theme

<ApiTheme component="Badge" />

## Related Components

<RelatedComponents :components="['avatar', 'chip']" />
