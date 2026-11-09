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
  <!-- the default slot is the anchored element -->
  <Badge content="5">
    <Avatar fallback="JD" />
  </Badge>
</template>
```

| `ui` key | Element                      | Description                                             |
| -------- | ---------------------------- | ------------------------------------------------------- |
| `anchor` | `[data-slot="badge-anchor"]` | Wraps the default slot; only rendered when it is filled |
| `base`   | `[data-slot="badge"]`        | The badge (receives `class`)                            |
| `label`  | `[data-slot="badge-label"]`  | Wraps `content`                                         |

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
app.use(
  createHareUI({
    ui: {
      badge: {
        slots: { base: 'border-2' },
        defaultVariants: { size: 'sm' },
      },
    },
  }),
)
```

## Styling Reference

### Slots

- `anchor` → `[data-slot="badge-anchor"]` – Positioning wrapper (`relative inline-flex`)
- `base` → `[data-slot="badge"]` – Badge styles. Colors come from `--badge-bg`, `--badge-fg` and `--badge-border`
- `label` → `[data-slot="badge-label"]` – Text content padding

### Variants

- `color`: `default`, `accent`, `success`, `warning`, `danger`
- `variant`: `primary` (solid background), `secondary` (default background, colored text), `soft` (muted background)
- `size`: `sm`, `md`, `lg`
- `placement`: `top-right`, `top-left`, `bottom-right`, `bottom-left`

### CSS Classes

HareUI follows the [BEM](https://getbem.com/) methodology to keep component variants and states reusable and easy to customize. The Badge component uses these CSS classes ([View source styles](https://github.com/alexzvn/hareui/blob/main/packages/vue/src/components/badge/badge.css)):

#### Base Classes

- `.h-badge` - Base badge container styles
- `.h-badge__label` - Label text slot styles
- `.h-badge-anchor` - Positioning wrapper for the anchored element

#### Color Classes

- `.h-badge--accent` - Accent color variant
- `.h-badge--danger` - Danger color variant
- `.h-badge--default` - Default color variant
- `.h-badge--success` - Success color variant
- `.h-badge--warning` - Warning color variant

#### Variant Classes

- `.h-badge--primary` - Primary variant with filled background
- `.h-badge--soft` - Soft variant with lighter background

The `secondary` variant adds no class: it keeps the default background.

#### Size Classes

- `.h-badge--sm` - Small size
- `.h-badge--lg` - Large size

The default `md` size adds no class.

#### Placement Classes

- `.h-badge--top-right` - Position at top-right corner (default)
- `.h-badge--top-left` - Position at top-left corner
- `.h-badge--bottom-right` - Position at bottom-right corner
- `.h-badge--bottom-left` - Position at bottom-left corner

#### Compound Variant Classes

- `.h-badge--primary.h-badge--accent` - Primary accent with filled background
- `.h-badge--primary.h-badge--default` - Primary default with filled background
- `.h-badge--primary.h-badge--success` - Primary success with filled background
- `.h-badge--primary.h-badge--warning` - Primary warning with filled background
- `.h-badge--primary.h-badge--danger` - Primary danger with filled background
- `.h-badge--soft.h-badge--accent` - Soft accent with lighter background
- `.h-badge--soft.h-badge--default` - Soft default with lighter background
- `.h-badge--soft.h-badge--success` - Soft success with lighter background
- `.h-badge--soft.h-badge--warning` - Soft warning with lighter background
- `.h-badge--soft.h-badge--danger` - Soft danger with lighter background

The classes sit in `@layer components`, so a utility you pass through `class` or `ui` wins over them.

## API Reference

### Props

<ApiTable component="Badge" kind="props" />

### Slots

<ApiTable component="Badge" kind="slots" />

## Theme

<ApiTheme component="Badge" />

## Related Components

<RelatedComponents :components="['avatar', 'chip']" />
