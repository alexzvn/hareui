---
title: Popover
description: Displays rich content in a portal, anchored to a trigger element
links:
  source: popover/Popover.vue
  styles: popover/theme.ts
  heroui: popover
---

## Usage

```ts
import { Popover } from '@hareui/vue'
```

<ComponentPreview name="popover/basic" />

## Anatomy

The default slot's first child is the trigger (receives the current `open` state). The `title` slot (or `title` prop) renders an optional heading, and the `content` slot (receives a `close` callback) renders the body.

```vue
<Popover title="Title" arrow>
  <Button>Trigger</Button>
  <template #content="{ close }">
    Content
  </template>
</Popover>
```

`ui` keys: `base`, `dialog`, `heading`, `arrow`.

## Examples

### Placement

<ComponentPreview name="popover/placement" />

### With Arrow

<ComponentPreview name="popover/with-arrow" />

### Interactive Content

<ComponentPreview name="popover/interactive" />

## Customization

### Tailwind CSS

<ComponentPreview name="popover/custom-styles" />

### Global theme override

```ts
app.use(createHareUI({
  ui: {
    popover: {
      slots: { base: 'rounded-xl' },
    },
  },
}))
```

## Styling Reference

| `ui` key | `data-slot` | Description |
|---|---|---|
| `base` | `popover` | The floating surface |
| `dialog` | `popover-dialog` | The dialog wrapper around the heading/content |
| `heading` | `popover-heading` | The heading (shown when `title` prop or `title` slot is set) |
| `arrow` | `popover-overlay-arrow` | The arrow `<svg>` (shown when `arrow` is `true`) |

### Interactive states

- **Open/closed**: `data-state="open" | "closed"` (drives the enter/exit animation)
- **Side**: `data-side="top" | "right" | "bottom" | "left"`

## API Reference

### Props

<ApiTable component="Popover" kind="props" />

### Slots

<ApiTable component="Popover" kind="slots" />

### Theme

<ApiTheme component="Popover" />

## Related Components

<RelatedComponents :components="['button', 'modal']" />
