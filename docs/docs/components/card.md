---
title: Card
description: Flexible container component for grouping related content and actions
links:
  source: Card.vue
  styles: card.ts
  heroui: card
---

## Usage

```ts
import { Card } from 'herouse'
```

<ComponentPreview name="card/default" />

## Anatomy

HeroUI's compound parts (`Card.Header`, `Card.Title`, `Card.Description`, `Card.Content`,
`Card.Footer`) become named template slots in a fixed render order: `header`, content
(default slot), then `footer`.

```vue
<Card title="…" description="…">
  <!-- or: -->
  <template #header>…</template>
  <!-- default slot = content -->
  <template #footer>…</template>
</Card>
```

The header renders only when `title`/`description` props or the `#header`/`#title`/`#description`
slots are provided. The content wrapper renders only when the default slot is used. The
footer renders only when `#footer` is used.

`ui` keys: `base`, `header`, `title`, `description`, `content`, `footer`.

## Examples

### Variants

Cards come in semantic variants that describe their prominence level rather than
specific visual styles:

<ComponentPreview name="card/variants" />

- **`transparent`** — minimal prominence, transparent background (great for nested cards)
- **`default`** — standard card for most use cases (`bg-surface`)
- **`secondary`** — medium prominence (`bg-surface-secondary`)
- **`tertiary`** — higher prominence (`bg-surface-tertiary`)

### Horizontal Layout

<ComponentPreview name="card/horizontal" />

### With Avatar

<ComponentPreview name="card/with-avatar" />

### With Images

<ComponentPreview name="card/with-images" />

### With Form

<ComponentPreview name="card/with-form" />

## Customization

### Tailwind CSS

<ComponentPreview name="card/custom-styles" />

### Global theme override

```ts
app.use(createHeroUse({
  ui: {
    card: {
      slots: { title: 'text-base font-semibold' },
    },
  },
}))
```

## Styling Reference

| `ui` key | `data-slot` | Description |
|---|---|---|
| `base` | `card` | The root container |
| `header` | `card-header` | Header wrapper (title + description) |
| `title` | `card-title` | The `<h3>` title |
| `description` | `card-description` | The `<p>` description |
| `content` | `card-content` | The content wrapper for the default slot |
| `footer` | `card-footer` | Footer wrapper |

## Accessibility

```vue
<Card as="article" aria-labelledby="card-title" title="Article Title" />
```

## Related Components

- [Avatar](/docs/components/avatar)
- [Chip](/docs/components/chip)
- [Button](/docs/components/button)
- [CloseButton](/docs/components/close-button)
