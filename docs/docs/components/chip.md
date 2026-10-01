---
title: Chip
description: Small informational badges for displaying labels, statuses, and categories
links:
  source: Chip.vue
  styles: chip.ts
  heroui: chip
---

## Usage

```ts
import { Chip } from 'herouse'
```

<ComponentPreview name="chip/basic" />

## Anatomy

> Plain-text default slot content is automatically wrapped in the `label` element.

```vue
<Chip>
  <template #leading />
  Label text
  <template #trailing />
</Chip>
```

`ui` keys: `base`, `label`.

## Examples

### Variants

<ComponentPreview name="chip/variants" />

### Statuses

<ComponentPreview name="chip/statuses" />

### With Icons

<ComponentPreview name="chip/with-icon" />

## Customization

### Tailwind CSS

<ComponentPreview name="chip/custom-styles" />

### Global theme override

```ts
app.use(createHeroUse({
  ui: {
    chip: {
      slots: { base: 'rounded-full' },
    },
  },
}))
```

## Styling Reference

| `ui` key | `data-slot` | Description |
|---|---|---|
| `base` | `chip` | The root element (`as`, default `span`) |
| `label` | `chip-label` | The label wrapper, rendered when `label`/default slot is present |

Chips support combining `variant` and `color` via compound variants (e.g. `variant="primary"
color="accent"` gets a filled accent background; `variant="soft" color="success"` gets a
lighter success background).

## API Reference

### Props

<ApiTable component="Chip" kind="props" />

### Slots

<ApiTable component="Chip" kind="slots" />

## Related Components

- [Avatar](/docs/components/avatar)
- [Card](/docs/components/card)
