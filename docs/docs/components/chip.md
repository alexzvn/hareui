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

## Examples

### Variants

<ComponentPreview name="chip/variants" />

### Statuses

<ComponentPreview name="chip/statuses" />

### With Icons

<ComponentPreview name="chip/with-icon" />

## Customization

### Tailwind CSS

Use the `class` prop for the root and `:ui="{ label: '…' }"` for the label (a utility wins over the component's class):

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

These props set the appearance:

- `color`: `accent`, `danger`, `default`, `success`, `warning`
- `variant`: `primary` (filled background), `secondary` (default), `tertiary` (transparent background), `soft` (lighter background)
- `size`: `sm`, `md` (default), `lg`

Compound variants combine `variant` and `color`:

- **Primary**: `accent`, `success`, `warning` and `danger` get a filled background.
- **Soft**: `accent`, `success`, `warning`, `danger` and `default` get a lighter background.

Other combinations (e.g. `variant="secondary" color="accent"`) can be styled with a `compoundVariants` entry in the global theme override.

### CSS Classes

HareUI follows the [BEM](https://getbem.com/) methodology to keep component variants and states reusable and easy to customize. The Chip component uses these CSS classes ([View source styles](https://github.com/alexzvn/hareui/blob/main/packages/vue/src/components/chip/chip.css)):

#### Base Classes

- `.h-chip` - Base chip container styles
- `.h-chip__label` - Label text slot styles

#### Color Classes

- `.h-chip--accent` - Accent color variant
- `.h-chip--danger` - Danger color variant
- `.h-chip--default` - Default color variant
- `.h-chip--success` - Success color variant
- `.h-chip--warning` - Warning color variant

#### Variant Classes

- `.h-chip--primary` - Primary variant with filled background
- `.h-chip--tertiary` - Tertiary variant with transparent background
- `.h-chip--soft` - Soft variant with lighter background

The default `secondary` variant adds no class.

#### Size Classes

- `.h-chip--sm` - Small size
- `.h-chip--lg` - Large size

The default `md` size adds no class.

#### Compound Variant Classes

- `.h-chip--primary.h-chip--accent` - Primary accent combination with filled background
- `.h-chip--primary.h-chip--success` - Primary success combination with filled background
- `.h-chip--primary.h-chip--warning` - Primary warning combination with filled background
- `.h-chip--primary.h-chip--danger` - Primary danger combination with filled background
- `.h-chip--soft.h-chip--accent` - Soft accent combination with lighter background
- `.h-chip--soft.h-chip--success` - Soft success combination with lighter background
- `.h-chip--soft.h-chip--warning` - Soft warning combination with lighter background
- `.h-chip--soft.h-chip--danger` - Soft danger combination with lighter background
- `.h-chip--soft.h-chip--default` - Soft default combination with lighter background

The classes sit in `@layer components`, so a utility you pass through `class` or `ui` wins over them.

## API Reference

### Props

<ApiTable component="Chip" kind="props" />

### Slots

<ApiTable component="Chip" kind="slots" />

## Theme

<ApiTheme component="Chip" />

## Related Components

<RelatedComponents :components="['avatar', 'card']" />
