---
title: Surface
description: Container component that provides surface-level styling and context for child components
links:
  source: surface/Surface.vue
  styles: surface/theme.ts
  heroui: surface
---

## Usage

```ts
import { Surface } from '@hareui/vue'
```

<ComponentPreview name="surface/basic" />

## Examples

### Variants

Surface comes in semantic variants that describe their prominence level:

- **`default`** - Standard surface appearance (bg-surface)
- **`secondary`** - Medium prominence (bg-surface-secondary)
- **`tertiary`** - Higher prominence (bg-surface-tertiary)

<ComponentPreview name="surface/variants" />

### With Form Components

When using form components inside a Surface, use the `variant="secondary"` prop on them to apply
the lower-emphasis variant suitable for surface backgrounds.

<ComponentPreview name="surface/with-form-components" />

## Customization

### Tailwind CSS

<ComponentPreview name="surface/custom-styles" />

### Global theme override

Override the `surface` theme app-wide with `createHareUI`:

```ts
app.use(
  createHareUI({
    ui: {
      surface: {
        slots: { base: 'rounded-2xl border border-border' },
        variants: {
          variant: { secondary: { base: 'bg-gradient-to-br from-blue-50 to-purple-50' } },
        },
      },
    },
  }),
)
```

## Styling Reference

Each rendered element carries the same `data-slot` string as HeroUI, so selectors translate 1:1.

| `ui` key | `data-slot` | Description            |
| -------- | ----------- | ---------------------- |
| `base`   | `surface`   | Base surface container |

HeroUI's `.surface--*` modifier classes correspond to the `variant` prop (HareUI renders utilities,
not BEM classes, so style through `class`, `ui` or `createHareUI`): `transparent`, `default`,
`secondary`, `tertiary`.

## API Reference

### Props

<ApiTable component="Surface" kind="props" />

### Slots

<ApiTable component="Surface" kind="slots" />

### Theme

<ApiTheme component="Surface" />

## Context API

### surfaceContextKey

Child components can inject the Surface context to read the current variant:

```ts
import { surfaceContextKey } from '@hareui/vue'
import { inject } from 'vue'

const ctx = inject(surfaceContextKey)
// ctx?.variant.value is a Ref<'transparent' | 'default' | 'secondary' | 'tertiary'>
```

## Related Components

<RelatedComponents :components="['separator', 'card']" />
