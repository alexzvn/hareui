---
title: Card
description: Flexible container component for grouping related content and actions
links:
  source: card/Card.vue
  styles: card/theme.ts
  heroui: card
---

## Usage

```ts
import { Card } from '@hareui/vue'
```

<ComponentPreview name="card/default" />

## Anatomy

Card is composed through props and named slots, rendered in a fixed order: `#leading`, header,
content (default slot), then `#footer`.

```vue
<Card title="…" description="…">
  <template #leading /> <!-- unwrapped children before the header (icon, image, background) -->
  <template #header /> <!-- or: replaces title + description -->
  <template #title /> <!-- or: replaces the title text -->
  <template #description /> <!-- or: replaces the description text -->
  <!-- default slot = Card.Content -->
  <template #footer />
</Card>
```

- The header renders only when you set `title` or `description`, or fill a header slot.
- The content wrapper renders only when the default slot is used. The footer renders only when `#footer` is used.
- `#leading` renders its children directly inside the root, without a wrapper, so they become flex items of the card.

## Examples

### Variants

Cards come in semantic variants that describe their prominence level rather than specific visual styles. This allows themes to interpret them differently:

<ComponentPreview name="card/variants" />

- **`transparent`** - Minimal prominence, transparent background (great for nested cards)
- **`default`** - Standard card for most use cases (`bg-surface`)
- **`secondary`** - Medium prominence to draw moderate attention (`bg-surface-secondary`)
- **`tertiary`** - Higher prominence for important content (`bg-surface-tertiary`)

### Horizontal Layout

Put the media in `#leading` and the rest in the default slot. The root then has two flex items, so
`md:flex-row` lays them out side by side. `:ui="{ content: 'gap-3' }"` turns the content wrapper
into the right-hand column.

<ComponentPreview name="card/horizontal" />

### With Avatar

<ComponentPreview name="card/with-avatar" />

### With Images

<ComponentPreview name="card/with-images" />

### With Form

<ComponentPreview name="card/with-form" />

## Customization

### Tailwind CSS

Use the `class` prop for the root and the `ui` prop for the inner elements (tailwind-merge resolves conflicts):

<ComponentPreview name="card/custom-styles" />

### Global theme override

Override the `card` theme app-wide with `createHareUI`:

```ts
app.use(
  createHareUI({
    ui: {
      card: {
        variants: {
          variant: { secondary: { base: 'bg-linear-to-br from-blue-50 to-purple-50' } },
        },
        slots: { title: 'text-xl font-bold' },
      },
    },
  }),
)
```

### Title and description in custom wrappers

When a layout puts the title or description inside your own markup (like the horizontal layout
above), resolve the Card theme with `tv` to reuse its slot classes:

```vue
<template>
  <Card class="md:flex-row" :ui="{ content: 'gap-3' }">
    <template #leading>
      <img class="size-[120px] rounded-2xl object-cover" src="…" alt="…" />
    </template>
    <div class="flex flex-col gap-1">
      <h3 data-slot="card-title" :class="card.title({ class: 'pe-8' })">Become an ACME Creator!</h3>
      <p data-slot="card-description" :class="card.description()">Lorem ipsum dolor sit amet.</p>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { Card, themes, tv } from '@hareui/vue'

const card = tv(themes.card)()
</script>
```

`tv(themes.card)` uses the default theme. App-wide `createHareUI` overrides don't apply to these
classes.

## Styling Reference

Each rendered element carries a `data-slot` attribute, so you can target it with selectors.

| `ui` key      | `data-slot`        | Description                                            |
| ------------- | ------------------ | ------------------------------------------------------ |
| `base`        | `card`             | Base container with padding and border radius          |
| `header`      | `card-header`      | Header section container                               |
| `title`       | `card-title`       | Title with base font size and weight (renders as `h3`) |
| `description` | `card-description` | Muted description text (renders as `p`)                |
| `content`     | `card-content`     | Flexible content container (default slot)              |
| `footer`      | `card-footer`      | Footer with row layout                                 |

### CSS Classes

HareUI follows the [BEM](https://getbem.com/) methodology to keep component variants and states reusable and easy to customize. The Card component uses these CSS classes ([View source styles](https://github.com/alexzvn/hareui/blob/main/packages/vue/src/components/card/card.css)):

#### Base Classes

- `.h-card` - Base container with padding and border radius
- `.h-card__header` - Header section container
- `.h-card__title` - Title with base font size and weight
- `.h-card__description` - Muted description text
- `.h-card__content` - Flexible content container
- `.h-card__footer` - Footer with row layout

#### Variant Classes

- `.h-card--transparent` - Minimal prominence, transparent background
- `.h-card--default` - Standard appearance on the surface (default)
- `.h-card--secondary` - Medium prominence on the secondary surface
- `.h-card--tertiary` - Higher prominence on the tertiary surface

The classes sit in `@layer components`, so a utility you pass through `class` or `ui` wins over them.

## API Reference

### Props

<ApiTable component="Card" kind="props" />

### Slots

<ApiTable component="Card" kind="slots" />

## Theme

<ApiTheme component="Card" />

## Accessibility

```vue
<template>
  <!-- Semantic markup -->
  <Card as="article" aria-labelledby="card-title">
    <template #title>
      <span id="card-title">Article Title</span>
    </template>
  </Card>

  <!-- Interactive cards -->
  <a :class="card.base()" href="/details" aria-label="View product details">
    <h3 :class="card.title()">Product Name</h3>
  </a>
</template>

<script setup lang="ts">
import { Card, themes, tv } from '@hareui/vue'

const card = tv(themes.card)()
</script>
```

## Related Components

<RelatedComponents :components="['avatar', 'chip', 'button', 'close-button']" />
