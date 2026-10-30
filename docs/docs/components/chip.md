---
title: Chip
description: Small informational badges for displaying labels, statuses, and categories
links:
  source: chip/Chip.vue
  styles: chip/theme.ts
  heroui: chip
---

## Usage

```ts
import { Chip } from '@hareui/vue'
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

Use the `class` prop for the root and `:ui="{ label: '…' }"` for the label (tailwind-merge resolves conflicts):

<ComponentPreview name="chip/custom-styles" />

### Global theme override

Override the `chip` theme app-wide with `createHareUI`:

```ts
app.use(
  createHareUI({
    ui: {
      chip: {
        slots: {
          base: 'rounded-full text-xs',
          label: 'font-medium',
        },
        compoundVariants: [{ color: 'accent', class: { base: 'border-accent/20 text-accent' } }],
      },
    },
  }),
)
```

## Styling Reference

Each rendered element carries a `data-slot` attribute, so you can target it with selectors.

| `ui` key | `data-slot`  | Description                                                           |
| -------- | ------------ | --------------------------------------------------------------------- |
| `base`   | `chip`       | Base chip container styles (`as`, default `span`)                     |
| `label`  | `chip-label` | Label text slot styles, rendered when `label`/default slot is present |

These props set the appearance (HareUI renders utility classes, so style through `class`, `ui` or
`createHareUI`):

- `color`: `accent`, `danger`, `default`, `success`, `warning`
- `variant`: `primary` (filled background), `secondary` (default), `tertiary` (transparent background), `soft` (lighter background)
- `size`: `sm`, `md` (default), `lg`

Compound variants combine `variant` and `color`:

- **Primary**: `accent`, `success`, `warning` and `danger` get a filled background.
- **Soft**: `accent`, `success`, `warning`, `danger` and `default` get a lighter background.

Other combinations (e.g. `variant="secondary" color="accent"`) can be styled with a `compoundVariants` entry in the global theme override.

## API Reference

### Props

<ApiTable component="Chip" kind="props" />

### Slots

<ApiTable component="Chip" kind="slots" />

## Theme

<ApiTheme component="Chip" />

## Related Components

<RelatedComponents :components="['avatar', 'card']" />
